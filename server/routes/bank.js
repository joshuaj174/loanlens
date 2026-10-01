import express from "express";
import Bank from "../models/Bank.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const banks = await Bank.find().sort({ name: 1 });

    res.json({
      success: true,
      count: banks.length,
      banks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch banks",
      error: error.message,
    });
  }
});

export default router;