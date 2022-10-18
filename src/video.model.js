var mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  video: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("Video", videoSchema);
