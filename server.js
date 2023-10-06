require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const userRoute = require('./api/users/routes');
const taskRoute = require('./api/tasks/routes');
const authRoute = require('./api/authenticate/routes');
const errorMiddleware = require('./middlewares/errorMiddleware');
const credentials = require('./middlewares/credentials');
const allowedOrigins = require('./config/allowedOrigins');

const app = express();

const MONGODB_URL = process.env.MONGODB_URL;
const APP_PORT = process.env.APP_PORT || 8080;

//Middleware
app.use(helmet());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

//Handle credentials check before cors and fetch cookies credentials requirement
app.use(credentials);

//middleware for cookies
app.use(cookieParser());

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  exposedHeaders: ['Set-Cookie', 'Date', 'ETag'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

//routes
const ROUTE_PREFIX = '/api/v1';
app.use(ROUTE_PREFIX, authRoute);
app.use(ROUTE_PREFIX, userRoute);
app.use(ROUTE_PREFIX, taskRoute);

//custom errorHandler
app.use(errorMiddleware);

//MongoDB connection
mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log('Connected to MongoDB!');

    app.listen(APP_PORT, () => {
      console.log(`Sample API app is running on port ${APP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
