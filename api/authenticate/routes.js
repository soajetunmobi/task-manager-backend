const express = require('express');
const { authenticate, refreshToken, logout } = require('./controller');

const router = express.Router();

router.post('/authenticate', authenticate);
router.get('/refresh', refreshToken);
router.get('/logout', logout);

module.exports = router;
