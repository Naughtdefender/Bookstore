/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable func-names */
/* eslint-disable max-len */
/**
 * @module       Model
 * @file         user.js
 * @description  schema holds the database Schema
 * @author       Kshitiz <kshitizsharma405@gmail.com>
 * @since        13/12/2023
-----------------------------------------------------------------------------------------------*/
// connecting to the mongoDB through mongoose
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Schema for users
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      validate: {
        validator: (value) => /^[a-zA-Z ]{3,30}$/.test(value),
        message: "First name must be 3-30 alphabetic characters",
      },
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      validate: {
        validator: (value) => /^[a-zA-Z ]{3,30}$/.test(value),
        message: "Last name must be 3-30 alphabetic characters",
      },
    },
    emailId: {
      type: String,
      required: [true, "Email ID is required"],
      unique: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      validate: {
        validator: (value) =>
          /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/.test(value),
        message:
          "Password must be 8-16 characters long, include at least one number and one special character",
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);

class UserModel {
  /**
   * @description Register a new user
   * @param {Object} userDetails - User details to create a new account
   * @returns {Promise<Object>} - The created user document
   */
  async create(userDetails) {
    try {
      const newUser = new User(userDetails);
      return await newUser.save();
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  /**
   * @description Login a user
   * @param {Object} loginInput - Contains email and role
   * @returns {Promise<Object>} - The user document if found
   */
  async login(loginInput) {
    try {
      const user = await User.findOne({ emailId: loginInput.emailId });

      if (!user) {
        throw new Error("Invalid credentials");
      }

      if (user.role !== loginInput.role) {
        throw new Error("Access denied!");
      }

      return user;
    } catch (error) {
      throw new Error(`Login error: ${error.message}`);
    }
  }

  /**
   * @description Find user for password reset
   * @param {String} emailId - Email ID of the user
   * @returns {Promise<Object>} - The user document if found
   */
  async forgotPassword(emailId) {
    try {
      const user = await User.findOne({ emailId });

      if (!user) {
        throw new Error("Email not found");
      }

      return user;
    } catch (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
  }

  /**
   * @description Reset user password
   * @param {Object} inputData - Contains emailId and new password
   * @returns {Promise<Object>} - The updated user document
   */
  async updatePassword(inputData) {
    try {
      const user = await User.findOne({ emailId: inputData.emailId });

      if (!user) {
        throw new Error("User not found");
      }

      const hashedPassword = await bcrypt.hash(inputData.password, 10);
      user.password = hashedPassword;

      return await user.save();
    } catch (error) {
      throw new Error(`Error updating password: ${error.message}`);
    }
  }
}

module.exports = new UserModel();
