import dotenv from "dotenv";
import mongoose from "mongoose";

import Bank from "../models/Bank.js";
import LoanType from "../models/LoanType.js";
import LoanProduct from "../models/LoanProduct.js";

dotenv.config();

const cleanLoanProductRates = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "\nMongoDB connected for rate cleanup.\n"
    );

    const sbi =
      await Bank.findOne({
        name: "State Bank of India",
      });

    const kotak =
      await Bank.findOne({
        name: "Kotak Mahindra Bank",
      });

    const canara =
      await Bank.findOne({
        name: "Canara Bank",
      });

    const bob =
      await Bank.findOne({
        name: "Bank of Baroda",
      });

    const homeLoan =
      await LoanType.findOne({
        slug: "home",
      });

    const educationLoan =
      await LoanType.findOne({
        slug: "education",
      });

    if (
      !sbi ||
      !kotak ||
      !canara ||
      !bob ||
      !homeLoan ||
      !educationLoan
    ) {
      throw new Error(
        "Required banks or loan types were not found."
      );
    }

    const updates = [
      {
        bankId: sbi._id,
        loanTypeId:
          homeLoan._id,

        interestRate: {
          min: 7.25,
          max: null,

          displayText:
            "Starting from 7.25% p.a.; actual rate depends on borrower profile, credit score and applicable SBI pricing.",
        },

        sourceUrl:
          "https://sbi.co.in/",

        lastVerified:
          new Date(
            "2026-09-30"
          ),
      },

      {
        bankId: kotak._id,
        loanTypeId:
          homeLoan._id,

        interestRate: {
          min: 7.99,
          max: null,

          displayText:
            "Starting from 7.99% p.a.; final rate depends on borrower profile, credit history, LTV and bank assessment.",
        },

        sourceUrl:
          "https://www.kotak.com/",

        lastVerified:
          new Date(
            "2026-09-30"
          ),
      },

      {
        bankId: canara._id,
        loanTypeId:
          homeLoan._id,

        interestRate: {
          min: 7.15,
          max: 10.0,

          displayText:
            "Current contracted Housing Loan range is approximately 7.15% to 10.00% p.a.",
        },

        sourceUrl:
          "https://www.canarabank.bank.in/pages/interest-rate-range-on-loans",

        lastVerified:
          new Date(
            "2026-09-30"
          ),
      },

      {
        bankId: bob._id,
        loanTypeId:
          educationLoan._id,

        interestRate: {
          min: 8.15,
          max: null,

          displayText:
            "Study in India starts from BRLLR + 0.25%. With current BRLLR at 7.90%, the starting rate is approximately 8.15% p.a.",
        },

        sourceUrl:
          "https://bankofbaroda.bank.in/interest-rate-and-service-charges/retail-loans-interest-rates",

        lastVerified:
          new Date(
            "2026-09-30"
          ),
      },
    ];

    for (
      const update
      of updates
    ) {
      const result =
        await LoanProduct.findOneAndUpdate(
          {
            bankId:
              update.bankId,

            loanTypeId:
              update.loanTypeId,
          },

          {
            $set: {
              interestRate:
                update.interestRate,

              sourceUrl:
                update.sourceUrl,

              sourceType:
                "official-bank",

              lastVerified:
                update.lastVerified,
            },
          },

          {
            new: true,
            runValidators: true,
          }
        )
          .populate(
            "bankId",
            "name"
          )
          .populate(
            "loanTypeId",
            "name slug"
          );

      if (!result) {
        console.log(
          "No matching product found."
        );

        continue;
      }

      console.log(
        `Updated: ${result.bankId.name} — ${result.loanTypeId.name}`
      );

      console.log(
        `Rate: ${result.interestRate.min}%${
          result.interestRate.max
            ? ` - ${result.interestRate.max}%`
            : ""
        }\n`
      );
    }

    console.log(
      "Rate cleanup finished successfully."
    );

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error(
      "\nRate cleanup failed:"
    );

    console.error(
      error.message
    );

    await mongoose.connection.close();

    process.exit(1);
  }
};

cleanLoanProductRates();