# 🌐 CineVerse - API Data Flow & Architecture Guide

A complete, easy-to-understand visual and technical walkthrough of how data moves across CineVerse — from **Frontend UI components** ➡️ **Axios Services** ➡️ **Express Routes & Middlewares** ➡️ **Controllers** ➡️ **MongoDB Models & 3rd-Party APIs** ➡️ and back to the **Client**.

---

## 📑 Table of Contents
1. [High-Level Architecture](#-high-level-architecture)
2. [Data Flow Diagrams (DFD Level 0, Level 1, Level 2)](#-data-flow-diagrams-dfd)
   - [DFD Level 0: Context-Level Data Flow Diagram](#dfd-level-0-context-level-diagram)
   - [DFD Level 1: System-Level Functional Data Flow Diagram](#dfd-level-1-system-level-functional-diagram)
   - [DFD Level 2: Core Booking & Payment Subsystem DFD](#dfd-level-2-core-booking--payment-subsystem-dfd)
3. [End-to-End User Booking Journey](#-end-to-end-user-booking-journey)
4. [Deep-Dive Module Data Flows](#-deep-dive-module-data-flows)
   - [Flow 1: Authentication & 2FA Flow](#flow-1-authentication--2fa-flow)
   - [Flow 2: Geolocation & Movie Discovery Flow](#flow-2-geolocation--movie-discovery-flow)
   - [Flow 3: Shows & Theater Schedule Flow](#flow-3-shows--theater-schedule-flow)
   - [Flow 4: Screen Layout & Real-time Seat Locking Flow](#flow-4-screen-layout--real-time-seat-locking-flow)
   - [Flow 5: Booking Creation & Razorpay Payment Verification Flow](#flow-5-booking-creation--razorpay-payment-verification-flow)
5. [Database Entity Relationship Map](#-database-entity-relationship-map)
6. [Complete API Registry & Payload Reference](#-complete-api-registry--payload-reference)
7. [Key Business Logic & Formulas](#-key-business-logic--formulas)

---

## 🏛️ High-Level Architecture

CineVerse follows a decoupled, 3-tier client-server architecture with external cloud service integrations:

```mermaid
graph TB
    subgraph Frontend["Client (React 18 + Vite)"]
        UI["React Pages & Components<br/>(Home, Movies, Booking, SeatSelection, Checkout)"]
        Axios["Axios API Client (lib/api.js)<br/>(baseURL, withCredentials: true)"]
        UI --> Axios
    end

    subgraph Backend["Backend Server (Node.js + Express)"]
        Router["Express Routing Engine (/api/v1)"]
        MW["Middlewares<br/>(verifyToken, upload.single, errorHandler, cors, cookie-parser)"]
        Controllers["Controllers<br/>(auth, movie, city, theater, screen, showSeat, booking)"]
        
        Router --> MW
        MW --> Controllers
    end

    subgraph Storage["Database & Cloud Services"]
        Mongo[("MongoDB Atlas / Mongoose<br/>(User, Movie, Theater, Screen, Show, ShowSeat, Booking)")]
        Razorpay["Razorpay Gateway<br/>(Order Creation & Webhook/Verification)"]
        Cloudinary["Cloudinary CDN<br/>(Movie Poster Storage)"]
        GeoIP["GeoIP-Lite<br/>(IP-based Geolocation)"]
    end

    Axios <==>|HTTP Requests / JSON + Cookies| Router
    Controllers <==> Mongo
    Controllers <==> Razorpay
    Controllers <==> Cloudinary
    Controllers <==> GeoIP
```

---

## 📊 Data Flow Diagrams (DFD)

A formal breakdown of inputs, processes, data transformations, data stores, and outputs across CineVerse.

### DFD Level 0: Context-Level Diagram

The Level 0 context diagram demonstrates the entire CineVerse system as a single central process interacting with external entities (Customer, Admin, Razorpay, Cloudinary, and GeoIP):

```mermaid
flowchart TD
    %% External Entities
    User[/"👤 Customer"/]
    Admin[/"👑 Admin / Theater Admin"/]
    Razorpay[/"💳 Razorpay Payment Gateway"/]
    Cloudinary[/"☁️ Cloudinary CDN"/]
    GeoIP[/"🌍 GeoIP Service"/]

    %% Main Process
    System(("0.0<br/><b>CineVerse Movie Booking<br/>& Ticketing System</b>"))

    %% Customer Data Flows
    User -->|"1. Registration / Login Credentials & OTP"| System
    User -->|"2. GPS Coords [lat, lon] / Selected City"| System
    User -->|"3. Movie & Showtime Selection"| System
    User -->|"4. Seat IDs Lock Request"| System
    User -->|"5. Payment Confirmation & Signature"| System

    System -->|"6. Auth Cookie, JWT Token & User Profile"| User
    System -->|"7. Running Movies & Nearby Theaters"| User
    System -->|"8. Screen Layout Matrix & Seat Statuses"| User
    System -->|"9. Razorpay Order ID & Checkout Options"| User
    System -->|"10. Confirmed E-Ticket & Receipt"| User

    %% Admin Data Flows
    Admin -->|"Movie Details + Poster File"| System
    Admin -->|"Theater & Screen Layout Setup"| System
    System -->|"Upload Confirmation & Inventory Logs"| Admin

    %% Cloud Services Data Flows
    System -->|"Stream Poster File Buffer"| Cloudinary
    Cloudinary -->|"Return Secure CDN Image URL"| System

    System -->|"Client IP Address"| GeoIP
    GeoIP -->|"Resolved City / Coordinates"| System

    System -->|"Order Total, Currency & Receipt ID"| Razorpay
    Razorpay -->|"Razorpay Order ID"| System
    Razorpay -->|"Payment Status & Cryptographic Signature"| System
```

---

### DFD Level 1: System-Level Functional Diagram

Decomposes the system into 5 primary processes, with explicit incoming/outgoing data flows and reads/writes to MongoDB data stores:

```mermaid
flowchart TD
    %% Entities
    Customer[/"👤 Customer"/]
    Admin[/"👑 Admin"/]
    Razorpay[/"💳 Razorpay"/]
    Cloudinary[/"☁️ Cloudinary"/]

    %% Data Stores
    D1[("D1: Users Store")]
    D2[("D2: Movies Store")]
    D3[("D3: Theaters & Screens Store")]
    D4[("D4: Shows & ShowSeats Store")]
    D5[("D5: Bookings & Transactions Store")]

    %% Processes
    P1(("1.0<br/>Authentication &<br/>Identity Engine"))
    P2(("2.0<br/>Geospatial Search<br/>& Movie Catalog"))
    P3(("3.0<br/>Theater & Showtime<br/>Scheduling Engine"))
    P4(("4.0<br/>Screen Layout &<br/>Seat Lock Engine"))
    P5(("5.0<br/>Booking & Payment<br/>Processing Engine"))

    %% P1 Auth Flows
    Customer -->|"Email, Mobile, Password, OTP"| P1
    P1 -->|"Write New User / Update OTP & Expiry"| D1
    D1 -->|"Read Hash & 2FA Status"| P1
    P1 -->|"JWT Cookie & Session Data"| Customer

    %% P2 Movie Catalog Flows
    Admin -->|"New Movie Data + Poster Buffer"| P2
    P2 -->|"Upload Buffer"| Cloudinary
    Cloudinary -->|"Poster CDN URL"| P2
    P2 -->|"Save Movie Document"| D2
    Customer -->|"Coordinates [lat, lon] / City"| P2
    P2 -->|"$near 2dsphere Lookup"| D3
    D3 -->|"Nearby Theater IDs"| P2
    P2 -->|"Distinct Movie IDs"| D4
    D4 -->|"Active Movie IDs"| P2
    P2 -->|"Read Movie Profiles"| D2
    D2 -->|"Movie Details"| P2
    P2 -->|"Movie List & Metadata"| Customer

    %% P3 Show Scheduling Flows
    Customer -->|"Movie ID + Date + Coords"| P3
    P3 -->|"Fetch Shows by Date & Movie"| D4
    D4 -->|"Showtimes & Screen Names"| P3
    P3 -->|"Read Theater Info"| D3
    D3 -->|"Theater Names & Locations"| P3
    P3 -->|"Grouped Theaters & Showtime Slots"| Customer

    %% P4 Seat Layout & Concurrency Lock Flows
    Customer -->|"Show ID Request"| P4
    P4 -->|"Read Screen Rows & Layout"| D3
    P4 -->|"Read Seat Statuses (booked/locked)"| D4
    P4 -->|"Merged Seat Matrix (Available, Locked, Booked)"| Customer
    Customer -->|"Lock Seat IDs ['A1', 'A2'] + User ID"| P4
    P4 -->|"Check & Write Lock with 10-Min Expiry TTL"| D4
    P4 -->|"Seat Lock Acknowledgment"| Customer

    %% P5 Booking & Payment Flows
    Customer -->|"Order Payload (Show, Seats, Pricing)"| P5
    P5 -->|"Compute Fee (16%) & Create Order"| Razorpay
    Razorpay -->|"Razorpay Order ID"| P5
    P5 -->|"Save Pending Booking Document"| D5
    P5 -->|"Set ShowSeats Status = 'booked'"| D4
    P5 -->|"Razorpay Order Info & Key"| Customer
    Customer -->|"Payment ID + Signature + Order ID"| P5
    P5 -->|"HMAC-SHA256 Signature Validation"| P5
    P5 -->|"Fetch Payment Status"| Razorpay
    Razorpay -->|"Payment State: captured/authorized"| P5
    P5 -->|"Update Booking Status = 'confirmed'"| D5
    P5 -->|"Confirmed Ticket & QR Details"| Customer
```

---

### DFD Level 2: Core Booking & Payment Subsystem DFD

Deep dive into the critical checkout and payment verification transactions (Process 5.0):

```mermaid
flowchart TD
    %% Inputs
    ClientIn[/"Customer: Checkout Trigger<br/>{showId, movieId, theaterId, seats}"/]
    RPIn[/"Customer: Razorpay Response<br/>{razorpay_payment_id, signature, razorpay_order_id}"/]

    %% Sub-processes
    P51(("5.1<br/>Pricing & Fee<br/>Calculator"))
    P52(("5.2<br/>Razorpay Order<br/>Generator"))
    P53(("5.3<br/>Booking Initializer<br/>& Seat Marker"))
    P54(("5.4<br/>HMAC-SHA256<br/>Signature Validator"))
    P55(("5.5<br/>Payment Capture<br/>Verifier"))
    P56(("5.6<br/>Ticket Finalizer<br/>& Confirmer"))

    %% Data Stores
    D4[("D4: ShowSeats Store")]
    D5[("D5: Bookings Store")]
    ExtRP[/"External Service:<br/>Razorpay API"/]

    %% Data Flow Pipeline
    ClientIn --> P51
    P51 -->|"Base Price + 16% Convenience Fee"| P52
    P52 -->|"API: orders.create(amount*100, currency: INR)"| ExtRP
    ExtRP -->|"razorpayOrder: {id, amount}"| P53
    P53 -->|"Insert Booking {bookingId: order.id, status: 'pending'}"| D5
    P53 -->|"Update ShowSeats {status: 'booked'}"| D4
    P53 -->|"Return {booking, razorpayOrder, key}"| BrowserPayment[/"Customer Checkout Modal"/]

    BrowserPayment -->|"Pay Online & Receive Signatures"| RPIn
    RPIn --> P54
    P54 -->|"Compute crypto.createHmac('sha256', SECRET)"| P54
    P54 -->|"Valid Signature Match"| P55
    P55 -->|"Fetch payment status"| ExtRP
    ExtRP -->|"status: 'captured' | 'authorized'"| P56
    P56 -->|"Update Booking {paymentsDetails.status: 'confirmed'}"| D5
    P56 -->|"Success: 200 OK Confirmed Ticket"| TicketOut[/"Customer: Confirmed Ticket View"/]
```

---

## 🚀 End-to-End User Booking Journey

This is how a typical user navigates through CineVerse, showing the chain of API calls at every stage:

```mermaid
sequenceDiagram
    autonumber
    actor User as 👤 Customer
    participant App as 💻 React Frontend
    participant API as ⚙️ Express Backend
    participant DB as 🗄️ MongoDB
    participant RP as 💳 Razorpay

    User->>App: 1. Opens CineVerse / Selects City
    App->>API: GET /api/v1/movies/nearby?lat=...&lon=...
    API->>DB: $near 2dsphere search on Theaters -> Show distinct movies
    DB-->>API: Movie list
    API-->>App: Display running movies in city

    User->>App: 2. Selects Movie & Date
    App->>API: GET /api/v1/movies/:id/shows?lat=...&lon=...&date=...
    API->>DB: Find Theaters & Shows for selected Movie
    DB-->>API: Theaters list with showtime slots
    API-->>App: Renders showtimes (e.g., 09:30 AM, 01:15 PM)

    User->>App: 3. Clicks Showtime (e.g., 09:30 AM)
    App->>App: Navigates to /seat-select/:showId
    App->>API: GET /api/v1/shows/:showId/seats
    API->>DB: Fetch Show, Screen layout rows, and ShowSeat statuses
    DB-->>API: Combined Seat Matrix (Available, Locked, Booked)
    API-->>App: Renders interactive BookMyShow-style seat grid

    User->>App: 4. Selects Seats (e.g. A1, A2) & Clicks Checkout
    App->>API: POST /api/v1/shows/:showId/seats/lock
    API->>DB: Check seat status & lock with 10-minute TTL expiry
    DB-->>API: Lock confirmed
    API-->>App: Redirects to /checkout

    User->>App: 5. Confirms Order on Checkout Page
    App->>API: POST /api/v1/booking/create
    API->>RP: razorpay.orders.create(amount, currency: INR)
    RP-->>API: razorpayOrderId
    API->>DB: Create Booking (status: pending) & Update ShowSeats (status: booked)
    API-->>App: Returns booking data & razorpayOrderId
    App->>RP: Opens Razorpay Checkout Modal (User pays via UPI/Card)
    RP-->>App: Returns paymentId & signature

    App->>API: POST /api/v1/booking/verifyPayment
    API->>API: Verify HMAC SHA-256 signature
    API->>DB: Update Booking (payment status: confirmed)
    API-->>App: Success response
    App->>User: Displays Confirmed Ticket & QR Details! 🎉
```

---

## 🔬 Deep-Dive Module Data Flows

### Flow 1: Authentication & 2FA Flow

Manages user registration, secure login with bcrypt password comparison, optional 2-Factor Authentication (OTP), and JWT token delivery via HTTP-only cookies.

```mermaid
flowchart TD
    subgraph ClientAuth["Client (Login.jsx / Signup.jsx)"]
        A1["User enters email & password"]
        A2["User enters 6-digit OTP"]
    end

    subgraph ServerAuth["Server (authControllers.js)"]
        B1["POST /api/v1/auth/login"]
        B2{"User exists & password matches?"}
        B3{"is2faEnabled?"}
        B4["Generate 6-digit OTP<br/>Set otpExpires = Date.now() + 5m<br/>Save to userModel"]
        B5["POST /api/v1/auth/verify-otp"]
        B6{"OTP matches & not expired?"}
        B7["Generate JWT Token (7d expiry)"]
        B8["Set-Cookie: token=... (httpOnly: true)"]
    end

    A1 --> B1
    B1 --> B2
    B2 -- No --> Err1["Return 400/401 Error"]
    B2 -- Yes --> B3
    B3 -- No --> B7
    B3 -- Yes --> B4
    B4 --> A2
    A2 --> B5
    B5 --> B6
    B6 -- No --> Err2["Return 400 OTP Invalid/Expired"]
    B6 -- Yes --> B7
    B7 --> B8
    B8 --> Success["200 OK: Authenticated Session"]
```

#### Related Endpoints:
- `POST /api/v1/auth/register` : Validates uniqueness, hashes password with `bcrypt.hash(password, 10)`, creates user document.
- `POST /api/v1/auth/login` : Authenticates credentials; issues JWT or triggers 2FA OTP.
- `POST /api/v1/auth/verify-otp` : Checks OTP and expiration; sets JWT in `httpOnly` cookie.
- `POST /api/v1/auth/resend-otp` : Rate-limited (minimum 2 minutes interval using `otpSentLastTime`).
- `POST /api/v1/auth/verify` : Validates incoming cookie using `verifyToken` middleware; returns user profile (`id`, `name`, `email`, `role`).

---

### Flow 2: Geolocation & Movie Discovery Flow

Allows users to find nearby theaters and currently running movies within a geographic radius (default: 30 km to 50 km).

```mermaid
flowchart LR
    Browser["User Browser / GPS<br/>navigator.geolocation"] -->|lat, lon| ClientAPI["movie.api.js: nearBy()"]
    ClientAPI -->|GET /api/v1/movies/nearby?lat=...&lon=...| Controller["movieController.js: fetchMovieByCity"]
    
    subgraph MongoDBGeo["MongoDB Geospatial Query"]
        Controller -->|1. $near 2dsphere query| TModel[("Theater Model<br/>coordinates: [lon, lat]<br/>$maxDistance: 30000m")]
        TModel -->|Theater IDs array| SModel[("Show Model<br/>find(theater: {$in: ids}).distinct('movie')")]
        SModel -->|Distinct Movie IDs| MModel[("Movie Model<br/>find(_id: {$in: movieIds})")]
    end
    
    MModel -->|Filtered Movies Array| Controller
    Controller -->|JSON Response| UIHome["Home.jsx / Movies.jsx<br/>Movie Posters & Sliders"]
```

#### Key Technical Detail:
- Uses MongoDB `2dsphere` index on `Theater.location`.
- Coordinates must be in GeoJSON order: `[longitude, latitude]`.

---

### Flow 3: Shows & Theater Schedule Flow

When a user selects a movie, this flow retrieves all theaters in the user's city/radius currently screening the movie, categorized with dates and showtimes.

```mermaid
flowchart TD
    UI["User clicks Movie<br/>Navigates to /booking/:name/:id"] --> Req["GET /api/v1/movies/:id/shows?lat=...&lon=...&date=..."]
    Req --> MC["movieController.js: getShowsByMovieId"]
    
    MC --> Step1["1. Query Theaters near [lon, lat] via $near ($maxDistance)"]
    Step1 --> Step2["2. Query Shows where movie = id AND theater IN (nearbyTheaterIds)"]
    Step2 --> Step3["3. Filter shows by showDate (00:00:00 to 23:59:59)"]
    Step3 --> Step4["4. Group shows under theater objects"]
    
    Step4 --> Res["Response: Theaters array with nested shows<br/>[ { theater: {...}, shows: [ { _id, startTime, screenName, categoryPricing } ] } ]"]
    Res --> UIBooking["BookingPage.jsx<br/>Renders Theater Cards & Showtime Chips (e.g. 09:30 AM)"]
```

---

### Flow 4: Screen Layout & Real-time Seat Locking Flow

Renders the interactive seat map and prevents double-booking through temporary seat locking (10 minutes TTL).

```mermaid
sequenceDiagram
    autonumber
    actor Customer as 👤 User
    participant Page as 🖥️ SeatSelectionPage.jsx
    participant Controller as ⚙️ showSeatController.js
    participant DB as 🗄️ MongoDB

    Customer->>Page: Clicks Show Time (e.g., 09:30 AM)
    Page->>Controller: GET /api/v1/shows/:showId/seats
    Controller->>DB: Find Show (populate movie & theater)
    Controller->>DB: Find Screen layout (ScreenModel rows & layout string)
    Controller->>DB: Find ShowSeats (check locked & booked statuses)
    Note over Controller: Seat status resolution:<br/>If status == 'locked' AND now > lockedExpiresAt -> 'available'<br/>Else keep status ('locked' | 'booked' | 'available')
    Controller-->>Page: Returns structured rows with prices & seat status
    Page->>Customer: Renders Seat Grid with Category dividers (PREMIUM, REGULAR)

    Customer->>Page: Selects seats A1, A2 -> Clicks "Proceed"
    Page->>Controller: POST /api/v1/shows/:showId/seats/lock<br/>{ userId, seatIds: ['A1', 'A2'] }
    Controller->>DB: Find ShowSeats for showId & seatIds
    alt Any seat is already booked
        Controller-->>Page: 409 Conflict: "Seat is already booked"
    else Any seat is actively locked (not expired)
        Controller-->>Page: 409 Conflict: "Seat is locked by another customer"
    else All selected seats available
        Note over Controller: Set status = 'locked'<br/>lockedBy = userId<br/>lockedExpiresAt = Date.now() + 10 mins
        Controller->>DB: Save locked seats
        Controller-->>Page: 200 OK: { success: true, lockedSeats, expiresAt }
        Page->>Customer: Routes to /checkout
    end
```

---

### Flow 5: Booking Creation & Razorpay Payment Verification Flow

Handles order placement, fee computation, Razorpay order generation, client payment modal, and server-side cryptographic signature validation.

```mermaid
flowchart TD
    subgraph StepA["Phase 1: Order Creation"]
        U1["User on /checkout clicks 'Pay Now'"] --> B1["POST /api/v1/booking/create"]
        B1 --> C1["bookingControllers.js: createBoooking"]
        C1 --> Calc["Calculate:<br/>seatsTotalPricing = sum(seat.price)<br/>convenienceFee = (seatsTotalPricing * 16) / 100<br/>totalAmount = seatsTotalPricing + convenienceFee"]
        Calc --> RPCreate["razorpay.orders.create({<br/>amount: totalAmount * 100,<br/>currency: 'INR', receipt: ... })"]
        RPCreate --> CreateDoc["Create Booking document in MongoDB<br/>(status: 'pending', bookingId: razorpayOrder.id)"]
        CreateDoc --> SeatUpdate["Update ShowSeats in MongoDB<br/>(status: 'booked')"]
        SeatUpdate --> ResOrder["Return razorpayOrder + Razorpay Key to Frontend"]
    end

    subgraph StepB["Phase 2: Payment in Browser"]
        ResOrder --> Modal["Launch Razorpay Modal window"]
        Modal --> PayProcess{"Payment Successful?"}
        PayProcess -- No --> ModalFail["Show Payment Failed error"]
        PayProcess -- Yes --> PayData["Receive response:<br/>{ razorpay_payment_id,<br/>razorpay_order_id,<br/>razorpay_signature }"]
    end

    subgraph StepC["Phase 3: Verification & Confirmation"]
        PayData --> VerifyReq["POST /api/v1/booking/verifyPayment"]
        VerifyReq --> VC["bookingControllers.js: verifyPayment"]
        VC --> Crypto["crypto.createHmac('sha256', RAZORPAY_SECRET)<br/>.update(orderId + '|' + paymentId)<br/>.digest('hex')"]
        Crypto --> SigCheck{"Signature matches razorpay_signature?"}
        SigCheck -- Mismatch --> VErr["400 Error: Payment verification failed"]
        SigCheck -- Valid --> RPCheck["Fetch payment status from Razorpay API"]
        RPCheck --> UpdateB["Update Booking in MongoDB:<br/>paymentsDetails.status = 'confirmed'<br/>razorPayPaymentId = paymentId"]
        UpdateB --> Confirmed["200 OK: Payment Verified & Ticket Confirmed!"]
    end
```

---

## 🗺️ Database Entity Relationship Map

Below is how the Mongoose models connect with each other:

```mermaid
erDiagram
    USER ||--o{ BOOKING : "places"
    THEATER ||--o{ SCREEN : "contains"
    THEATER ||--o{ SHOW : "hosts"
    MOVIE ||--o{ SHOW : "screened_in"
    MOVIE ||--o{ BOOKING : "booked_for"
    THEATER ||--o{ BOOKING : "belongs_to"
    SHOW ||--o{ SHOW_SEAT : "has"
    SHOW ||--o{ BOOKING : "associated_with"

    USER {
        ObjectId _id PK
        string name
        string email
        string mobileNo
        string password
        string role "user | theatreAdmin | admin"
        boolean is2FAEnabled
        string otp2FA
        date otpExpires
        date otpSentLastTime
    }

    MOVIE {
        ObjectId _id PK
        string title
        string poster
        number duration
        string description
        string[] genres
        string censorRating
        date releaseDate
        boolean isActive
    }

    THEATER {
        ObjectId _id PK
        string name
        string city
        Point location "GeoJSON 2dsphere coordinates [lon, lat]"
    }

    SCREEN {
        ObjectId _id PK
        ObjectId theater FK
        string name
        Array rows "row label, category, layout pattern, seats"
    }

    SHOW {
        ObjectId _id PK
        ObjectId movie FK
        ObjectId theater FK
        string screenName
        date showDate
        date startTime
        Array categoryPricing "category, price"
    }

    SHOW_SEAT {
        ObjectId _id PK
        ObjectId show FK
        string seatId "e.g. A1, O14"
        string status "available | locked | booked"
        string lockedBy "User ID or session"
        date lockedExpiresAt
        number price
    }

    BOOKING {
        ObjectId _id PK
        string bookingId "Razorpay Order ID"
        ObjectId user FK
        ObjectId movie FK
        ObjectId theater FK
        ObjectId show FK
        string screenName
        Array seats "seatId, row, number, category, price"
        Object pricing "seatsTotal, convenienceFee (16%), totalAmount"
        Object paymentsDetails "paymentMethod, signature, paymentId, status"
        string status "confirmed | cancelled"
    }
```

---

## 📋 Complete API Registry & Payload Reference

### 1. Authentication APIs (`/api/v1/auth`)

| Method | Endpoint | Description | Middleware | Request Body | Response Success |
|---|---|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Register new user | None | `{ name, email, mobileNo, password }` | `201: { message: "user created" }` |
| `POST` | `/api/v1/auth/login` | Login user | None | `{ email, password }` | `200: { message: "success" }` (sets `token` cookie) or sends OTP |
| `POST` | `/api/v1/auth/verify-otp` | Verify 2FA OTP | None | `{ id, otp }` | `200: { message: "success" }` (sets `token` cookie) |
| `POST` | `/api/v1/auth/resend-otp` | Resend 2FA OTP | None | `{ email }` | `200: { message: "OTP SENT SUCCESSFULLY" }` |
| `POST` | `/api/v1/auth/2fa/enable` | Enable 2FA | None | `{ id, status: true }` | `200: { message: "Two factor authentication is enabled" }` |
| `POST` | `/api/v1/auth/2fa/disable` | Disable 2FA | None | `{ id, status: false }` | `200: { message: "Two factor authentication is disabled" }` |
| `POST` | `/api/v1/auth/verify` | Verify current session | `verifyToken` | Cookie: `token` | `200: { isAuthenticated: true, id, name, email, role }` |

---

### 2. Movies APIs (`/api/v1`)

| Method | Endpoint | Description | Params / Query / Body | Response Data |
|---|---|---|---|---|
| `GET` | `/api/v1/movies` | Get paginated movies | `?search=&page=1&limit=20` | `{ success: true, count, totalPages, data: [movies] }` |
| `POST` | `/api/v1/movies` | Create movie with poster upload | `multipart/form-data`: `poster` file, `title`, `duration`, `genres`, etc. | `201: { success: true, data: movie }` (Uploaded to Cloudinary) |
| `GET` | `/api/v1/movies/:id` | Get single movie details | `id` (Path param) | `{ success: true, data: movie }` |
| `GET` | `/api/v1/movies/nearby` | Get movies playing near location | `?lat=26.91&lon=75.78&radius=3000` | `{ data: [movies] }` |
| `GET` | `/api/v1/movies/now-playing` | Get grouped theaters & shows by location | `?lat=...&lon=...&radius=30000&date=...` | `{ success: true, data: { theaters: [...] } }` |
| `GET` | `/api/v1/movies/:id/shows` | Get showtimes for specific movie | `id` (param), `?lat=...&lon=...&date=...` | `{ success: true, data: [theatersWithShows] }` |

---

### 3. Cities & Theaters APIs (`/api/v1`)

| Method | Endpoint | Description | Params / Query | Response Data |
|---|---|---|---|---|
| `GET` | `/api/v1/cities` | List all available cities | `?s=search_term` | `{ success: true, count, data: [cities] }` |
| `GET` | `/api/v1/getLocation` | Get client location & cities | `?s=search_term` | `{ success: true, cities, geo }` |
| `GET` | `/api/v1/theaters` | List theaters by city or coordinates | `?city=Jaipur` OR `?lat=...&lon=...` | `{ success: true, count, data: [theaters] }` |
| `GET` | `/api/v1/screens/theater/:theaterId` | Get screen layout for a theater | `theaterId` (Path param) | `{ success: true, data: [screens] }` |

---

### 4. Shows & Seat Management APIs (`/api/v1/shows`)

| Method | Endpoint | Description | Request Body | Response Data |
|---|---|---|---|---|
| `GET` | `/api/v1/shows/:showId/seats` | Fetch interactive screen seat matrix | None | `{ success: true, data: { show, movie, theater, rows: [ { label, category, price, layout, seats: [ { seatId, status, rowPrice } ] } ] } }` |
| `POST` | `/api/v1/shows/:showId/seats/lock` | Temporarily lock seats before checkout | `{ userId, seatIds: ["A1", "A2"] }` | `{ success: true, lockedSeats: ["A1", "A2"], expiresAt: "..." }` |

---

### 5. Booking & Payment APIs (`/api/v1/booking`)

| Method | Endpoint | Description | Request Body | Response Data |
|---|---|---|---|---|
| `POST` | `/api/v1/booking/create` | Initialize order & create Razorpay order | `{ showId, movieId, theaterId, screenName, seats: [ { seatId, price } ] }` | `{ message: "success", booking: {...}, razorpayOrder: { id, amount, currency, key } }` |
| `POST` | `/api/v1/booking/verifyPayment` | Validate Razorpay HMAC signature | `{ paymentId, signature, razorPayOrderId }` | `{ success: true, message: "payment verified" }` |

---

## 🧮 Key Business Logic & Formulas

### 1. Booking Pricing Calculation
Calculated inside `server/controllers/bookingControllers.js`:
```javascript
// Base seats pricing
const seatsTotalPricing = seats.reduce((acc, s) => Number(s.price) + acc, 0);

// Convenience fee: 16% on tickets
const convenienceFee = (seatsTotalPricing * 16) / 100;

// Grand total payable
const totalAmount = seatsTotalPricing + convenienceFee;

// Razorpay takes amount in smallest currency unit (Paise for INR)
const razorpayAmount = totalAmount * 100;
```

### 2. Seat Locking Concurrency Control
Inside `server/controllers/showSeatController.js`:
- **Collision Prevention**: Checks if any seat in `seatIds` has `status === 'booked'` or (`status === 'locked'` AND `lockedExpiresAt > new Date()`). If yes, immediately responds with HTTP `409 Conflict`.
- **Lock Expiration TTL**: When locked, sets `lockedExpiresAt = new Date(Date.now() + 10 * 60 * 1000)` (10 minutes window).
- **Auto-release**: When fetching `/shows/:showId/seats`, any seat with expired lock is automatically treated as `'available'`.

### 3. Payment Signature Cryptographic Verification
Inside `server/controllers/bookingControllers.js`:
```javascript
const generatedSignature = crypto
  .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
  .update(razorPayOrderId + '|' + paymentId)
  .digest('hex');

const isAuthentic = (generatedSignature === signature);
```

---

## 💡 Frontend Integration Quick Reference

All frontend API calls are centralized under `client/src/services/`:
- [auth.api.js](file:///d:/cineVerse/client/src/services/auth.api.js): `login()`, `register()`, `verifyOtp()`, `verify()`
- [movie.api.js](file:///d:/cineVerse/client/src/services/movie.api.js): `fetchMovies()`, `fetchMovieById()`, `nearBy()`, `getShowByMovieId()`, `getShowSeats()`, `fetchTheaters()`, `fetchCities()`
- [booking.api.js](file:///d:/cineVerse/client/src/services/booking.api.js): `createBooking()`, `verifyPayment()`
- [api.js](file:///d:/cineVerse/client/src/lib/api.js): Pre-configured Axios instance with `baseURL: import.meta.env.VITE_API_URL` and `withCredentials: true` (for automatic cookie forwarding).
