var mongoose = require("mongoose");

const imageCompilerScheme = new mongoose.Schema({
  image_compiler: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("imageCompiler", imageCompilerScheme);
