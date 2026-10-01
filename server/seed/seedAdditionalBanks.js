import dotenv from "dotenv";

import connectDB from "../config/db.js";
import Bank from "../models/Bank.js";

dotenv.config();

const additionalBanks = [
  {
    name: "Bank of India",
    websiteUrl: "https://bankofindia.co.in/",
    logoUrl: "",
    osmNameVariants: [
      "Bank of India",
      "BOI",
    ],
  },

  {
    name: "Union Bank of India",
    websiteUrl: "https://www.unionbankofindia.co.in/",
    logoUrl: "",
    osmNameVariants: [
      "Union Bank of India",
      "Union Bank",
      "UBI",
    ],
  },

  {
    name: "IDBI Bank",
    websiteUrl: "https://www.idbibank.in/",
    logoUrl: "",
    osmNameVariants: [
      "IDBI Bank",
      "IDBI",
    ],
  },

  {
    name: "IndusInd Bank",
    websiteUrl: "https://www.indusind.com/",
    logoUrl: "",
    osmNameVariants: [
      "IndusInd Bank",
      "IndusInd",
    ],
  },

  {
    name: "Yes Bank",
    websiteUrl: "https://www.yesbank.in/",
    logoUrl: "",
    osmNameVariants: [
      "YES BANK",
      "Yes Bank",
      "YES Bank",
    ],
  },

  {
    name: "Federal Bank",
    websiteUrl: "https://www.federalbank.co.in/",
    logoUrl: "",
    osmNameVariants: [
      "Federal Bank",
      "The Federal Bank",
    ],
  },
];

const seedAdditionalBanks =
  async () => {
    try {
      await connectDB();

      console.log(
        "Connected to MongoDB."
      );

      for (
        const bank
        of additionalBanks
      ) {
        const result =
          await Bank.findOneAndUpdate(
            {
              name: bank.name,
            },
            {
              $set: bank,
            },
            {
              upsert: true,
              returnDocument:
                "after",
              setDefaultsOnInsert:
                true,
            }
          );

        console.log(
          `Seeded: ${result.name}`
        );
      }

      const bankCount =
        await Bank.countDocuments();

      console.log(
        `Total banks in database: ${bankCount}`
      );

      process.exit(0);
    } catch (error) {
      console.error(
        "Additional bank seed failed:",
        error
      );

      process.exit(1);
    }
  };

seedAdditionalBanks();