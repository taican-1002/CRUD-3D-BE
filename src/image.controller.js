const fs = require("fs");
var path = require("path");
const Image = require("./image.model");
var rimraf = require("rimraf");

const getAll = (req, res, next) => {
  Image.find().exec((err, data) => {
    Image.countDocuments((err) => {
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

  Image.find()
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec((err, data) => {
      Image.countDocuments((err, count) => {
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
  const image = new Image({
    id: req.body.id,
    idImage: req.body.idImage,
    name: req.body.name,
    scaleX: req.body.scaleX,
    scaleY: req.body.scaleY,
    scaleZ: req.body.scaleZ,
    positionX: req.body.positionX,
    positionY: req.body.positionY,
    positionZ: req.body.positionZ,
    rotationX: req.body.rotationX,
    rotationY: req.body.rotationY,
    rotationZ: req.body.rotationZ,
    image: req.files.image[0],
    fileList: req.files.myFiles,
  });

  return image
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
  let fileList = [];
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  if (!req.body.fileList) {
    for (let i = 0; i < req.files.fileList.length; i++) {
      fileList.push(req.files.fileList[i]);
    }
  } else {
    for (let i = 0; i < req.body.fileList.length; i++) {
      fileList.push(JSON.parse(req.body.fileList[i]));
    }
  }
  try {
    const id = req.params.id;
    const updatedData = {
      id: req.body.id,
      name: req.body.name,
      index: req.body.index,
      scaleX: req.body.scaleX,
      scaleY: req.body.scaleY,
      scaleZ: req.body.scaleZ,
      positionX: req.body.positionX,
      positionY: req.body.positionY,
      positionZ: req.body.positionZ,
      rotationX: req.body.rotationX,
      rotationY: req.body.rotationY,
      rotationZ: req.body.rotationZ,
      image: req.files.image ? req.files.image[0] : JSON.parse(req.body.image),
      fileList: fileList,
    };
    const options = { new: true };

    const result = await Image.findByIdAndUpdate(id, updatedData, options);

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

  var fileItem = await Image.find({ id: id })
    .then((file) => Object.assign({}, file))
    .catch((err) => {
      console.log(err);
    });

  await Image.findOneAndRemove({ id: id })
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
  for (let i = 0; i < fileItem[0].fileList.length; i++) {
    // fs.unlink(directoryPath + fileItem[0].fileList[i].path, (err) => {
    //   if (err) throw err;
    // });

    const dir = directoryPath + fileItem[0].fileList[i].destination;
    // delete directory recursively
    // fs.rm(
    //   dir.includes("/textures") ? dir.replace("/textures", "") : dir,
    //   { recursive: true },
    //   (err) => {
    //     if (err) {
    //       throw err;
    //     }
    //     // console.log(`${dir} is deleted!`);
    //   }
    // );
    rimraf(
      dir.includes("/textures") ? dir.replace("/textures", "") : dir,
      function () {
        // console.log("done");
      }
    );
  }
};

module.exports = {
  getAll,
  get,
  create,
  update,
  remove,
  // removeSync,
};
