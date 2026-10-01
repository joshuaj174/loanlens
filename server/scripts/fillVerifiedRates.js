import dotenv from "dotenv";

import connectDB from "../config/db.js";

import Bank from "../models/Bank.js";
import LoanType from "../models/LoanType.js";
import LoanProduct from "../models/LoanProduct.js";

dotenv.config();

const VERIFIED_DATE =
  new Date("2026-09-30");

const updates = [
  {
    bankName:
      "HDFC Bank",

    loanSlug:
      "home",

    interestRate: {
      min: 8.35,

      displayText:
        "Starting from 8.35% p.a.; actual rate depends on borrower profile and HDFC Bank pricing.",
    },

    sourceUrl:
      "https://v.hdfcbank.com/xpressway/easyemi_on_consumer_loans.html",
  },

  {
    bankName:
      "Axis Bank",

    loanSlug:
      "education",

    interestRate: {
      min: 7.45,
      max: 13,

      displayText:
        "7.45% - 13.00% p.a. based on Axis Bank's published Education Loan disbursement-rate disclosure.",
    },

    sourceUrl:
      "https://www.axisbank.com/docs/default-source/default-document-library/education_loan_new.pdf",
  },

  {
    bankName:
      "IndusInd Bank",

    loanSlug:
      "car",

    interestRate: {
      min: 9.25,
      max: 18,

      displayText:
        "9.25% - 18.00% p.a. for new passenger vehicle loans based on IndusInd Bank's published lending-rate disclosure.",
    },

    sourceUrl:
      "https://www.indusind.com/content/dam/regulatoryDisclosure/others/Interest%20Rate%20on%20Advances/Q4-FY-24-25-IRR.pdf",
  },
];

const fillVerifiedRates =
  async () => {
    try {
      await connectDB();

      console.log(
        "Connected to MongoDB."
      );

      let updatedCount = 0;
      let skippedCount = 0;

      for (
        const update
        of updates
      ) {
        const bank =
          await Bank.findOne({
            name:
              update.bankName,
          });

        if (!bank) {
          console.log(
            `SKIPPED: Bank not found -> ${update.bankName}`
          );

          skippedCount++;
          continue;
        }

        const loanType =
          await LoanType.findOne({
            slug:
              update.loanSlug,
          });

        if (!loanType) {
          console.log(
            `SKIPPED: Loan type not found -> ${update.loanSlug}`
          );

          skippedCount++;
          continue;
        }

        const product =
          await LoanProduct.findOne({
            bankId:
              bank._id,

            loanTypeId:
              loanType._id,
          });

        if (!product) {
          console.log(
            `SKIPPED: Product not found -> ${update.bankName} / ${update.loanSlug}`
          );

          skippedCount++;
          continue;
        }

        product.interestRate = {
          ...product.interestRate?.toObject?.(),
          ...update.interestRate,
        };

        product.sourceUrl =
          update.sourceUrl;

        product.sourceType =
          "official-bank";

        product.lastVerified =
          VERIFIED_DATE;

        await product.save();

        updatedCount++;

        console.log(
          `UPDATED: ${update.bankName} -> ${loanType.name}`
        );

        console.log(
          `Rate: ${update.interestRate.displayText}`
        );

        console.log("");
      }

      console.log(
        "===================================="
      );

      console.log(
        `Updated products: ${updatedCount}`
      );

      console.log(
        `Skipped products: ${skippedCount}`
      );

      console.log(
        "===================================="
      );

      process.exit(0);
    } catch (error) {
      console.error(
        "Verified rate cleanup failed:",
        error
      );

      process.exit(1);
    }
  };

fillVerifiedRates();