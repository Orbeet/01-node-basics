const express = require("express");
const { promises: fsPromises } = require("fs");
const multer = require("multer");
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "tmp");
  },
  filename: function (req, file, cb) {
    let ext = "";
    if (file.originalname.split(".").length > 1)
      ext = file.originalname.substring(
        file.originalname.lastIndexOf("."),
        file.originalname.length
      );
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage: storage });

const PORT = 3000;
const app = express();

app.post(
  "/form-data",
  upload.single("avatar"), // 'file_example'
  minifyImage,
  (req, res, next) => {
    console.log("req.file", req.file);
    console.log("req.body", req.body);

    res.status(200).send();
  }
);

app.listen(PORT, () => {
  console.log("server started listening on port", PORT);
});

async function minifyImage(req, res, next) {
  try {
    await imagemin(["tmp/*.{jpg,png}"], {
      destination: "public/images",
      plugins: [imageminJpegtran(), imageminPngquant()],
    });
    next();
  } catch (err) {
    next(err);
  }
}

//---------------------------------------------
//user.router

// // Add avatar
// usersRouter.patch(
//   "/users/avatars",
//   usersControllers.authorize,
//   upload.single("avatars"),
//   usersControllers.addAvatar
// );

// const Avatar = require("avatar-builder");

// Multer  // middleware

// const multer = require("multer");
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "tmp");
//   },
//   filename: function (req, file, cb) {
//     let ext = "";
//     if (file.originalname.split(".").length > 1)
//       ext = file.originalname.substring(
//         file.originalname.lastIndexOf("."),
//         file.originalname.length
//       );
//     cb(null, Date.now() + ext);
//   },
// });

// const upload = multer({ storage: storage });

// image minimaiz
// const imagemin = require("imagemin");
// const imageminJpegtran = require("imagemin-jpegtran");
// const imageminPngquant = require("imagemin-pngquant");

// async function imageMinify() {
//   const files = await imagemin(["tmp/*.{jpg,png}"], {
//     destination: "public/images",
//     plugins: [
//       imageminJpegtran(),
//       imageminPngquant({
//         quality: [0.6, 0.8],
//       }),
//     ],
//   });
// }
