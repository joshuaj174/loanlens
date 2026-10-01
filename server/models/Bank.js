import mongoose from "mongoose";

const bankSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    logoUrl: {
      type: String,
      default: "",
    },

    websiteUrl: {
      type: String,
      default: "",
    },

    osmNameVariants: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Bank = mongoose.model("Bank", bankSchema);

export default Bank;