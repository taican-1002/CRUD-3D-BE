var mongoose = require("mongoose");

const videoCompilerScheme = new mongoose.Schema({
  video_compiler: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("videoCompiler", videoCompilerScheme);
