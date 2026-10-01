import express from "express";

import SavedComparison from "../models/SavedComparison.js";

import protect from "../middleware/authMiddleware.js";

const router =
  express.Router();

/*
  =====================================
  SAVE COMPARISON
  =====================================

  POST
  /api/saved-comparisons
*/

router.post(
  "/",
  protect,
  async (req, res) => {
    try {
      const {
        title,
        loanType,
        banks,
        inputs,
        results,
      } = req.body;

      if (
        !loanType?.name ||
        !loanType?.slug ||
        !Array.isArray(banks) ||
        banks.length === 0 ||
        !inputs ||
        !results
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Loan type, banks, inputs and comparison results are required.",
          });
      }

      if (
        !inputs.loanAmount ||
        !inputs.tenureMonths ||
        !inputs.monthlyIncome
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Loan amount, tenure and monthly income are required.",
          });
      }

      const savedComparison =
        await SavedComparison.create({
          userId:
            req.user._id,

          title:
            title?.trim() ||
            `${loanType.name} Comparison`,

          loanType: {
            name:
              loanType.name,

            slug:
              loanType.slug,
          },

          banks:
            banks.map(
              (bank) => ({
                bankId:
                  bank.bankId ||
                  bank._id ||
                  null,

                name:
                  bank.name,
              })
            ),

          inputs,

          results,
        });

      res
        .status(201)
        .json({
          success: true,

          message:
            "Comparison saved successfully.",

          comparison:
            savedComparison,
        });
    } catch (error) {
      console.error(
        "Save comparison error:",
        error
      );

      res
        .status(500)
        .json({
          success: false,

          message:
            "Failed to save comparison.",

          error:
            error.message,
        });
    }
  }
);

/*
  =====================================
  GET MY COMPARISONS
  =====================================

  GET
  /api/saved-comparisons
*/

router.get(
  "/",
  protect,
  async (req, res) => {
    try {
      const comparisons =
        await SavedComparison.find({
          userId:
            req.user._id,
        }).sort({
          createdAt: -1,
        });

      res.json({
        success: true,

        count:
          comparisons.length,

        comparisons,
      });
    } catch (error) {
      console.error(
        "Get comparisons error:",
        error
      );

      res
        .status(500)
        .json({
          success: false,

          message:
            "Failed to load saved comparisons.",

          error:
            error.message,
        });
    }
  }
);

/*
  =====================================
  GET ONE COMPARISON
  =====================================

  GET
  /api/saved-comparisons/:id
*/

router.get(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const comparison =
        await SavedComparison.findOne({
          _id:
            req.params.id,

          userId:
            req.user._id,
        });

      if (!comparison) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Saved comparison not found.",
          });
      }

      res.json({
        success: true,
        comparison,
      });
    } catch (error) {
      console.error(
        "Get comparison error:",
        error
      );

      res
        .status(500)
        .json({
          success: false,

          message:
            "Failed to load saved comparison.",

          error:
            error.message,
        });
    }
  }
);

/*
  =====================================
  DELETE COMPARISON
  =====================================

  DELETE
  /api/saved-comparisons/:id
*/

router.delete(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const comparison =
        await SavedComparison.findOneAndDelete({
          _id:
            req.params.id,

          userId:
            req.user._id,
        });

      if (!comparison) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Saved comparison not found.",
          });
      }

      res.json({
        success: true,

        message:
          "Saved comparison deleted.",
      });
    } catch (error) {
      console.error(
        "Delete comparison error:",
        error
      );

      res
        .status(500)
        .json({
          success: false,

          message:
            "Failed to delete saved comparison.",

          error:
            error.message,
        });
    }
  }
);

export default router;