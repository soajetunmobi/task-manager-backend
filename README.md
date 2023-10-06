#Task Manager APP

**Table of Contents**

- [Development Environment Setup](#development-environment-setup)
    - [Setup](#setup)
        - [Prerequisites](#prerequisites)
        - [Dependencies](#dependencies)
        - [Running the App](#running-the-app)
- [Application Structure](#application-structure)
- [Authentication](#authentication)


## Development Environment Setup

### Setup

#### Prerequisites

- Nodejs: Download and install the latest LTS version from [here](https://nodejs.org/en/)
- Copy and rename `.env_sample` to `.env` then add all the following: `NODE_ENV`, `MONGODB_URL`, `APP_PORT`, `FRONTEND_URL`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`

## Dependencies
- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - For generating JWTs used by authentication
- [mongoose](https://github.com/Automattic/mongoose) - For modeling and mapping MongoDB data to javascript

#### Running the App

`npm install` - Installs all the packages if running the app for the first time

`npm run dev` - Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

`npm start` - Runs the app in the production mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.


## Application Structure

- `server.js` - The entry point to our application. This file defines our express server and connects it to MongoDB using mongoose. It also requires the routes and models we'll be using in the application.
- `config/` - This folder contains configuration for cors (allowedOrigins).
- `api/` - This folder contains the controller, schema definitions and route definitions for the API.
- `middlewares/` - This folder contains the middlewares such as errorHandler.

## Authentication

Requests are authenticated using the `http cookies` with a valid JWT. `VerifyJWT` middleware is used to authenticate requests using application's secrets and will return a 401 status code if the request cannot be authenticated.
