const fs = require("fs");
var path = require("path");
const Face = require("./face.model");
var rimraf = require("rimraf");
const getAll = (req, res, next) => {
  Face.find().exec((err, data) => {
    Face.countDocuments((err) => {
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
  Face.find()
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec((err, data) => {
      Face.countDocuments((err, count) => {
        // đếm để tính có bao nhiêu trang
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
  const face = new Face({
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
    avatar: req.files.avatar[0],
    fileList: req.files.myFiles,
  });
  return face
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
  const id = req.params.id;
  // const directoryPath = path.join(__dirname, "uploads\\");
  const directoryPath = path.join(__dirname).replace("src", "");
  var fileItem = await Face.find({ id: id })
    .then((file) => Object.assign({}, file))
    .catch((err) => {
      console.log(err);
    });

  await Face.findOneAndRemove({ id: id })
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
  remove,
  // removeSync,
};
