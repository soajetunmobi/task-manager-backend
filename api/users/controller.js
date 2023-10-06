const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const User = require('./model');
const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const NODE_ENV = process.env.NODE_ENV;

const isCookieSecure = NODE_ENV === 'production';

const getUsers = asyncHandler(async (req, res, next) => {
  try {
    const users = await User.find({}).select('name').exec();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

const getUserById = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

const createUser = asyncHandler(async (req, res, next) => {
  try {
    const { username, password, name, ...rest } = req.body;
    if (!username || !password || !name) {
      return res.status(400).json({ message: 'Username, name and password are required.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //create JWTs
    const accessToken = jwt.sign({ username: username }, ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
    const refreshToken = jwt.sign({ username: username }, REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

    const user = { ...rest, password: hashedPassword, username, name, refreshToken };

    const createdUser = await User.create(user);
    const { name: displayName, _id, role } = createdUser;

    res.cookie('jwtRefresh', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: isCookieSecure,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie('jwtAccess', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: isCookieSecure,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ name: displayName, _id, role, accessToken });
  } catch (err) {
    next(err);
  }
});

const updateUser = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body);

    if (!user) {
      res.status(404);
      throw new Error(`Cannot find any user by ${id}`);
    }

    const updatedUser = await User.findById(id);

    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
});

const deleteUser = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      res.status(404);
      throw new Error(`Cannot find any user by ${id}`);
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
