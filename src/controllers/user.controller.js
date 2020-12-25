import { User } from "../models/user.model";
import {
  updateinfoValidation,
  singUpValidation,
  loginValidation,
} from "../utils/validators";
import { validationResult } from "express-validator";
import { newToken } from "../utils/auth";

// register a new user
export const newUser = [
  // Validation middleware
  singUpValidation,
  // user registration
  async (req, res) => {
    // check if there is any validations errors and sending error messages back to the client
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    // create a user in the database
    try {
      const user = await User.create({ ...req.body });
      return res.status(201).json({
        success: {
          message: "you may now log in using your email and password",
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).end();
    }
  },
];

// user login logic
export const login = [
  loginValidation,
  async (req, res) => {
    // check if there is any validations errors and sending error messages back to the client
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    /* check if the user exists and if the password given
     * matches the one stored in the database
     */
    try {
      const user = await User.findOne({ email: req.body.email }).select(
        "email password"
      );
      if (!user) {
        return res.status(401).json({
          error: { message: "Your email and/or password do not match" },
        });
      }
      const result = await user.comparePassword(req.body.password);
      if (!result) {
        return res.status(401).json({
          error: { message: "Your email and/or password do not match" },
        });
      }

      // creating a token and sending it back to the client
      const token = newToken(user);
      return res.json({ token: token });
    } catch (err) {
      console.error(err);
      return res.status(500).end();
    }
  },
];

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("email username roles")
      .lean()
      .exec();
    if (!user) {
      return res.status(400).json({ error: "user does no exist" });
    }
    res.status(201).json({ data: user });
  } catch (err) {
    console.error(err);
    return res.status(500).end();
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("email username roles")
      .lean()
      .exec();
    if (!users) {
      return res.status(400).json({ error: "can't find any registered users" });
    }
    res.status(201).json({ data: users });
  } catch (err) {
    console.error(err);
    return res.status(500).end();
  }
};
export const updateUser = [
  // Validation middleware
  updateinfoValidation,
  // update user info
  async (req, res) => {
    // check if there is any validations errors and sending error messages back to the client
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    if (req.user._id != req.params.id) {
      if (!req.user.roles.admin) {
        return res
          .status(400)
          .json({ error: { message: "you can't edit this user info" } });
      }
    }
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
        },
        { new: true }
      )
        .lean()
        .exec();
      res.status(201).json({ data: user });
    } catch (err) {
      console.error(err);
      res.status(500).end();
    }
  },
];

export const deleteUser = async (req, res) => {
  if (req.user._id != req.params.id && !req.user.roles.admin) {
    return res
      .status(400)
      .json({ error: { message: "you can't delete this user " } });
  }
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(400).json({ error: "user does no exist" });
    }

    user.delete();
    res.status(201).json({ message: "user deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};
