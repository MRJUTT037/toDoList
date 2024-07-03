require("dotenv").config();

const userModel = require("../models/userModel");
const { compare } = require("bcryptjs");
// const { sign } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

module.exports = {
  login: async (body) => {
    try {
      console.log(body);
      const isUser = await userModel.findUser(body.userName);
      if (!isUser.response) {
        return {
          error: {
            message: "User Not Found!",
          },
        };
      }

      const isValid = await compare(
        body.password,
        isUser.response.dataValues.password
      );

      if (!isValid) {
        return {
          response: {
            token: undefined,
            message: "Invalid credentials",
          },
        };
      }

      // Remove sensitive data before signing the token
      delete isUser.response.dataValues.password;

      // Define your payload with the necessary user data
      const payload = {
        userId: isUser.response.dataValues.userId,
        username: isUser.response.dataValues.userName,
        // Add more data as needed
      };

      // Check if process.env.SECRET is defined and non-empty
      if (!process.env.SECRET) {
        throw new Error("Secret key not configured properly");
      }

      // Sign the JWT with payload, secret key, and options
      const token = jwt.sign(payload, process.env.SECRET, {
        expiresIn: "30s", // Example expiry time
      });

      // Optionally, store session information or return the token
      return {
        response: {
          response: isUser,
          token: token,
          message: "Logged in successfully!",
        },
      };
    } catch (error) {
      // console.log("Service Error:", error);
      return {
        error: error,
      };
    }
  },
};
//   login: async (body) => {
//     try {
//       const isUser = await userModel.findUser(body.userName);
//       if (isUser.error || !isUser.response) {
//         return {
//           error: {
//             error: isUser?.error || !isUser.response,
//             message: "User Not Found!",
//           },
//         };
//       }
//       const isValid = await compare(
//         body.password,
//         isUser.response.dataValues.password
//       );

//       if (!isValid) {
//         return {
//           response: {
//             token: "undefined",
//             message: "invalid credentials",
//           },
//         };
//       }

//       delete isUser.response.dataValues.password;
//       const token = sign(isUser.response.dataValues, process.env.SECRET, {
//         expiresIn: 30,
//       });

//       //store in session table

//       return {
//         response: {
//           token: token,
//           message: "loggen in successfully!",
//         },
//       };
//     } catch (error) {
//       return {
//         error: error,
//       };
//     }
//   },
// };
