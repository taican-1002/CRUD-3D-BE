const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
var cors = require("cors");
const PORT = process.env.PORT || 8080;
const faceController = require("./face.controller");
const imageController = require("./image.controller");
const conn = require("./database");
const path = require("path");
var fs = require("fs-extra");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let id = "uploads/" + req.body.id;
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
//delete file
app.delete("/face/files/:id", imageController.remove);
//END FACE

//START IMAGE
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
//delete file
app.delete("/image/files/:id", imageController.remove);
//END IMAGE

//Code to start server
let server = app.listen(PORT, function () {
  console.log(`Server Started at PORT ${PORT}`);
});

server.on("clientError", (err, socket) => {
  console.error(err);
  socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});
