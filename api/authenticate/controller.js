const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../users/model');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const NODE_ENV = process.env.NODE_ENV;

const isCookieSecure = NODE_ENV === 'production';

const authenticate = asyncHandler(async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }
    const userFound = await User.findOne({ username: username });

    if (!userFound) {
      return res.sendStatus(401);
    }

    const passwordMatch = await bcrypt.compare(password, userFound.password);

    if (passwordMatch) {
      //create JWTs
      const accessToken = jwt.sign({ username: userFound.username }, ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
      const refreshToken = jwt.sign({ username: userFound.username }, REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

      //store tokens
      const userWithTokens = await User.findByIdAndUpdate(userFound._id, { refreshToken });
      const { _id, name, role } = userWithTokens;

      res.cookie('jwtRefresh', refreshToken, {
        httpOnly: true,
        secure: isCookieSecure,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.cookie('jwtAccess', accessToken, {
        httpOnly: true,
        secure: isCookieSecure,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(200).json({ _id, name, role, success: `User ${username} is logged in!` });
    } else {
      return res.sendStatus(401);
    }
  } catch (err) {
    next(err);
  }
});

const refreshToken = asyncHandler(async (req, res, next) => {
  try {
    const cookies = req.cookies;

    console.log({ cookies: req.cookies });
    if (!cookies?.jwtRefresh) {
      return res.sendStatus(401);
    }

    const refreshToken = cookies.jwtRefresh;

    const userFound = await User.findOne({ refreshToken: refreshToken });

    if (!userFound) {
      return res.sendStatus(401);
    }

    //evaluate jwt
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err || userFound.username !== decoded.username) return res.sendStatus(403); //Forbidden

      const accessToken = jwt.sign({ username: decoded.username }, ACCESS_TOKEN_SECRET, { expiresIn: '10m' });

      res.cookie('jwtAccess', accessToken, {
        httpOnly: true,
        secure: isCookieSecure,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({ accessToken });
    });
  } catch (err) {
    next(err);
  }
});

const logout = asyncHandler(async (req, res, next) => {
  //also delete accessToken on frontend
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      return res.sendStatus(204); //No content;
    }

    const refreshToken = cookies.jwt;

    const userFound = await User.findOne({ refreshToken: refreshToken });

    if (!userFound) {
      res.clearCookie('jwtRefresh', { httpOnly: true, sameSite: 'strict', secure: isCookieSecure }); //secure: true (https) for production
      res.clearCookie('jwtAccess', { httpOnly: true, sameSite: 'strict', secure: isCookieSecure }); //secure: true (https) for production
      return res.sendStatus(204);
    }

    //Delete refreshToken in MongoDb
    await User.updateOne({ refreshToken: refreshToken }, { $unset: { refreshToken: 1 } });

    res.clearCookie('jwtRefresh', { httpOnly: true, sameSite: 'strict', secure: isCookieSecure });
    res.clearCookie('jwtAccess', { httpOnly: true, sameSite: 'strict', secure: isCookieSecure });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

module.exports = {
  authenticate,
  refreshToken,
  logout,
};
