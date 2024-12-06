/* eslint-disable */
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class Helper {
  /**
   * @description Generates a token for user authentication
   * @param {*} loginInput - User login details
   * @returns {string} - Generated JWT token
   */
  generateToken(loginInput) {
    console.log("input", loginInput);
    const token = jwt.sign(loginInput, process.env.SECRET_KEY, {
      expiresIn: "3000s", // Consider different expiry for refresh tokens
    });
    return token;
  }

  /**
   * @description Compares the provided password with the hashed password in the database
   * @param {*} loginData - Password entered by the user
   * @param {*} databaseData - Hashed password in the database
   * @returns {boolean} - True if passwords match, else false
   */
  checkByBcrypt(loginData, databaseData) {
    try {
      if (loginData && databaseData) {
        return bcrypt.compareSync(loginData, databaseData);
      }
      return false;
    } catch (error) {
      console.error("Error comparing passwords", error);
      return false;
    }
  }

  /**
   * @description Extracts email from the provided JWT token
   * @param {string} token - The JWT token
   * @returns {string} - The email ID from the decoded token
   */
  getEmailFromToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      return decoded.emailId;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }

  /**
   * @description Sets the role in request for authorization
   * @param {string} role - The role to be set
   * @returns {function} - Middleware function to set role
   */
  setRole(role) {
    return (req, res, next) => {
      req.role = role;
      next();
    };
  }

  /**
   * @description Checks if the user has the required role
   * @param {string[]} roles - Allowed roles
   * @returns {function} - Middleware function to check role
   */
  checkRole(roles) {
    return (req, res, next) => {
      if (roles.includes(req.role)) {
        next();
      } else {
        return res.status(403).send({
          success: false,
          message: "Forbidden: Incorrect role",
        });
      }
    };
  }

  /**
   * @description Verifies if the user is an admin
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {function} next - Next middleware function
   * @returns {void}
   */
  verifyRole1(req, res, next) {
    console.log("from verify role");
    try {
      const decode = jwt.verify(req.headers.token, process.env.SECRET_KEY);
      console.log("decoded token", decode);

      if (decode.role !== "admin") {
        return res.status(401).send({
          success: false,
          message: "Authorization Failed, Please use admin token",
        });
      }

      req.userData = decode;
      next();
    } catch (error) {
      return res.status(401).send({
        success: false,
        error: "Unauthorized Access, please check again",
      });
    }
  }

  /**
   * @description Generates a token for password reset
   * @param {*} loginInput - User data for generating token
   * @returns {string} - Generated JWT token for password reset
   */
  forgotPasswordToken(loginInput) {
    try {
      const token = jwt.sign(loginInput.toJSON(), process.env.SECRET_KEY, {
        expiresIn: "3000s", // Adjust expiry as needed
      });
      return token;
    } catch (error) {
      throw new Error("Error generating password reset token");
    }
  }
}

module.exports = new Helper();
