const { Router } = require("express");
const userRouter = Router();
const userController = require("./user.controller");

userRouter.post(
  "/auth/register",
  userController.validateCreateUser,
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

module.exports = userRouter;
