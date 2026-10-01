import jwt from "jsonwebtoken";

import User from "../models/User.js";

const protect = async (
  req,
  res,
  next
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith(
        "Bearer "
      )
    ) {
      return res
        .status(401)
        .json({
          success: false,
          message:
            "Authentication token is required.",
        });
    }

    const token =
      authHeader.split(
        " "
      )[1];

    if (!token) {
      return res
        .status(401)
        .json({
          success: false,
          message:
            "Authentication token is missing.",
        });
    }

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    const user =
      await User.findById(
        decoded.userId
      ).select(
        "-password"
      );

    if (!user) {
      return res
        .status(401)
        .json({
          success: false,
          message:
            "User associated with this token no longer exists.",
        });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(
      "Authentication error:",
      error.message
    );

    return res
      .status(401)
      .json({
        success: false,
        message:
          "Invalid or expired authentication token.",
      });
  }
};

export default protect;