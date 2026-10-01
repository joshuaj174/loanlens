import express from "express";

import LoanProduct from "../models/LoanProduct.js";

const router = express.Router();

/*
GET /api/loan-products

Optional queries:

?loanType=home

?loanType=home&bankIds=id1,id2,id3
*/

router.get("/", async (req, res) => {
  try {
    const {
      loanType,
      bankIds,
    } = req.query;

    const filter = {};

    if (bankIds) {
      const ids = bankIds
        .split(",")
        .filter(Boolean);

      filter.bankId = {
        $in: ids,
      };
    }

    let products =
      await LoanProduct.find(filter)
        .populate(
          "bankId",
          "name logoUrl websiteUrl"
        )
        .populate(
          "loanTypeId",
          "name slug"
        );

    if (loanType) {
      products = products.filter(
        (product) =>
          product.loanTypeId?.slug ===
          loanType
      );
    }

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(
      "Loan product fetch error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch loan products",
      error: error.message,
    });
  }
});

export default router;