# backend-seat-booking
AtomicSeat is a backend movie seat booking system built with NestJS that handles high-concurrency scenarios safely. It uses atomic database operations to prevent double booking, manages seat states (available, held, booked), supports time-based holds with auto-expiry, and maintains consistency across retries and restarts.
