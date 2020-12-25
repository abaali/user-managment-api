import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { config } from "../config";

export const newToken = (user) => {
  return jwt.sign({ user_id: user._id, admin: 0 }, config.jwt_secret, {
    expiresIn: "1h",
  });
};

export const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwt_secret, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });
};

export const isAuthenticated = async (req, res, next) => {
  const token = req.headers.auth;

  if (!token) {
    return res
      .status(401)
      .json({ error: { message: "Please provide a token to verify" } });
  }

  try {
    const result = await verifyToken(token);
    const user = await User.findById(result.user_id).lean().exec();
    if (!user) {
      return res
        .status(401)
        .json({ error: { message: "user does not exist" } });
    }
    req.user = user;
  } catch (err) {
    console.error(err);
    return res
      .status(401)
      .json({ error: { message: "either the token is wrong or expired" } });
  }

  next();
};

/*
 * #TODO: Ability to check for multiple roles
 */

/**
 * HasRole() returns a middleware that checks if the user is authorized
 * to use a certain a service
 * based on two parameters
 * @param role {String} defaults to user takes also admin as a value
 * @param optional {Boolean}
 */
export const HasRole = (role = "user", optional = true) => {
  return async (req, res, next) => {
    const headerRole = req.headers.role;

    /**
     * middleware for the path GET /api/isauth
     */
    if (headerRole) {
      if (!req.user.roles[headerRole]) {
        return res.status(401).json({
          error: { message: "user not allowed to use this feature" },
        });
      }
      return next();
    }

    if (!req.user.roles[role]) {
      if (optional) {
        return next();
      }
      return res.status(401).json({
        error: { message: "user not allowed to use this feature" },
      });
    }

    next();
  };
};
