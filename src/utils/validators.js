import { body, param } from "express-validator";
import { User } from "../models/user.model";

export const singUpValidation = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email adrress")
    .bail()
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        return Promise.reject("Email is already taken");
      }
    }),
  body("username")
    .matches("^[a-zA-Z0-9_.-]*$")
    .withMessage(
      "Username must contain only letters(a-z), numbers (0-9), and (- _)"
    )
    .bail()
    .isLength({ min: 5, max: 15 })
    .withMessage("Username must be between 5 and 15 characters long")
    .bail()
    .custom(async (value) => {
      const user = await User.findOne({ username: value });
      if (user) {
        return Promise.reject("Username is already taken");
      }
    }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be longer than 6 characters"),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Please enter a valid email adress"),
  body("password").exists().withMessage("Please enter your password"),
];

export const updateinfoValidation = [
  body("email")
    .optional()
    .isEmail()
    .withMessage("Please enter a valid email adrress")
    .bail()

    .custom(async (value, { req }) => {
      //check if the user is editing his info to avoid throwing an error
      if (req.user.email == req.body.email) {
        return Promise.resolve();
      }

      const user = await User.findOne({ email: value });
      if (user) {
        return Promise.reject("Email is already taken");
      }
    }),

  body("username")
    .optional()
    .matches("^[a-zA-Z0-9_.-]*$")
    .withMessage(
      "Username must contain only letters(a-z), numbers (0-9), and (- _)"
    )
    .bail()

    /**
     *
     */
    .custom(async (value, { req }) => {
      //check if the user is editing his info to avoid throwing an error
      if (req.user.username == req.body.username) {
        console.log("Resolved");
        return Promise.resolve();
      }

      const user = await User.findOne({ username: value });
      if (user) {
        return Promise.reject("Username is already taken");
      }
    })
    .bail()
    .isLength({ min: 5, max: 15 })
    .withMessage("Username must be between 5 and 15 characters long"),

  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters long"),
];
