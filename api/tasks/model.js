const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ['To Do', 'In Progress', 'Done', 'Open', 'In Progress', 'Cancelled', 'Closed'],
      default: 'To Do',
    },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
