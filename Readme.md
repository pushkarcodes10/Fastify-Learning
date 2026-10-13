# Fastify API Server

A lightweight Fastify backend configured for API development with MongoDB connectivity, environment validation, and cross-origin support.

## Current Progress

The project is set up as a working backend foundation with:
- Fastify server initialization and route setup
- Environment configuration using Fastify Env
- CORS enabled for API access
- MongoDB connection managed through a reusable plugin
- Basic health and database status endpoints

## Included Features

- Fastify v5 application setup
- Mongoose integration for MongoDB
- Environment-based configuration
- Sensible error handling utilities
- Root endpoint and database connectivity check

## Getting Started

1. Install dependencies:
   npm install
2. Create a .env file with the required environment variables:
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_TOKEN=your_jwt_secret
3. Start the server:
   npm run dev

## Available Scripts

- npm run dev: run the server in development mode with nodemon
- npm run start: run the server in production mode

## Notes

This project is currently in a foundational stage and is ready for extending with authentication, route modules, and application-specific business logic.
