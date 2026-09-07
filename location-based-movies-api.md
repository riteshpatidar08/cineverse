# Location-Based Movies API — Spec

Show movies **currently running in theaters near the user's city**, grouped by theater.

---

## How It Works (Big Picture)

```
Browser → gets lat/lon via Geolocation API
       → sends lat, lon to backend
Backend → finds nearby Theaters (geo query on Theater.location)
        → finds active Shows for today tied to those theaters
        → populates Movie details on each show
        → returns grouped result: [ { theater, shows: [ { movie, times… } ] } ]
```

---

## 1. Database Changes

### 1.1 Theater Model — add `2dsphere` index

The `theaterModel.js` already stores a GeoJSON `location` field but the index is missing.

```js
// Add at the bottom of theaterModel.js, before module.exports
theaterSchema.index({ location: '2dsphere' });
```

> **GeoJSON shape expected in every Theater document:**
> ```json
> {
>   "location": {
>     "type": "Point",
>     "coordinates": [75.7873, 26.9124]   // [longitude, latitude]
>   }
> }
> ```

### 1.2 Show Model — export + add index

`showModel.js` never exports the model. Fix that and add a compound index for fast lookup.

```js
// At the end of showModel.js
const Show = mongoose.model('Show', showSchema);
module.exports = Show;

// Compound index: find today's active shows for a set of theaters fast
showSchema.index({ theaterId: 1, startTime: 1, isActive: 1 });
```

---

## 2. New API Endpoint

### `GET /api/v1/shows/now-playing`

**Query Params**

| Param | Type | Required | Default | Description |
|---|---|---|---|---|
| `lat` | Number | ✅ | — | User latitude |
| `lon` | Number | ✅ | — | User longitude |
| `radius` | Number | ❌ | `20000` | Search radius in **meters** (default 20 km) |
| `date` | String | ❌ | today | ISO date string `YYYY-MM-DD` |
| `page` | Number | ❌ | `1` | Pagination |
| `limit` | Number | ❌ | `10` | Theaters per page |

**Example Request**
```
GET /api/v1/shows/now-playing?lat=26.9124&lon=75.7873&radius=15000
```

---

## 3. Backend Implementation

### 3.1 Route — `server/routes/showRoutes.js` *(new file)*

```js
const express = require('express');
const { getNowPlaying } = require('../controllers/showController.js');

const router = express.Router();

router.get('/now-playing', getNowPlaying);

module.exports = router;
```

Register in `app.js`:
```js
const showRoutes = require('./routes/showRoutes.js');
app.use('/api/v1/shows', showRoutes);
```

---

### 3.2 Controller — `server/controllers/showController.js` *(new file)*

```js
const asyncHandler = require('express-async-handler');
const Theater = require('../models/theaterModel.js');
const Show    = require('../models/showModel.js');

// @desc  Get movies now-playing grouped by nearby theaters
// @route GET /api/v1/shows/now-playing
exports.getNowPlaying = asyncHandler(async (req, res) => {
  const { lat, lon, radius = 20000, date, page = 1, limit = 10 } = req.query;

  // ── 1. Validate coords ──────────────────────────────────────────
  if (!lat || !lon) {
    res.status(400);
    throw new Error('lat and lon query params are required.');
  }

  const latitude  = parseFloat(lat);
  const longitude = parseFloat(lon);

  if (isNaN(latitude) || isNaN(longitude)) {
    res.status(400);
    throw new Error('lat and lon must be valid numbers.');
  }

  // ── 2. Find nearby theaters (geo query) ─────────────────────────
  const skip = (Number(page) - 1) * Number(limit);

  const theaters = await Theater.find({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [longitude, latitude] },
        $maxDistance: Number(radius),
      },
    },
  })
    .skip(skip)
    .limit(Number(limit));

  if (!theaters.length) {
    return res.status(200).json({
      success: true,
      count: 0,
      data: [],
      message: 'No theaters found near your location.',
    });
  }

  const theaterIds = theaters.map((t) => t._id);

  // ── 3. Build date range (start of day → end of day) ─────────────
  const targetDate = date ? new Date(date) : new Date();
  const dayStart   = new Date(targetDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(targetDate);
  dayEnd.setHours(23, 59, 59, 999);

  // ── 4. Fetch today's active shows for those theaters ────────────
  const shows = await Show.find({
    theaterId: { $in: theaterIds },
    startTime: { $gte: dayStart, $lte: dayEnd },
    isActive: true,
  })
    .populate('movieId', 'title poster duration genres censorRating releaseDate')
    .sort({ theaterId: 1, startTime: 1 });

  // ── 5. Group shows by theater ───────────────────────────────────
  const theaterMap = {};
  theaters.forEach((t) => {
    theaterMap[t._id.toString()] = {
      theater: {
        _id:      t._id,
        name:     t.name,
        city:     t.city,
        location: t.location,
      },
      movies: {},   // movieId → { movie info, showTimes[] }
    };
  });

  shows.forEach((show) => {
    const tKey = show.theaterId.toString();
    if (!theaterMap[tKey]) return;

    const mKey = show.movieId?._id?.toString();
    if (!mKey) return;

    if (!theaterMap[tKey].movies[mKey]) {
      theaterMap[tKey].movies[mKey] = {
        movie:     show.movieId,
        showTimes: [],
      };
    }

    theaterMap[tKey].movies[mKey].showTimes.push({
      showId:         show._id,
      screen:         show.screen,
      startTime:      show.startTime,
      endTime:        show.endTime,
      language:       show.language,
      format:         show.format,
      availableCount: show.availableCount,
      priceByClass:   show.priceByClass,
    });
  });

  // ── 6. Shape final response ─────────────────────────────────────
  const result = Object.values(theaterMap)
    .map(({ theater, movies }) => ({
      theater,
      movies: Object.values(movies),
    }))
    .filter((entry) => entry.movies.length > 0); // drop theaters with no shows

  res.status(200).json({
    success:    true,
    count:      result.length,
    date:       dayStart.toISOString().split('T')[0],
    radiusInKm: Number(radius) / 1000,
    data:       result,
  });
});
```

---

## 4. Response Shape

```json
{
  "success": true,
  "count": 2,
  "date": "2026-09-07",
  "radiusInKm": 20,
  "data": [
    {
      "theater": {
        "_id": "...",
        "name": "PVR Cinemas - Pink Square",
        "city": "Jaipur",
        "location": { "type": "Point", "coordinates": [75.78, 26.91] }
      },
      "movies": [
        {
          "movie": {
            "_id": "...",
            "title": "Deadpool & Wolverine",
            "poster": "https://...",
            "duration": 128,
            "genres": ["Action", "Comedy"],
            "censorRating": "UA"
          },
          "showTimes": [
            {
              "showId": "...",
              "screen": "Audi 3",
              "startTime": "2026-09-07T10:30:00.000Z",
              "endTime": "2026-09-07T12:38:00.000Z",
              "language": "English",
              "format": "IMAX",
              "availableCount": 145,
              "priceByClass": ["Gold:300", "Premium:500"]
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 5. Frontend Integration

### 5.1 Get user coordinates (already done in `Navbar.jsx`)

The `currentLoc` / `currentState` state already resolves the city name.  
For the API you need the raw `lat` / `lon` — store them too:

```js
// In Navbar.jsx useEffect (or a shared context/redux slice)
navigator.geolocation.getCurrentPosition((position) => {
  const { latitude, longitude } = position.coords;
  setLat(latitude);
  setLon(longitude);
  getDistrict(latitude, longitude).then(({ city, state }) => { … });
});
```

### 5.2 API call — `client/src/services/show.api.js` *(new file)*

```js
import api from '../lib/api.js';

/**
 * Fetch now-playing movies near the user
 * @param {number} lat
 * @param {number} lon
 * @param {object} options  - { radius, date, page, limit }
 */
export const getNowPlaying = (lat, lon, options = {}) => {
  const params = { lat, lon, ...options };
  return api.get('/shows/now-playing', { params });
};
```

### 5.3 Usage in the Movies page

```js
import { getNowPlaying } from '../services/show.api.js';

useEffect(() => {
  if (!lat || !lon) return;
  getNowPlaying(lat, lon, { radius: 20000 })
    .then(res => setNowPlaying(res.data.data))
    .catch(console.error);
}, [lat, lon]);
```

---

## 6. Seeding Test Data

Run the existing `server/seeders/movieSeed.js` first, then add a show seeder.  
Key thing: every Theater document **must** have the GeoJSON `location` field with `type: "Point"`.

```js
// Example theater seed entry
{
  name: "PVR Cinemas - Pink Square",
  city: "Jaipur",
  location: {
    type: "Point",
    coordinates: [75.7873, 26.9124]   // ⚠️ [lon, lat] order for GeoJSON
  },
  screens: [ … ]
}
```

---

## 7. Checklist

- [ ] Add `theaterSchema.index({ location: '2dsphere' })` in `theaterModel.js`
- [ ] Export `Show` model and add compound index in `showModel.js`
- [ ] Create `server/routes/showRoutes.js`
- [ ] Create `server/controllers/showController.js`
- [ ] Register show routes in `server/app.js`
- [ ] Create `client/src/services/show.api.js`
- [ ] Store raw `lat`/`lon` in Redux or component state (alongside city name)
- [ ] Wire `getNowPlaying` into the Movies page
- [ ] Seed theaters with valid GeoJSON coordinates

---

## 8. Key Notes

- **Coordinate order** — MongoDB GeoJSON always uses `[longitude, latitude]`, not `[lat, lon]`. The Nominatim API returns `lat`/`lon` separately — keep that straight.
- **`$near` requires the `2dsphere` index** to exist before the query runs. Add the index before deploying.
- **Shows without a matching theater** in the geo result are automatically excluded by the group step.
- **Radius default is 20 km** — for metro cities you can shrink it; for smaller towns increase it.
