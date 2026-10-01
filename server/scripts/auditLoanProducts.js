import dotenv from "dotenv";
import mongoose from "mongoose";

import Bank from "../models/Bank.js";
import LoanType from "../models/LoanType.js";
import LoanProduct from "../models/LoanProduct.js";

dotenv.config();

const auditLoanProducts = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "\nMongoDB connected."
    );

    // These references make sure the models
    // are registered before populate() runs.
    void Bank;
    void LoanType;

    const products =
      await LoanProduct.find({})
        .populate(
          "bankId",
          "name"
        )
        .populate(
          "loanTypeId",
          "name slug"
        );

    console.log(
      `\nTotal loan products: ${products.length}\n`
    );

    const missingRates = [];

    products.forEach(
      (product) => {
        const bankName =
          product.bankId?.name ||
          "Unknown Bank";

        const loanName =
          product.loanTypeId
            ?.name ||
          "Unknown Loan";

        const minRate =
          product.interestRate
            ?.min;

        const maxRate =
          product.interestRate
            ?.max;

        const status =
          minRate === null ||
          minRate === undefined
            ? "MISSING"
            : "OK";

        console.log(
          `${status.padEnd(
            8
          )} | ${loanName.padEnd(
            18
          )} | ${bankName.padEnd(
            28
          )} | Min: ${
            minRate ??
            "NULL"
          } | Max: ${
            maxRate ??
            "NULL"
          }`
        );

        if (
          minRate === null ||
          minRate === undefined
        ) {
          missingRates.push({
            bank:
              bankName,

            loan:
              loanName,

            productName:
              product.productName,

            displayText:
              product
                .interestRate
                ?.displayText,

            sourceUrl:
              product.sourceUrl,
          });
        }
      }
    );

    console.log(
      "\n===================================="
    );

    console.log(
      `Products missing numeric starting rate: ${missingRates.length}`
    );

    console.log(
      "====================================\n"
    );

    if (
      missingRates.length === 0
    ) {
      console.log(
        "All loan products have a numeric starting interest rate."
      );
    } else {
      missingRates.forEach(
        (item, index) => {
          console.log(
            `${index + 1}. ${item.bank} — ${item.loan}`
          );

          console.log(
            `   Product: ${item.productName}`
          );

          console.log(
            `   Current text: ${
              item.displayText ||
              "None"
            }`
          );

          console.log(
            `   Source: ${
              item.sourceUrl ||
              "None"
            }\n`
          );
        }
      );
    }

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error(
      "\nAudit failed:"
    );

    console.error(
      error.message
    );

    await mongoose.connection.close();

    process.exit(1);
  }
};

auditLoanProducts();