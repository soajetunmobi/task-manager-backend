const express = require('express');
const { getTasks, getTaskById, createTask, updateTask, deleteTask } = require('./controller');
const verifyJWT = require('../../middlewares/verifyJWT');

const router = express.Router();

router.get('/tasks', getTasks);
router.get('/tasks/:id', getTaskById);
router.post('/tasks', verifyJWT, createTask);
router.put('/tasks/:id', verifyJWT, updateTask);
router.delete('/tasks/:id', verifyJWT, deleteTask);

module.exports = router;
