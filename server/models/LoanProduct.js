import mongoose from "mongoose";

const loanProductSchema = new mongoose.Schema(
  {
    bankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bank",
      required: true,
    },

    loanTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LoanType",
      required: true,
    },

    productName: {
      type: String,
      default: "",
    },

    interestRate: {
      min: {
        type: Number,
        default: null,
      },

      max: {
        type: Number,
        default: null,
      },

      displayText: {
        type: String,
        default: "",
      },
    },

    processingFee: {
      type: String,
      default: "",
    },

    tenureMonths: {
      min: {
        type: Number,
        default: null,
      },

      max: {
        type: Number,
        default: null,
      },
    },

    minLoanAmount: {
      type: Number,
      default: null,
    },

    maxLoanAmount: {
      type: Number,
      default: null,
    },

    minCreditScore: {
      type: Number,
      default: null,
    },

    minIncome: {
      type: Number,
      default: null,
    },

    maxLTV: {
      type: Number,
      default: null,
    },

    minAge: {
      type: Number,
      default: null,
    },

    maxAgeAtLoanEnd: {
      type: Number,
      default: null,
    },

    prepaymentRules: {
      type: String,
      default: "",
    },

    eligibilityNotes: {
      type: String,
      default: "",
    },

    specialFeatures: {
      type: [String],
      default: [],
    },

    applyUrl: {
      type: String,
      default: "",
    },

    documentsUrl: {
      type: String,
      default: "",
    },

    sourceUrl: {
      type: String,
      default: "",
    },

    sourceType: {
      type: String,
      enum: [
        "official-bank",
        "rbi",
        "verified-third-party",
      ],
      default: "official-bank",
    },

    lastVerified: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// One bank should have only one entry
// for each loan type in our main comparison dataset.
loanProductSchema.index(
  {
    bankId: 1,
    loanTypeId: 1,
  },
  {
    unique: true,
  }
);

const LoanProduct = mongoose.model(
  "LoanProduct",
  loanProductSchema
);

export default LoanProduct;