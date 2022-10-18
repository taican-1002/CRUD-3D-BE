const imageCompiler = require("./imagecompiler.model");
var rimraf = require("rimraf");
var path = require("path");

const get = (req, res, next) => {
  imageCompiler.find().exec((err, data) => {
    imageCompiler.countDocuments((err, count) => {
      if (err) return next(err);
      res.send({
        data,
      });
    });
  });
};

const create = (req, res, next) => {
  imageCompiler.deleteMany({}, function (err) {
    if (err) return next(err);
  });
  const file = new imageCompiler({
    image_compiler: req.file,
  });

  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  }

  return file
    .save()
    .then((newFile) => {
      return res.status(201).json({
        success: true,
        message: "New file created successfully",
        File: newFile,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server error. Please try again.",
        error: error.message,
      });
    });
};

const remove = async (req, res) => {
  const directoryPath = path.join(__dirname);
  rimraf(directoryPath + "/uploads/image", function (err) {
    if (err)
      return res.status(500).json({
        success: false,
      });
    else
      return res.status(200).json({
        success: true,
      });
  });
};

module.exports = {
  get,
  create,
  remove,
};
