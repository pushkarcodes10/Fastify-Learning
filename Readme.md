# Fastify API

A Node.js REST API built with Fastify and MongoDB. The project provides user authentication, password-reset endpoints, and user-scoped thumbnail routes.

## Features

- Fastify 5 server with request logging
- MongoDB connectivity through Mongoose
- User registration and login with bcrypt password hashing
- JWT-protected routes and logout
- Password-reset token generation and password update
- Thumbnail CRUD route definitions
- CORS, multipart, and static-file plugins
- Database connection status endpoint

## Requirements

- Node.js and npm
- A MongoDB database and connection URI

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://127.0.0.1:27017/fastify
   JWT_TOKEN=replace_with_a_long_random_secret
   ```

   `PORT`, `MONGODB_URI`, and `JWT_TOKEN` are required by the application configuration. Keep secrets out of source control.

3. Start the development server:

   ```bash
   npm run dev
   ```

   To start without Nodemon:

   ```bash
   npm start
   ```

The server listens on the configured port.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the server with Nodemon |
| `npm start` | Start the server with Node.js |

## API

All routes are served from the same host and port as the Fastify server.

### General

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/` | Basic server response |
| `GET` | `/test-db` | Return the MongoDB connection status |

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register a user |
| `POST` | `/api/auth/login` | Authenticate a user and return a JWT |
| `POST` | `/api/auth/forgot-password` | Generate a password-reset token |
| `POST` | `/api/auth/reset-password/:token` | Set a new password using a reset token |
| `POST` | `/api/auth/logout` | Log out the authenticated user |

Registration accepts `name`, `email`, and `password`; `country` is optional. Login accepts `email` and `password`. The logout endpoint requires the JWT returned by login in the `Authorization` request header.

The forgot-password endpoint currently returns a reset URL in its response; email delivery is not configured.

### Thumbnails

Thumbnail routes are registered under `/api/thumbnail` and require authentication.

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/thumbnail` | Create a thumbnail |
| `GET` | `/api/thumbnail` | List the authenticated user's thumbnails |
| `GET` | `/api/thumbnail/:id` | Get a thumbnail |
| `PUT` | `/api/thumbnail/:id` | Update a thumbnail |
| `DELETE` | `/api/thumbnail/:id` | Delete a thumbnail |
| `DELETE` | `/api/thumbnail` | Delete the authenticated user's thumbnails |

## Project Structure

```text
.
├── server.js
└── src/
    ├── controllers/   # Authentication and thumbnail request handlers
    ├── models/        # Mongoose user and thumbnail models
    ├── plugins/       # MongoDB and JWT plugins
    └── routes/        # Authentication and thumbnail route definitions
```

## Development Notes

This project is an API foundation and is still under development. Validate endpoint behavior and configuration in your environment before using it in production. Password-reset email delivery and production deployment configuration are not included.
