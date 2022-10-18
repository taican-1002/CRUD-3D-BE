var mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  idImage: {
    type: String,
    required: true,
  },
  name: {
    type: String,
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
  image: {
    type: Object,
    required: true,
  },
  fileList: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("Image", imageSchema);
