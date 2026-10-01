import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";

const router =
  express.Router();

const createToken = (
  userId
) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

/*
  REGISTER

  POST
  /api/auth/register
*/

router.post(
  "/register",
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
      } = req.body;

      if (
        !name ||
        !email ||
        !password
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Name, email and password are required.",
          });
      }

      if (
        password.length < 6
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Password must contain at least 6 characters.",
          });
      }

      const normalizedEmail =
        email
          .trim()
          .toLowerCase();

      const existingUser =
        await User.findOne({
          email:
            normalizedEmail,
        });

      if (existingUser) {
        return res
          .status(409)
          .json({
            success: false,
            message:
              "An account with this email already exists.",
          });
      }

      const salt =
        await bcrypt.genSalt(
          10
        );

      const hashedPassword =
        await bcrypt.hash(
          password,
          salt
        );

      const user =
        await User.create({
          name:
            name.trim(),

          email:
            normalizedEmail,

          password:
            hashedPassword,
        });

      const token =
        createToken(
          user._id
        );

      res
        .status(201)
        .json({
          success: true,

          message:
            "Account created successfully.",

          token,

          user: {
            id:
              user._id,

            name:
              user.name,

            email:
              user.email,
          },
        });
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to create account.",
          error:
            error.message,
        });
    }
  }
);

/*
  LOGIN

  POST
  /api/auth/login
*/

router.post(
  "/login",
  async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;

      if (
        !email ||
        !password
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Email and password are required.",
          });
      }

      const normalizedEmail =
        email
          .trim()
          .toLowerCase();

      const user =
        await User.findOne({
          email:
            normalizedEmail,
        });

      if (!user) {
        return res
          .status(401)
          .json({
            success: false,
            message:
              "Invalid email or password.",
          });
      }

      const passwordMatches =
        await bcrypt.compare(
          password,
          user.password
        );

      if (
        !passwordMatches
      ) {
        return res
          .status(401)
          .json({
            success: false,
            message:
              "Invalid email or password.",
          });
      }

      const token =
        createToken(
          user._id
        );

      res.json({
        success: true,

        message:
          "Login successful.",

        token,

        user: {
          id:
            user._id,

          name:
            user.name,

          email:
            user.email,
        },
      });
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to login.",
          error:
            error.message,
        });
    }
  }
);

/*
  CURRENT USER

  GET
  /api/auth/me
*/

router.get(
  "/me",
  protect,
  async (req, res) => {
    res.json({
      success: true,

      user: {
        id:
          req.user._id,

        name:
          req.user.name,

        email:
          req.user.email,
      },
    });
  }
);

export default router;