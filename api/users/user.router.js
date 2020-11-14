const { Router } = require("express");
const userController = require("./user.controller");

const userRouter = Router();

userRouter.post(
  "/",
  userController.validateCreateUser,
  userController.createUser
);
userRouter.get("/", userController.getUsers);
userRouter.get("/:id", userController.validateId, userController.getUserById);
userRouter.delete(
  "/:id",
  userController.validateId,
  userController.deleteUserById
);
userRouter.put(
  "/:id",
  userController.validateId,
  userController.validateUpdateUser,
  userController.updateUser
);

module.exports = userRouter;
