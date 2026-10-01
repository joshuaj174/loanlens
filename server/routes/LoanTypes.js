import express from "express";
import LoanType from "../models/LoanType.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const loanTypes = await LoanType.find().sort({ name: 1 });

    res.json({
      success: true,
      count: loanTypes.length,
      loanTypes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch loan types",
      error: error.message,
    });
  }
});

export default router;