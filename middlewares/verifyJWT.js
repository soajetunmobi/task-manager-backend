const jwt = require('jsonwebtoken');
require('dotenv').config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const verifyJWT = (req, res, next) => {
  const cookies = req.cookies;

  if (!cookies?.jwtAccess) {
    return res.sendStatus(401);
  }

  const accessToken = cookies.jwtAccess;

  jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); //invalid token
    req.username = decoded.username;
    next();
  });
};

module.exports = verifyJWT;
