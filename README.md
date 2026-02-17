# HomeSurf

> **A Peer-to-Peer Emergency Housing Platform**
>
> Connecting individuals in urgent need of short-term shelter with local hosts offering spare rooms or temporary space.

![HomeSurf Banner](client/public/HomeSurfLogo.png)

---

## Inspiration

HomeSurf was created to address the limitations of traditional emergency housing — often too slow or too rigid to meet sudden, immediate crises. We recognized that critical gaps in institutional safety nets leave vulnerable individuals without safe options when centralized resources are unavailable or at capacity.

We built HomeSurf to **mobilize the decentralized capacity of the neighbourhood** — providing a secure framework to connect neighbours offering a spare room with those urgently seeking safe, temporary shelter. Our platform transforms community goodwill into reliable, peer-to-peer assistance that offers immediate stability and dignity when it matters most.

---

## What It Does

HomeSurf is a **full-stack peer-to-peer housing platform** serving two user groups:

- **Hosts** — Citizens who can securely list spare rooms or available space with verified addresses, date windows, and guest limits.
- **Guests** — Individuals facing sudden displacement who can search listings by city, browse an interactive map, and submit booking requests directly to hosts.

### Key Features

- **Secure Authentication** — Passwordless Google OAuth2 via Better Auth, with session persistence and protected routes per account type.
- **Host Dashboard** — Full CRUD management for listings, with a requests inbox to approve or reject bookings.
- **Guest Dashboard** — Tabbed view of pending, approved, and past bookings with one-click cancellation.
- **Smart Search** — Filter listings by city, province, date range, and guest count, with availability and booking conflict detection.
- **Interactive Map View** — Toggle between grid and Leaflet.js map views showing geocoded listing pins with popups.
- **Address Verification** — Google Maps Geocoding API validates every listing address at creation and on update, rejecting vague, mismatched, or non-Canadian entries.
- **Onboarding Flow** — New users complete a profile (account type, age, gender, race/ethnicity, bio) before accessing the platform.

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **React 18** | Component-based UI with hooks |
| **React Router v6** | Client-side routing with role-based route guards |
| **Vite** | Fast build tool and dev server |
| **DaisyUI + Tailwind CSS** | Component library with the `autumn` theme |
| **React Hook Form** | Form state management and validation |
| **Leaflet.js** | Interactive map rendering |
| **React Hot Toast** | Toast notification system |

### Backend

| Technology | Purpose |
|---|---|
| **Node.js + Express 5** | REST API framework |
| **PostgreSQL (pg)** | Relational database via connection pool |
| **Better Auth** | Session management and Google OAuth2 |
| **Google Maps Geocoding API** | Address validation and coordinate extraction |
| **Railway** | Managed PostgreSQL and backend hosting |
| **Vercel** | Frontend deployment |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    React Frontend (Vercel)                     │
│          Pages · Components · Route Guards · Auth Client       │
└───────────────────────────┬──────────────────────────────────┘
                            │ HTTP / JSON (credentials: include)
┌───────────────────────────▼──────────────────────────────────┐
│                  Express REST API (Railway)                    │
│     Controllers · Middleware · Better Auth Session Handler     │
└─────────────┬─────────────────────────────┬──────────────────┘
              │ pg (Pool)                   │ fetch
┌─────────────▼──────────────┐  ┌──────────▼──────────────────┐
│  PostgreSQL Database        │  │  Google Maps Geocoding API  │
│  (Railway)                  │  │  (address validation)       │
│  Users · Listings · Booking │  └─────────────────────────────┘
│  Coordinates · Sessions     │
└─────────────────────────────┘
```

### Request Flow — Booking a Listing

```
Guest enters city → SearchPage
    ↓
GET /api/listings/search?city=... → listingController
    ↓
SQL JOIN listings + coordinates (+ conflict check if dates provided)
    ↓
Results rendered in grid or map view
    ↓
Guest clicks "Request Booking" → BookingModal
    ↓
POST /api/booking/create → bookingController
    ↓
INSERT into booking table (status: Pending)
    ↓
Host sees request in ViewRequestsModal → PUT /api/booking/:id
    ↓
Status updated to Approved or Rejected
```

---

## Database Schema

### Core Tables

#### `user`
| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key (auto-generated) |
| `name` | String | Display name from Google |
| `email` | String | Unique email |
| `accountType` | String | `host` or `guest` |
| `onboardingCompleted` | Boolean | Whether onboarding is done |

#### `user_info`
| Column | Type | Description |
|---|---|---|
| `id` | UUID | FK → `user.id` |
| `age` | Int | User age |
| `gender` | String | Self-reported gender |
| `race` | String | Race/ethnicity |
| `bio` | String | Short bio |

#### `listing`
| Column | Type | Description |
|---|---|---|
| `listing_id` | UUID | Primary key |
| `user_id` | UUID | FK → `user.id` (host) |
| `title` | String | Listing title |
| `address`, `city`, `province`, `postal_code` | String | Address fields |
| `guest_limit` | Int | Max number of guests |
| `url` | String | Image URL |
| `available_from`, `available_to` | Date | Optional availability window |

#### `coordinates`
| Column | Type | Description |
|---|---|---|
| `listing_id` | UUID | FK → `listing.listing_id` |
| `latitude` | Float | Geocoded latitude |
| `longitude` | Float | Geocoded longitude |

#### `booking`
| Column | Type | Description |
|---|---|---|
| `booking_id` | UUID | Primary key |
| `listing_id` | UUID | FK → `listing.listing_id` |
| `user_id` | UUID | FK → `user.id` (guest) |
| `start_date`, `end_date` | Date | Requested stay dates |
| `status` | String | `Pending`, `Approved`, `Rejected`, `Completed` |

---

## API Documentation

### User Endpoints — `/api/user`

| Method | Path | Description |
|---|---|---|
| `GET` | `/check-onboarding` | Check if user has completed onboarding |
| `POST` | `/update-onboarding` | Set account type and complete onboarding |
| `POST` | `/update-info` | Upsert user profile info |

### Listing Endpoints — `/api/listing` · `/api/listings`

| Method | Path | Description |
|---|---|---|
| `POST` | `/listing/create` | Create a new listing (geocodes address) |
| `PUT` | `/listing/:id` | Update listing (re-geocodes if address changed) |
| `DELETE` | `/listing/:id` | Delete listing and associated bookings |
| `GET` | `/listing/:id/requests` | Get all booking requests for a listing |
| `GET` | `/listings/my-listings` | Get all listings for the authenticated host |
| `GET` | `/listings/search` | Search listings by city, province, dates, guests |

### Booking Endpoints — `/api/booking`

| Method | Path | Description |
|---|---|---|
| `POST` | `/create` | Submit a booking request |
| `GET` | `/pending` | Get user's pending bookings |
| `GET` | `/approved` | Get user's approved bookings |
| `GET` | `/past` | Get user's completed/rejected bookings |
| `PUT` | `/:bookingId` | Approve or reject a booking (host) |
| `DELETE` | `/:bookingId` | Cancel a booking (guest) |

---

## Project Structure

```
homesurf/
├── client/                         # React frontend
│   ├── public/                     # Static assets (logo, images)
│   └── src/
│       ├── components/
│       │   ├── Nav/                # NavBar, NavBarHost, NavBarGuest
│       │   ├── AddListingModal.jsx
│       │   ├── EditListingModal.jsx
│       │   ├── BookingModal.jsx
│       │   ├── ViewRequestsModal.jsx
│       │   ├── MapView.jsx         # Leaflet map integration
│       │   └── RouteGuards.jsx     # Role-based route protection
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── OnboardingPage.jsx
│       │   ├── HostDashBoardPage.jsx
│       │   ├── GuestDashBoardPage.jsx
│       │   ├── SearchPage.jsx
│       │   └── AddListingPage.jsx
│       └── lib/auth.js             # Better Auth client + OAuth handler
└── server/                         # Express backend
    └── src/
        ├── controllers/            # Business logic per resource
        ├── routes/                 # Route definitions
        ├── middleware/
        │   └── isAuthenticated.js  # Session-based auth guard
        ├── db/dbClient.js          # PostgreSQL connection pool
        └── utils/
            ├── auth.js             # Better Auth server config
            ├── getCordinates.js    # Google Maps geocoding + validation
            └── validation.js       # Input validation helpers
```

---

## Setup & Installation

### Prerequisites

- Node.js (v20+)
- PostgreSQL instance (local or Railway)
- Google Cloud project with Maps Geocoding API and OAuth credentials enabled

### 1. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
PORT=3000
DB_URI=postgresql://user:password@host:5432/dbname
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_secret_here
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_MAPS_API_KEY=your_maps_api_key
```

```bash
node src/server.js
```

Server starts on: `http://localhost:3000`

### 2. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in `client/`:

```env
VITE_SERVER_BASE_URL=http://localhost:3000
VITE_CLIENT_BASE_URL=http://localhost:5173
```

```bash
npm run dev
```

Application runs at: `http://localhost:5173`

---

## Live Demo

- **Live Site:** [https://surf-3.onrender.com](https://surf-3.onrender.com)
- **Demo Video:** [https://youtu.be/9HL6T2cTTlo](https://youtu.be/9HL6T2cTTlo)

---

## The Team

> Built during CalgaryHacks 2026, focused on **innovation, accessibility, and real-world impact.**

### Team CT63-JJADO
