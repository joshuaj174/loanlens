import express from "express";

import SavedSimulation from "../models/SavedSimulation.js";

import protect from "../middleware/authMiddleware.js";

const router =
  express.Router();

/*
  =====================================
  SAVE SIMULATION
  =====================================

  POST
  /api/saved-simulations
*/

router.post(
  "/",
  protect,
  async (req, res) => {
    try {
      const {
        title,
        simulationType,
        loanType,
        bank,
        inputs,
        results,
      } = req.body;

      if (
        !simulationType ||
        !inputs ||
        !results
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Simulation type, inputs and results are required.",
          });
      }

      const allowedTypes = [
        "floating-rate",
        "prepayment",
      ];

      if (
        !allowedTypes.includes(
          simulationType
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Unsupported simulation type.",
          });
      }

      const savedSimulation =
        await SavedSimulation.create({
          userId:
            req.user._id,

          title:
            title?.trim() ||
            (
              simulationType ===
              "floating-rate"
                ? "Floating Rate Simulation"
                : "Prepayment Simulation"
            ),

          simulationType,

          loanType: {
            name:
              loanType?.name ||
              "",

            slug:
              loanType?.slug ||
              "",
          },

          bank: {
            bankId:
              bank?.bankId ||
              bank?._id ||
              null,

            name:
              bank?.name ||
              "",
          },

          inputs,

          results,
        });

      res
        .status(201)
        .json({
          success: true,

          message:
            "Simulation saved successfully.",

          simulation:
            savedSimulation,
        });
    } catch (error) {
      console.error(
        "Save simulation error:",
        error
      );

      res
        .status(500)
        .json({
          success: false,

          message:
            "Failed to save simulation.",

          error:
            error.message,
        });
    }
  }
);

/*
  =====================================
  GET MY SIMULATIONS
  =====================================

  GET
  /api/saved-simulations
*/

router.get(
  "/",
  protect,
  async (req, res) => {
    try {
      const simulations =
        await SavedSimulation.find({
          userId:
            req.user._id,
        }).sort({
          createdAt: -1,
        });

      res.json({
        success: true,

        count:
          simulations.length,

        simulations,
      });
    } catch (error) {
      console.error(
        "Get simulations error:",
        error
      );

      res
        .status(500)
        .json({
          success: false,

          message:
            "Failed to load saved simulations.",

          error:
            error.message,
        });
    }
  }
);

/*
  =====================================
  GET ONE SIMULATION
  =====================================

  GET
  /api/saved-simulations/:id
*/

router.get(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const simulation =
        await SavedSimulation.findOne({
          _id:
            req.params.id,

          userId:
            req.user._id,
        });

      if (!simulation) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Saved simulation not found.",
          });
      }

      res.json({
        success: true,
        simulation,
      });
    } catch (error) {
      console.error(
        "Get simulation error:",
        error
      );

      res
        .status(500)
        .json({
          success: false,

          message:
            "Failed to load saved simulation.",

          error:
            error.message,
        });
    }
  }
);

/*
  =====================================
  DELETE SIMULATION
  =====================================

  DELETE
  /api/saved-simulations/:id
*/

router.delete(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const simulation =
        await SavedSimulation.findOneAndDelete({
          _id:
            req.params.id,

          userId:
            req.user._id,
        });

      if (!simulation) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Saved simulation not found.",
          });
      }

      res.json({
        success: true,

        message:
          "Saved simulation deleted.",
      });
    } catch (error) {
      console.error(
        "Delete simulation error:",
        error
      );

      res
        .status(500)
        .json({
          success: false,

          message:
            "Failed to delete saved simulation.",

          error:
            error.message,
        });
    }
  }
);

export default router;