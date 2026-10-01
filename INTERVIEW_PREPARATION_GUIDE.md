# 🎬 cineVerse — Comprehensive Interview Preparation Guide

Welcome to the **cineVerse Technical Interview Preparation Guide**. This document synthesizes all system features, architectural patterns, database schemas, frontend state flows, and full-stack interview questions based directly on the **cineVerse** codebase.

---

## 📌 Table of Contents
1. [Project Overview & Key Features](#1-project-overview--key-features)
2. [Full Stack Architecture Overview](#2-full-stack-architecture-overview)
3. [Database Schemas & Data Modeling](#3-database-schemas--data-modeling)
4. [Backend Engineering & API Concepts](#4-backend-engineering--api-concepts)
5. [Frontend Engineering & UI State Architecture](#5-frontend-engineering--ui-state-architecture)
6. [Top Technical Interview Questions & Answers](#6-top-technical-interview-questions--answers)
   - [Backend & Database Questions](#a-backend--database-questions)
   - [Frontend & React/Redux Questions](#b-frontend--reactredux-questions)
   - [System Design & Performance Questions](#c-system-design--performance-questions)

---

## 1. Project Overview & Key Features

**cineVerse** is a production-ready movie ticket booking platform modeled after platforms like BookMyShow and District.

### 🌟 Key Platform Features:
- **Location-Based Movie Discovery**: Automatically acquires user geolocation (Latitude & Longitude) via browser Geolocation API, performs reverse geocoding, and fetches theaters & movies showing in the user's current city.
- **Content-Dense Minimalist UI**: High-density typography, custom light design system (`index.css`), primary brand palette (`#471b8e`), with responsive layout and input field icon integrations.
- **Movie Catalog & Details**: Comprehensive movie view featuring duration, genres, censor ratings (`U`, `UA`, `A`), cast & crew details, and trailer links.
- **Seat Booking Engine**: Interactive theater screen selection and showtime seat booking.
- **Full Authentication Pipeline**: Multi-factor authentication supporting Email/Password login, OTP verification via email, HTTP-only cookie session storage, and Redux state synchronization.
- **Split-Screen Promo Banners**: Custom full-viewport login/signup split screen highlighting ticket discounts and bank offers.

---

## 2. Full Stack Architecture Overview

```
               ┌─────────────────────────────────────────┐
               │              CLIENT (Vite)              │
               │   React 18 | Redux Toolkit | Tailwind   │
               └────────────────────┬────────────────────┘
                                    │
                               REST API (JSON)
                                    │
               ┌────────────────────▼────────────────────┐
               │             SERVER (Node/Express)       │
               │   Auth Middleware | Controllers | Utils │
               └────────────────────┬────────────────────┘
                                    │
                            Mongoose ODM
                                    │
               ┌────────────────────▼────────────────────┐
               │            DATABASE (MongoDB)           │
               │  GeoJSON 2dsphere | Movies | ShowSeats  │
               └─────────────────────────────────────────┘
```

---

## 3. Database Schemas & Data Modeling

### 1. `Movie` Schema (`movieModel.js`)
```javascript
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  poster: { type: String },
  duration: { type: Number }, // In minutes
  description: { type: String },
  genres: [{ type: String }],
  censorRating: { type: String }, // e.g., 'U', 'UA', 'A', 'UA16+'
  releaseDate: { type: Date },
  isActive: { type: Boolean, default: true }
});
```

### 2. `Theater` Schema (`theaterModel.js`)
- Stores geospatial location (`Point` coordinates `[longitude, latitude]`) with a `2dsphere` index for spatial querying.
```javascript
const theaterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] // [longitude, latitude]
  }
});
theaterSchema.index({ location: '2dsphere' });
```

### 3. `Show` Schema (`showModel.js`)
- References `Movie` and `Theater` documents, linking screen names, pricing, and showtimes.

---

## 4. Backend Engineering & API Concepts

### Key Backend Highlights:
1. **Geospatial Queries (`$near` & `$geometry`)**:
   - Used in `movieController.js` to find nearby theaters within a max distance radius.
   - Requires `[longitude, latitude]` (MongoDB GeoJSON standard ordering).

2. **Populate & Aggregation**:
   - `Show.find({...}).populate('movie').populate('theater')` resolves relational data across MongoDB collections.

3. **Authentication & Session Persistence**:
   - Passwords hashed using `bcrypt`.
   - JWT tokens transmitted securely via cookies (`js-cookie` / HTTP-only response headers).

---

## 5. Frontend Engineering & UI State Architecture

### Redux Toolkit Slice Structure:
- `authSlice`: Handles user authentication state (`isAuthenticated`, `user`, `role`).
- `locationSlice`: Manages geolocation state (`currentCity`, `currentState`, `latitude`, `longitude`).
- `moviesSlice`: Handles `fetchMovieById`, `nearByMovies`, and active movie lists.

### Custom Design System System (`index.css`):
```css
:root {
  --bg: #ffffff;
  --bg-2: #f8f9fa;
  --bg-3: #f1f3f5;
  --border: #e2e8f0;
  --text: #475569;
  --text-h: #0f172a;
  --text-muted: #64748b;
  --primary: #471b8e;
  --primary-hover: #5b21b6;
  --accent: #e11d48;
}
```

---

## 6. Top Technical Interview Questions & Answers

### A. Backend & Database Questions

#### Q1: How does MongoDB perform geospatial searches for nearby theaters in cineVerse?
**Answer**:
MongoDB uses a **2dsphere index** on the `location` field of the `Theater` collection. The location is stored as a GeoJSON Object: `{ type: "Point", coordinates: [longitude, latitude] }`.
In `movieController.js`, we query using `$near` and `$geometry`:
```javascript
const theaters = await Theater.find({
  location: {
    $near: {
      $geometry: { type: 'Point', coordinates: [longitude, latitude] },
      $maxDistance: 30000 // 30km in meters
    }
  }
});
```
*Note*: Coordinates MUST be specified as `[longitude, latitude]` in GeoJSON, not `[latitude, longitude]`.

#### Q2: What is the difference between Embedding and Referencing in MongoDB data modeling for cineVerse?
**Answer**:
- **Referencing (Normalized)**: Used for `Show` referencing `Movie` (`movie: { type: ObjectId, ref: 'Movie' }`). Used because a single movie can have thousands of shows across different theaters and dates. Embedding shows inside a movie document would hit MongoDB's 16MB document size limit.
- **Embedding (Denormalized)**: Used for seat status (`seatStatus: [{ seatNumber: String, isBooked: Boolean }]`) inside a show seat document where atomic access to all seats of a specific show is required simultaneously.

#### Q3: How do you handle concurrency when two users try to book the exact same movie seat at the exact same millisecond?
**Answer**:
To prevent double booking:
1. **Optimistic Locking**: Use Mongoose document versioning (`__v`) or status check during `findOneAndUpdate`:
   ```javascript
   const bookedSeat = await ShowSeat.findOneAndUpdate(
     { _id: showSeatId, "seats._id": seatId, "seats.isBooked": false },
     { $set: { "seats.$.isBooked": true, "seats.$.bookedBy": userId } },
     { new: true }
   );
   if (!bookedSeat) throw new Error("Seat already booked by another user");
   ```
2. **Distributed Locks / Redis**: Lock the seat ID in Redis with a 5-minute TTL while the user completes payment.

---

### B. Frontend & React/Redux Questions

#### Q4: How is browser Geolocation integrated with Redux Toolkit in cineVerse?
**Answer**:
On initial mount of `Navbar.jsx`, `navigator.geolocation.getCurrentPosition` is invoked. Once coordinates (`latitude`, `longitude`) are retrieved, an asynchronous HTTP request is sent to OpenStreetMap Nominatim for reverse geocoding. The resulting `city` and `state` are dispatched to `locationSlice` (`dispatch(getCityAndState({ city, state, latitude, longitude }))`), which triggers movie re-fetching across the application via Redux state subscribers.

#### Q5: Why did we use CSS custom properties (`var(--primary)`) over hardcoded utility classes for the design system?
**Answer**:
Using CSS variables defined at `:root` (`index.css`) creates a centralized design token system. Changing brand theme colors (e.g., setting primary color to `#471b8e`) instantly updates all buttons, badges, active tabs, and highlights across all components without needing manual changes in individual JSX files.

---

### C. System Design & Performance Questions

#### Q6: How would you scale cineVerse to handle high-traffic movie ticket releases (e.g. Pushpa 2 or Avengers premiere)?
**Answer**:
1. **Caching Layer (Redis)**: Cache popular movie details, static city lists, and theater metadata in Redis to avoid hitting MongoDB repeatedly.
2. **Database Indexing**: Compound indexing on `{ theater: 1, showDate: 1 }` and `{ movie: 1, startTime: 1 }`.
3. **Queue System (BullMQ / Kafka)**: Queue ticket booking processing to protect the database from connection spikes.
4. **CDN for Assets**: Serve movie posters and banners via CDN (Cloudinary / AWS CloudFront).

---

*Guide generated for cineVerse project context.*
