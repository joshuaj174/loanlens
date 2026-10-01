import mongoose from "mongoose";

const savedSimulationSchema =
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      title: {
        type: String,
        trim: true,
        default: "Loan Simulation",
      },

      simulationType: {
        type: String,
        enum: [
          "floating-rate",
          "prepayment",
        ],
        required: true,
      },

      loanType: {
        name: {
          type: String,
          default: "",
        },

        slug: {
          type: String,
          default: "",
        },
      },

      bank: {
        bankId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Bank",
          default: null,
        },

        name: {
          type: String,
          default: "",
        },
      },

      inputs: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },

      results: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

const SavedSimulation =
  mongoose.model(
    "SavedSimulation",
    savedSimulationSchema
  );

export default SavedSimulation;