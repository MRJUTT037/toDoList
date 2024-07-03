const joi = require("joi");
const authService = require("../services/authService");

const loginSchema = joi.object().keys({
  userName: joi.string().min(3).max(34).required(),
  password: joi.string().min(6).max(30).required(),
});

const logoutSchema = joi.object().keys({
  id: joi.number().required(),
});

const restPasswordSchema = joi.object().keys({
  email: joi.string().email().required(),
  password: joi.string().min(6).max(30).required(),
  confirm_password: joi.ref("password"),
});

module.exports = {
  login: async (req, res) => {
    try {
      const validate = await loginSchema.validateAsync(req.body);
      const user = await authService.login(validate);

      if (user.error) {
        return res.send({
          error: user.error,
        });
      }
      return res.send({
        // message: "This is signin API",
        response: user.response,
      });
    } catch (error) {
      return res.send({
        message: "error",
        error: error,
      });
    }
  },

  logout: async (req, res) => {
    try {
      const validate = await logoutSchema.validateAsync(req.body);
      return res.send({
        message: "This is Logout API",
        data: validate,
      });
    } catch (error) {
      return res.send({
        message: "This is Logout API",
        data: error.message,
      });
    }
  },

  restPassword: async (req, res) => {
    try {
      const validate = await restPasswordSchema.validateAsync(req.body);
      return res.send({
        message: "This is reset API",
        data: validate,
      });
    } catch (error) {
      return res.send({
        message: "This is reset API",
        data: error.message,
      });
    }
  },
};
