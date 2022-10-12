var mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
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
