Internal Inventory & Offer Management Panel
Overview

This project is an internal operational panel built for managing inventory batches across multiple food locations (restaurants, bakeries, grocery stores).

The goal of the system is to help operations teams manage products that are close to expiration and optionally activate limited-time offers to reduce waste.

This is not a consumer-facing application. It is designed for internal use by:

Operations team

Account managers

Support

The system focuses on business logic clarity, derived state, and clean separation between domain logic and UI.

Live Demo

Frontend:
👉 https://ims-one-phi.vercel.app

Backend API:
👉 https://ims-backend-1ahd.onrender.com/api/v1

Tech Stack
Frontend

React

TypeScript

Vite

Redux Toolkit + RTK Query

PrimeReact (UI components)

Backend

Node.js

Express

MongoDB Atlas

Mongoose

JWT Authentication

Deployment

Frontend → Vercel

Backend → Render

Database → MongoDB Atlas

Core Domain Model
Location (Store)

id

name

type (restaurant | bakery | grocery)

status (active | paused)

Item Batch

id

locationId

title

quantity

expirationDate

basePrice

offerPrice (optional)

state (derived)

Business Logic

The state of a batch is not stored blindly. It is derived based on:

expirationDate

quantity

offerPrice

manual actions

Derived States

sold_out → quantity === 0

expired → expirationDate < now

in_offer → offerPrice exists

near_expiry → less than 24 hours remaining

available → default state

Important Rules

Expired batches cannot be reactivated.

A batch cannot be activated in offer if quantity = 0.

Expired batches cannot be sold.

Offer activation updates UI immediately.

State is computed, not duplicated.

This avoids inconsistent data and keeps business logic centralized.

Features
Dashboard

List of item batches

Filter by Location

Filter by State

Pagination

Visual state indicators

Expiration highlighting

Offer Flow

Activate special offer (set offerPrice)

Automatically changes state to in_offer

Deactivate offer

Immediate UI update via RTK Query cache invalidation

Location Management

List locations

Add new location

Update status

Delete location

Users Management

Internal users listing

Add user

Delete user

JWT protected routes

Architecture Decisions
1. Derived State Instead of Stored State

Batch state is computed via a domain function instead of stored in the database.

Why:

Prevents data duplication

Avoids inconsistent states

Keeps business rules centralized

Trade-off:

Slight computation overhead (acceptable for this scale)

2. RTK Query for API Layer

RTK Query was used instead of plain fetch because:

Built-in caching

Automatic refetching

Tag-based invalidation

Cleaner mutation handling

This keeps network state predictable and centralized.

3. Separation of Domain Logic

Business logic such as getBatchState() lives outside UI components.

This makes:

Logic testable

UI simpler

State reasoning clearer

4. Production Environment Setup

Environment variables are used for:

Backend base URL (frontend)

Mongo URI

JWT secret

CORS is properly configured for production deployment.

What I Would Improve in Production

If this were to evolve further:

Add role-based access control (admin vs support vs ops).

Add soft deletes instead of hard deletes.

Implement audit logging for offer activation/deactivation.

Add server-side pagination and filtering.

Add unit tests for business logic.

Add centralized logging (e.g., Winston or Pino).

Add CI/CD checks before deployment.

Why This Project Matters

This project demonstrates:

Product thinking (handling near-expiry and offers)

Real business rule enforcement

Clean state derivation

API integration patterns

Authentication flow

Production deployment experience

Debugging real deployment issues (CORS, env variables, IP whitelisting)

It focuses not just on UI, but on correctness and system design.



Running Locally
Backend
cd backend
npm install
npm run dev

Required .env:

MONGO_URI=your_mongo_uri
JWT_AUTH=your_secret
PORT=4000
Frontend
cd frontend
yarn install
yarn  dev

Required .env:

VITE_BACKEND_URL=http://localhost:4000/api/v1