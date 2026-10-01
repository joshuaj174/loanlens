import mongoose from "mongoose";

const loanTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    isAssetBacked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const LoanType = mongoose.model("LoanType", loanTypeSchema);

export default LoanType;