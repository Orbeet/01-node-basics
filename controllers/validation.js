const Joi = require("@hapi/joi");

class validations {
  validateRequest = (req, res, next) => {
    const rules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
      id: Joi.string(),
    });
    const validationResult = rules.validate(req.body);
    if (validationResult.error) {
      res.status(400).send({ message: "missing required name field" });
      return;
    }
    next();
  };
}
module.exports = new validations();
