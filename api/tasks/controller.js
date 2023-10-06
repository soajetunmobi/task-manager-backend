const asyncHandler = require('express-async-handler');
const Task = require('./model');

const getTasks = asyncHandler(async (req, res, next) => {
  try {
    const tasks = await Task.find({}).populate('createdBy', 'name').populate('assignedTo', 'name').exec();
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
});

const getTaskById = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id).populate('createdBy', 'name').populate('assignedTo', 'name').exec();
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

const createTask = asyncHandler(async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

const updateTask = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndUpdate(id, req.body);

    if (!task) {
      res.status(404);
      throw new Error(`Cannot find any task by ${id}`);
    }

    const updatedTask = await Task.findById(id);

    res.status(200).json(updatedTask);
  } catch (err) {
    next(err);
  }
});

const deleteTask = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      res.status(404);
      throw new Error(`Cannot find any task by ${id}`);
    }

    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
