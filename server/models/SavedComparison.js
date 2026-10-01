import mongoose from "mongoose";

const savedComparisonSchema =
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
        default: "Loan Comparison",
      },

      loanType: {
        name: {
          type: String,
          required: true,
        },

        slug: {
          type: String,
          required: true,
        },
      },

      banks: [
        {
          bankId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bank",
          },

          name: {
            type: String,
            required: true,
          },
        },
      ],

      inputs: {
        loanAmount: {
          type: Number,
          required: true,
        },

        tenureMonths: {
          type: Number,
          required: true,
        },

        monthlyIncome: {
          type: Number,
          required: true,
        },

        existingEMIs: {
          type: Number,
          default: 0,
        },

        age: {
          type: Number,
          default: null,
        },

        creditScore: {
          type: Number,
          default: null,
        },
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

const SavedComparison =
  mongoose.model(
    "SavedComparison",
    savedComparisonSchema
  );

export default SavedComparison;