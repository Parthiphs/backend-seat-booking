# Movie Ticket Booking System - Setup & Running Guide

## ✅ Project Status: COMPLETE & RUNNING

### 🚀 How to Run the Project

#### Option 1: Using the Batch Script (Easiest)
```bash
# Navigate to project root and run:
cd c:\tesplab\node\backend-ticket-booking
run-servers.bat
```

This will automatically open two terminal windows:
- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:3001

#### Option 2: Manual in Separate Terminals

**Terminal 1 - Backend (NestJS):**
```bash
cd c:\tesplab\node\backend-ticket-booking
npm run start:dev
```
→ Runs on **http://localhost:3000**

**Terminal 2 - Frontend (Next.js):**
```bash
cd c:\tesplab\node\backend-ticket-booking\frontend
npm run dev
```
→ Runs on **http://localhost:3001**

---

## 📱 Access the Application

Open your browser and go to:
### http://localhost:3001

---

## 🎯 Features

✅ **Modern UI** - Clean, minimal design with:
- Available seats (light gray)
- Selected seats (green)
- Sold/Booked seats (dark gray)

✅ **Functionality**:
- Select a movie show
- Choose seats to book
- Hold multiple seats
- Real-time seat status
- API integration with backend

✅ **Backend API** (NestJS):
- `GET /seats/:showId/availability` - Get seat availability
- `POST /seats/:showId/hold` - Hold seats
- `POST /seats/:showId/book` - Book seats
- SQLite database for persistence
- CORS enabled for frontend

✅ **Technology Stack**:
- **Frontend**: Next.js 16 + React 19 + TypeScript + Tailwind CSS
- **Backend**: NestJS + TypeORM + SQLite
- **Database**: SQLite (ticket-booking.db)

---

## 📂 Project Structure

```
backend-ticket-booking/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── seats/
│   │   ├── seats.controller.ts
│   │   ├── seats.service.ts
│   │   ├── seat.entity.ts
│   │   └── seats.module.ts
│   ├── bookings/
│   │   ├── bookings.controller.ts
│   │   ├── bookings.service.ts
│   │   ├── booking.entity.ts
│   │   └── bookings.module.ts
│   └── app.controller.ts
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── page.tsx (Main home page)
│   │   └── components/
│   │       ├── SeatSelection.tsx
│   │       └── BookingStatus.tsx
│   ├── package.json
│   └── next.config.ts
└── package.json
```

---

## 🔧 Configuration

### Backend Configuration (main.ts)
- CORS enabled for http://localhost:3001
- Port: 3000
- Database: SQLite (ticket-booking.db)

### Frontend Configuration (next.config.ts)
- Port: 3001
- API proxy configured for backend calls

---

## 📝 Example API Requests

### Check Seat Availability
```bash
curl http://localhost:3000/seats/1/availability
```

Response:
```json
{
  "available": 45,
  "held": 3,
  "booked": 2
}
```

### Hold Seats
```bash
curl -X POST http://localhost:3000/seats/1/hold \
  -H "Content-Type: application/json" \
  -d '{"seatIds": [1, 2, 3]}'
```

### Book Seats
```bash
curl -X POST http://localhost:3000/seats/1/book \
  -H "Content-Type: application/json" \
  -d '{"seatIds": [1, 2, 3]}'
```

---

## ✨ Recent Fixes Applied

✅ Fixed "Internal server error" when holding seats
✅ Added CORS support for frontend-backend communication
✅ Simplified UI colors (Available, Selected, Sold only)
✅ Fixed TypeScript compilation issues
✅ Both servers running simultaneously

---

## 🎬 Next Steps

1. Open http://localhost:3001
2. Select a movie show
3. Click on seats to select them
4. Click "Hold X Seats" button
5. See real-time updates

---

**Project Status**: ✅ READY FOR USE
