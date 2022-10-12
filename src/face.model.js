var mongoose = require("mongoose");

const faceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  scaleX: {
    type: Number,
    required: true,
  },
  scaleY: {
    type: Number,
    required: true,
  },
  scaleZ: {
    type: Number,
    required: true,
  },
  positionX: {
    type: Number,
    required: true,
  },
  positionY: {
    type: Number,
    required: true,
  },
  positionZ: {
    type: Number,
    required: true,
  },
  rotationX: {
    type: Number,
    required: true,
  },
  rotationY: {
    type: Number,
    required: true,
  },
  rotationZ: {
    type: Number,
    required: true,
  },
  avatar: {
    type: Object,
    required: true,
  },
  fileList: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("Face", faceSchema);
