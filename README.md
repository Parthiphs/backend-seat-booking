<<<<<<< HEAD
# Backend Ticket Booking — Seats Service

This repository contains the backend for a ticket booking system focused on seat holds and bookings.

This workspace has been prepared as a backend-only submission. The frontend code was removed from this repository — only the NestJS backend remains.

Overview
- Seats are represented by the `Seat` entity (`src/seats/seat.entity.ts`) with statuses: `AVAILABLE`, `HELD`, `BOOKED` and a `holdExpiresAt` timestamp.
- The service `src/seats/seats.service.ts` implements atomic hold and booking operations using TypeORM query-builder UPDATE statements and checks affected row counts to prevent overbooking under concurrency.
- The controller `src/seats/seats.controller.ts` exposes endpoints for listing seats, querying availability, holding seats and booking seats.

Key design notes (how the system handles the challenges you listed)

- Concurrent bookings: hold and book operations use atomic DB UPDATEs constrained by expected `status`. The service validates the database `affected` row count equals the requested number of seats — otherwise the operation fails and any partial changes are released.
- Users who do not complete bookings: holds include `holdExpiresAt`; expired holds are released by `releaseExpiredHolds()` which is invoked on read/write operations to keep counts correct.
- Refreshes / retries: operations are atomic and either fully succeed or fail without causing overbooking; repeated attempts will return an appropriate error or success.
- System restarts: holds are persisted in the DB (with expiry timestamps). A restart does not lose hold metadata; expired holds are cleaned on next API call.

API (important endpoints)
- `GET /seats/:showId/availability` — returns counts: available, held, booked.
- `GET /seats/:showId/list` — returns all seats for a show.
- `POST /seats/:showId/hold` — body `{ seatIds: number[] }` — attempts to hold specified seats for 5 minutes.
- `POST /seats/:showId/book` — body `{ seatIds: number[] }` — attempts to confirm booking for previously held seats.

Running locally

1. Install dependencies:

```bash
npm install
```

2. Run tests:

```bash
npm run test
```

3. Start the app in development:

```bash
npm run start:dev
```

Notes and assumptions
- The implementation expects a relational DB supported by TypeORM. The default setup in this project is suitable for SQLite during development; configure `ormconfig` or `TypeOrmModule` in `app.module.ts` for production DBs.
- For extremely high concurrency workloads, further improvements (explicit transactions, row-level locks, or a booking queue) can be added.

Files of interest
- `src/seats/seats.service.ts` — core logic for hold/book/release.
- `src/seats/seats.controller.ts` — HTTP endpoints and validation.
- `src/seats/seat.entity.ts` — database entity for seats.
- `src/seats/__tests__/` — unit tests for service and controller.
- `README_BACKEND.md` — longer technical notes and rationale.

If you want me to push these changes to a GitHub repo and add CI (GitHub Actions) to run tests on push, tell me the repository URL or I can generate the git commands for you to run locally.
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
=======
# backend-seat-booking
AtomicSeat is a backend movie seat booking system built with NestJS that handles high-concurrency scenarios safely. It uses atomic database operations to prevent double booking, manages seat states (available, held, booked), supports time-based holds with auto-expiry, and maintains consistency across retries and restarts.
>>>>>>> e7f0717257847e4c788f351c91bc342a1f33d21e
