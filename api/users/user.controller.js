const Joi = require("joi");
const userModel = require("./user.model");
const {
  Types: { ObjectId },
} = require("mongoose");

class UserController {
  async createUser(req, res, next) {
    try {
      const user = await userModel.create(req.body);

      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userModel.find();

      return res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }

  async getUserById(req, res, next) {
    try {
      const userId = req.params.id;

      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).send();
      }

      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }

  async deleteUserById(req, res, next) {
    try {
      const userId = req.params.id;

      const deletedUser = await userModel.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).send();
      }
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async updateUser(req, res, next) {
    try {
      const userId = req.params.id;

      const userToUpdate = await userModel.findUserByIdAndUpdate(
        userId,
        req.body
      );

      if (!userToUpdate) {
        return res.status(404).send();
      }
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  validateId(req, res, next) {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send();
    }

    next();
  }

  validateCreateUser(req, res, next) {
    const validationRules = Joi.object({
      username: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const validationResult = Joi.validate(req.body, validationRules);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error);
    }

    next();
  }

  validateUpdateUser() {}
}

module.exports = new UserController();
