const express = require('express');
const { getUsers, getUserById, createUser, updateUser, deleteUser } = require('./controller');
const verifyJWT = require('../../middlewares/verifyJWT');

const router = express.Router();

router.get('/users', verifyJWT, getUsers);
router.get('/users/:id', verifyJWT, getUserById);
router.post('/users', createUser);
router.put('/users/:id', verifyJWT, updateUser);
router.delete('/users/:id', verifyJWT, deleteUser);

module.exports = router;
