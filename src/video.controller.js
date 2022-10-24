const Video = require("./video.model");
const path = require("path");
var rimraf = require("rimraf");

const getAll = (req, res, next) => {
  Video.find().exec((err, data) => {
    Video.countDocuments((err) => {
      if (err) return next(err);
      res.send({
        data,
      });
    });
  });
};

const get = (req, res, next) => {
  let perPage = 10;
  let page = req.params.page || 1;

  Video.find()
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec((err, data) => {
      Video.countDocuments((err, count) => {
        if (err) return next(err);
        res.send({
          data,
          current: Number(page),
          pages: Math.ceil(count / perPage),
          pageSize: perPage,
        });
      });
    });
};

const create = (req, res) => {
  const video = new Video({
    id: req.body.id,
    name: req.body.name,
    video: req.file,
  });

  return video
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

const update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }
  try {
    const id = req.params.id;
    const updatedData = {
      id: req.body.id,
      name: req.body.name,
      video: req.file ? req.file : JSON.parse(req.body.video),
    };
    const options = { new: true };

    const result = await Video.findByIdAndUpdate(id, updatedData, options);

    res.send({
      data: result,
      message: "Successfully updated",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const remove = async (req, res) => {
  const id = req.params.id;
  const directoryPath = path.join(__dirname).replace("src", "");

  var fileItem = await Video.find({ id: id })
    .then((file) => Object.assign({}, file))
    .catch((err) => {
      console.log(err);
    });
  console.log("fileItem : ", fileItem);
  await Video.findOneAndRemove({ id: id })
    .exec()
    .then(() =>
      res.status(200).json({
        success: true,
        message: "File is deleted",
      })
    )
    .catch((err) =>
      res.status(500).json({
        success: false,
      })
    );

  const dir = directoryPath + fileItem[0].video.destination;
  rimraf(dir, function () {
    // console.log("done");
  });
};

// const removeSync = (req, res) => {
//   const fileName = req.params.name;
//   const directoryPath = path.join(__dirname, "uploads");

//   try {
//     fs.unlinkSync(directoryPath + fileName);

//     res.status(200).send({
//       message: "File is deleted.",
//     });
//   } catch (err) {
//     res.status(500).send({
//       message: "Could not delete the file. " + err,
//     });
//   }
// };

module.exports = {
  getAll,
  get,
  create,
  update,
  remove,
  // removeSync,
};
