const bcriptjs = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const usersModel = require("./user.schema");
const { imageMini } = require("./user.helper");
const { UnauthorizedError } = require("../helpers/errors.constructor");

module.exports = class userController {
  get createUser() {
    return this._createUser.bind(this);
  }

  static async _createUser(req, res, next) {
    try {
      const _constFactor = 4;
      const { password, email } = req.body;
      const passwordHash = await bcriptjs.hash(password, _constFactor);
      const existingUser = await usersModel.findByEmail(email);
      if (existingUser) {
        res.status(409).send("Email in use");
      }

      const user = await usersModel.create({
        email,
        password: passwordHash,
        avatarURL: "http://localhost:3000/images/" + req.file.filename,
      });
      return res.status(201).json({
        id: user._id,
        email: user.email,
        avatarURL: user.avatarURL,
        token: user.token,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getCurrentUser(req, res, next) {
    try {
      const { id, email, subscription } = req.user;
      res
        .status(200)
        .json({ id: id, subscription: subscription, email: email });
    } catch (err) {
      next();
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await usersModel.findByEmail(email);
      if (!user) {
        return res.status(401).send("Authentication failed");
      }
      const isPasswordValid = await bcriptjs.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send("Authentication failed");
      }
      const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "2d",
      });
      await usersModel.updateToken(user._id, token);
      return res.status(200).json({ token });
    } catch (err) {
      next(err);
    }
  }

  static async logout(req, res, next) {
    try {
      const user = req.user;
      await usersModel.updateToken(user._id, null);
      return res.status(204).send("exit successfully");
    } catch (err) {
      next(err);
    }
  }

  static async authorize(req, res, next) {
    try {
      const authorizationHeader = req.get("Authorization");
      const token = authorizationHeader.replace("Bearer ", "");
      let userId;
      try {
        userId = await jwt.verify(token, process.env.JWT_SECRET).id;
      } catch (err) {
        next(new UnauthorizedError("User not authorized"));
      }

      const user = await usersModel.findById(userId);
      if (!user || user.token !== token) {
        throw new UnauthorizedError("User not authorized");
      }
      req.user = user;
      req.token = token;
      next();
    } catch (err) {
      throw new UnauthorizedError("Not authorized");
    }
  }

  static validateCreateUser(req, res, next) {
    const createUserRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const result = createUserRules.validate(req.body);
    if (result.error) {
      return res.status(400).send(result.error);
    }
    next();
  }

  static validateLogin(req, res, next) {
    const loginRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const validateRezult = loginRules.validate(req.body);
    if (validateRezult.error) {
      return res.status(400).send(validateRezult.error);
    }
    next();
  }

  static async createUserAvatar(req, res, next) {
    try {
      await imageMini(req, res, next);
      console.log(req.file);
      return res.status(200).json({
        avatarURL: `http://localhost:3000/public/images/${req.file.filename}`,
      });
    } catch (err) {
      next(err);
    }
  }
};
