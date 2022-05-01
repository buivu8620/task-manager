const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    description: {
      type: "string",
      required: true,
      trim: true,
    },
    completed: {
      type: "boolean",
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

const Task = mongoose.model("task", taskSchema, "tasks");
module.exports = Task;
