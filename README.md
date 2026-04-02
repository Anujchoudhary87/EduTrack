# EduTrack: Content Analytics Platform

EduTrack is a high-performance content learning platform built to track real-time user engagement through a structured learning hierarchy (Books → Chapters → Content).

**Live demo:** https://edu-track-2ats.vercel.app/
---
**Video Link:** https://drive.google.com/drive/folders/1h7PMsUMfav4cFh-gOvKXh1_APcjkWLJo

---

##  Key Features
- **Structured Content Viewer**: Browse books and chapters with seamless navigation.
- **Real-time Video Tracking**: Captures cumulative watch time, not just starts/stops.
- **Engagement Hooks**: Automatically tracks scroll depth and interactive button clicks.
- **Live Analytics Dashboard**: Visualizes data through interactive charts and performance cards.

## Architecture Decisions

### Choosing the Tech Stack
- **Frontend**: Next.js (App Router) for a modern, performant, and SEO-friendly user experience. Tailwind CSS for premium, responsive UI.
- **Backend**: Node.js (Express) for a lightweight, scalable event-handling server.
- **Database**: PostgreSQL with Prisma ORM for type-safe, indexed data storage.

### Data Modeling & Performance
Handling high-frequency analytics events (like video watch time) requires careful engineering to avoid database bottlenecks:
1. **Append-Only Event Store**: We use an append-only model for tracking. Instead of heavy `UPDATE` operations on a single row, we perform lightweight `INSERT` operations. This avoids row-level locking and improves write throughput.
2. **Client-Side Batching**: To reduce network overhead, the frontend batches watch-time segments into 10-second intervals before sending them to the API.
3. **Optimized Aggregation**: The dashboard query uses PostgreSQL's `GROUP BY` with indexed columns (`videoId`, `contentId`, `buttonLabel`) to ensure sub-second response times even as the dataset grows.
4. **Average Watch Time Logic**: We calculate total watch time per user-session first, then average across all sessions to provide a true reflection of user stickiness rather than just counting server pings.

### Third Metric: Page Scroll Depth
I chose **Scroll Depth** as the third metric to complement video watch time.
- **Why?**: High video watch time is great, but for text-heavy chapters, we need to know if users are actually reading or just watching the video and moving on.
- **Business Insight**: If scroll depth remains low while video watch time is high, it suggests the text content may be redundant, too long, or not engaging enough compared to the visual media.

##  Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL (Local or Cloud)

### 1. Backend Setup
```bash
cd backend
npm install
# Create a .env file with your DATABASE_URL
# Example: DATABASE_URL="postgresql://user:pass@localhost:5432/edutrack"
npx prisma migrate dev --name init
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Usage
- Go to `http://localhost:3000` to browse content.
- interact with buttons and scroll through content.
- Go to `/analytics` to see the live tracking data.

##  Database Schema

### ButtonClick
Tracks specific UI interactions.
- `userId` (Session-based)
- `buttonLabel` (e.g., "Mark as Complete")
- `contentId`
- `clickedAt` (Timestamp)

### VideoWatchTime
Optimized for append-only tracking.
- `videoId`
- `watchedSeconds` (Duration of the tracked interval)
- `recordedAt`

### ScrollDepth
Measures content completion.
- `maxScrollPercentage` (0-100)
- `contentId`

---
*Developed for the Intern Assignment.*
