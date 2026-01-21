# Backend: Ticket Booking (Seats)

This backend implements a simple, reliable seat-hold and booking system focused on correctness under concurrent access.

Key behaviors implemented

- Atomic holds and bookings: hold and book operations use atomic UPDATE statements (via TypeORM query builder) that only succeed when rows match expected state. This prevents overbooking under concurrent requests.
- Hold expiration: held seats include a `holdExpiresAt` timestamp. The service periodically (on read operations) releases expired holds via `releaseExpiredHolds()` which updates HELD seats whose expiry is in the past back to AVAILABLE.
- Safe rollbacks on partial failures: when an atomic UPDATE affects fewer rows than requested, the service does a best-effort release of the involved seat IDs to avoid partial inconsistencies.
- Controller validation: endpoints validate `seatIds` and return appropriate HTTP errors. `HttpException` instances are preserved so proper status codes are returned.

What problems this addresses

- Multiple users attempting to book the same seats: atomic UPDATEs with WHERE clauses on `status` ensure only seats in the expected state are transitioned. The number of affected rows is checked to confirm success for all requested seats.
- Users selecting seats but not completing booking: held seats expire after a configurable period (`holdExpiresAt`) and are released, making seats available again.
- Users refreshing or retrying requests: idempotent checks and atomic operations mean retries will either succeed or return failure without causing overbooking.
- System restarts while bookings in progress: holds are persisted in the DB (with `holdExpiresAt`) so restarts do not lose state. Expired holds are cleaned on subsequent API calls.

API overview

- `GET /seats/:showId/availability` — returns counts for available/held/booked seats.
- `GET /seats/:showId/list` — lists all seats for a show.
- `POST /seats/:showId/hold` — body `{ seatIds: number[] }` — tries to hold seats for 5 minutes. Returns 200 on success with `expiresIn: 300`.
- `POST /seats/:showId/book` — body `{ seatIds: number[] }` — attempts to confirm booking for previously held seats.

Assumptions & limitations

- Database: implementation uses TypeORM and assumes a relational DB that supports transactional updates. The code uses atomic UPDATE statements with WHERE clauses; it does not open explicit transactions or use row-level locks — this keeps logic simple and relies on the DB to make single UPDATE statements atomic.
- Partial failures: the service attempts a best-effort release of seats if an operation partially succeeds, but in rare race conditions an external reconciliation (e.g., cron job) may be needed.
- Scaling: for very high concurrency, further improvements (row-level FOR UPDATE locks or a dedicated booking queue) can be added.

How to run tests (backend)

From the repository root:

```bash
npm install
npm run test
```

Files changed / added

- `src/seats/seats.service.ts` — improved atomic operations for `holdSeat`, `holdSeats`, and `bookSeats`.
- `src/seats/seats.controller.ts` — improved validation and error handling.
- `src/seats/__tests__/seats.service.spec.ts` — unit tests for the service (mocked repo & query builder).
- `src/seats/__tests__/seats.controller.spec.ts` — unit tests for the controller (mocked service).

Notes on deployment

- Ensure your DB is configured and migrations (if any) are applied. The seed service will seed seats on module init if none exist.
- If using an environment where multiple application instances talk to the same DB, the atomic UPDATE checks will still prevent overbooking as long as the DB enforces statement-level atomicity.



---

