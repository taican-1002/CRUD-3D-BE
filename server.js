const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
var cors = require("cors");
const PORT = process.env.PORT || 8080;
const faceController = require("./src/face.controller");
const imageController = require("./src/image.controller");
const imageCompilerController = require("./src/imagecompiler.controller");
const videoController = require("./src/video.controller");
const videoCompilerController = require("./src/videocompiler.controller");
const path = require("path");
var fs = require("fs-extra");
var mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
  })
);
app.use("/uploads", express.static(path.join(__dirname, "src/uploads/")));

mongoose.connect(process.env.DB_CONNECT + "/mindar", {
  useNewUrlParser: true,
});
var conn = mongoose.connection;
conn.on("connected", function () {
  console.log("database is connected successfully");
});
conn.on("disconnected", function () {
  console.log("database is disconnected successfully");
});
conn.on("error", console.error.bind(console, "connection error:"));

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let id =
      "uploads/" +
      (req.body.id
        ? req.body.id
        : file.fieldname === "image_compiler"
        ? "image"
        : "video");
    let path;
    if (
      file.mimetype.split("/")[1] == "jpg" ||
      file.mimetype.split("/")[1] == "jpeg" ||
      file.mimetype.split("/")[1] == "png"
    ) {
      path = `src/${id}/textures`;
    } else {
      path = `src/${id}`;
    }
    fs.mkdirsSync(path);
    return cb(null, path);
  },
  filename: function (req, file, cb) {
    file.originalname = file.originalname.replace(/\s+/g, "_");
    if (file.originalname.split(".")[1] === "gltf") {
      cb(null, Date.now() + "_" + file.originalname);
    } else {
      cb(null, file.originalname);
    }
  },
});

var upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.send("hello world");
});

// //single file
// app.post("/uploadfile", upload.single("myFile"), (req, res, next) => {
//   const file = req.file;
//   if (!file) {
//     const error = new Error("Please upload a file");
//     error.httpStatusCode = 400;
//     return next(error);
//   }
//   res.send(file);
//   conn.collection("mindar").insertOne(file, (err, result) => {
//     if (err) return console.log(err);
//   });
// });

//START FACE
//get all file
app.get("/face/files", faceController.getAll);
//get file
app.get("/face/files/:page", faceController.get);
//multiple file
app.post(
  "/face/files",
  upload.fields([
    {
      name: "myFiles",
      maxCount: 15,
    },
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  faceController.create
);
//update
app.put(
  "/face/files/:id",
  upload.fields([
    {
      name: "fileList",
      maxCount: 15,
    },
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  faceController.update
);
//delete file
app.delete("/face/files/:id", faceController.remove);
//END FACE

//START IMAGE
//get all file
app.get("/image/files", imageController.getAll);
//get file
app.get("/image/files/:page", imageController.get);
//multiple file
app.post(
  "/image/files",
  upload.fields([
    {
      name: "myFiles",
      maxCount: 15,
    },
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  imageController.create
);
//update
app.put(
  "/image/files/:id",
  upload.fields([
    {
      name: "fileList",
      maxCount: 15,
    },
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  imageController.update
);
//delete file
app.delete("/image/files/:id", imageController.remove);
//END IMAGE

//START IMAGE TARGETS COMPILER
//get file
app.get("/imageTargets/files", imageCompilerController.get);
//create
app.post(
  "/imageTargets/files",
  upload.single("image_compiler"),
  imageCompilerController.create
);
//delete file
app.delete("/imageTargets/files", imageCompilerController.remove);
//END IMAGE TARGETS COMPILER

//START VIDEO
//get all file
app.get("/video/files", videoController.getAll);
//get file
app.get("/video/files/:page", videoController.get);
//create
app.post("/video/files", upload.single("video"), videoController.create);
//update
app.put("/video/files/:id", upload.single("video"), videoController.update);
//delete file
app.delete("/video/files/:id", videoController.remove);
//END VIDEO

//START VIDEO TARGETS COMPILER
//get file
app.get("/videoTargets/files", videoCompilerController.get);
//create
app.post(
  "/videoTargets/files",
  upload.single("video_compiler"),
  videoCompilerController.create
);
//delete file
app.delete("/videoTargets/files", videoCompilerController.remove);
//END VIDEO TARGETS COMPILER

//Code to start server
app.listen(PORT, function () {
  console.log(`Server Started at PORT ${PORT}`);
});
