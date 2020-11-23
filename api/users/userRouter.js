const { Router } = require("express");
const userRouter = Router();
const { upload } = require("./user.helper");
const userController = require("./user.controller");

userRouter.post(
  "/auth/register",
  userController.validateCreateUser,
  userController.avatarGenerate, //add
  userController.imageMini, //add
  userController._createUser
);

userRouter.get(
  "/users/current",
  userController.authorize,
  userController.getCurrentUser
);
userRouter.post(
  "/auth/login",
  userController.validateLogin,
  userController.login
);
userRouter.patch(
  "/auth/logout",
  userController.authorize,
  userController.logout
);
userRouter.patch(
  "/users/avatars",
  userController.authorize,
  upload.single("avatars"),
  userController.createUserAvatar //add
);

module.exports = userRouter;
