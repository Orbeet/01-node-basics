const { promises: fsPromises } = require("fs");
const multer = require("multer");
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
const fs = require("fs");
const Avatar = require("avatar-builder");

const storage = multer.diskStorage({
  destination: 'tmp',
  filename: function (req, file, cb) {
      console.log('file', file)
      const ext = path.parse(file.originalname).ext
      cb(null, Date.now() + ext);
  }
});
const upload = multer({storage})

static async avatarGenerate (req, res, next) {
  try {
   const randomColor = "#" + (((1 << 24) * Math.random()) | 0).toString(16);
    const randomNum = Math.floor(Math.random() * (12 - 3)) + 3;
    const avatar = Avatar.squareBuilder(128, randomNum, [randomColor, "#ffffff"], {
      cache: null,
    });
    const buffer = await avatar.create("gabriel");
    const filename = Date.now() + ".png";
    const destination = "tmp";
    await fs.writeFileSync(`${destination}/${filename}`, buffer);
    req.file = { destination, filename, path: `${destination}/${filename}` };
    next();
  } catch (error) {
    console.log(error);
  }
}
static imageMini(req, res, next) {
  try {
    const MINI_IMG = "public/images";
    await imagemin([`${req.file.destination}/*.{jpg,png}`], {
      destination: MINI_IMG,
      plugins: [
        imageminJpegtran(),
        imageminPngquant({
          quality: [0.6, 0.8],
        }),
      ],
    });
    const { filename, path: draftPath } = req.file;
    await fsPromises.unlink(draftPath);
    req.file = {
      ...req.file,
      path: path.join(MINI_IMG, filename),
      destination: MINI_IMG,
    };
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  avatarGenerate,
  imageMini,
  upload
};
