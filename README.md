# MOMO SHOP RWANDA

A full-stack e-commerce application for Rwanda, built with React, Vite, Node.js, Express and MongoDB.

## Project structure

- Frontend: React + Vite application in the repository root.
- Backend: Express REST API in the server/ folder.
- Database: MongoDB with Mongoose.
- Authentication: JWT tokens and bcrypt password hashing.
- Currency: Rwandan francs (RWF).

## Current development status

### Frontend
The current storefront includes a responsive product catalogue, search, category filtering, a browser-persisted shopping bag, and a clearly labelled demo checkout.

### Backend foundation
The server includes a MongoDB connection, customer registration and login, JWT authentication, administrator authorization, product catalogue endpoints, product validation, and centralized error handling.

Checkout, live orders, mobile-money payment processing, and production customer-account integration are not active yet. MTN MoMo and Airtel Money must remain sandbox/test integrations until provider approval and credentials are available.

## Run the frontend

From the repository root:

    npm.cmd install
    npm.cmd run dev

Open http://localhost:5173.

## Run the backend

See server/README.md for backend setup, MongoDB Atlas configuration, environment variables, administrator seeding, and API endpoints.

Never commit environment files, credentials, database URIs, API keys, or payment-provider secrets.

## Developer

Remy Nsanzimana
BULL MAN
Founder & Lead Developer
