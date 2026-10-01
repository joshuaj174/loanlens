import dotenv from "dotenv";

import connectDB from "../config/db.js";

import Bank from "../models/Bank.js";
import LoanType from "../models/LoanType.js";
import LoanProduct from "../models/LoanProduct.js";

dotenv.config();

const runAudit = async () => {
  try {
    await connectDB();

    console.log("Connected to MongoDB.");
    console.log("");

    const banks =
      await Bank.find().sort({
        name: 1,
      });

    const loanTypes =
      await LoanType.find().sort({
        name: 1,
      });

    const products =
      await LoanProduct.find()
        .populate(
          "bankId",
          "name"
        )
        .populate(
          "loanTypeId",
          "name slug"
        );

    console.log(
      "===================================="
    );
    console.log("LOANLENS DATA AUDIT");
    console.log(
      "===================================="
    );

    console.log(
      `Banks: ${banks.length}`
    );

    console.log(
      `Loan Types: ${loanTypes.length}`
    );

    console.log(
      `Loan Products: ${products.length}`
    );

    console.log("");

    /*
      ====================================
      PRODUCTS PER BANK
      ====================================
    */

    console.log(
      "PRODUCTS PER BANK"
    );
    console.log(
      "------------------------------------"
    );

    for (
      const bank of banks
    ) {
      const bankProducts =
        products.filter(
          (product) =>
            product.bankId?._id
              ?.toString() ===
            bank._id.toString()
        );

      const slugs =
        bankProducts
          .map(
            (product) =>
              product.loanTypeId
                ?.slug
          )
          .filter(Boolean)
          .sort();

      console.log(
        `${bank.name}: ${bankProducts.length} -> ${slugs.join(", ")}`
      );
    }

    console.log("");

    /*
      ====================================
      ORPHAN CHECK
      ====================================
    */

    const orphanedProducts =
      products.filter(
        (product) =>
          !product.bankId ||
          !product.loanTypeId
      );

    console.log(
      "ORPHANED PRODUCTS"
    );
    console.log(
      "------------------------------------"
    );

    if (
      orphanedProducts.length ===
      0
    ) {
      console.log(
        "None"
      );
    } else {
      orphanedProducts.forEach(
        (product) => {
          console.log(
            product._id.toString()
          );
        }
      );
    }

    console.log("");

    /*
      ====================================
      NUMERIC RATE CHECK
      ====================================
    */

    const missingNumericRates =
      products.filter(
        (product) =>
          product.interestRate
            ?.min === null ||
          product.interestRate
            ?.min === undefined
      );

    console.log(
      "MISSING NUMERIC MIN RATE"
    );
    console.log(
      "------------------------------------"
    );

    if (
      missingNumericRates.length ===
      0
    ) {
      console.log(
        "None"
      );
    } else {
      missingNumericRates.forEach(
        (product) => {
          console.log(
            `${product.bankId?.name} -> ${product.loanTypeId?.name} -> ${product.productName}`
          );

          console.log(
            `Display text: ${
              product.interestRate
                ?.displayText ||
              "NONE"
            }`
          );

          console.log("");
        }
      );
    }

    /*
      ====================================
      TEXT FIELD CHECK
      ====================================
    */

    const textFields = [
      "productName",
      "processingFee",
      "prepaymentRules",
      "eligibilityNotes",
      "sourceUrl",
    ];

    console.log(
      "MISSING TEXT FIELDS"
    );
    console.log(
      "------------------------------------"
    );

    let missingTextCount =
      0;

    for (
      const product of products
    ) {
      const missingFields =
        textFields.filter(
          (field) =>
            !product[field] ||
            String(
              product[field]
            ).trim() === ""
        );

      const noRateText =
        !product.interestRate
          ?.displayText;

      if (
        missingFields.length >
          0 ||
        noRateText
      ) {
        missingTextCount++;

        console.log(
          `${product.bankId?.name} -> ${product.loanTypeId?.name}`
        );

        if (
          missingFields.length >
          0
        ) {
          console.log(
            `Missing: ${missingFields.join(", ")}`
          );
        }

        if (noRateText) {
          console.log(
            "Missing: interestRate.displayText"
          );
        }

        console.log("");
      }
    }

    if (
      missingTextCount ===
      0
    ) {
      console.log(
        "None"
      );
    }

    console.log("");

    /*
      ====================================
      EXPECTED TOTAL CHECK
      ====================================
    */

    const expectedBanks =
      14;

    const expectedLoanTypes =
      4;

    const expectedProducts =
      expectedBanks *
      expectedLoanTypes;

    console.log(
      "FINAL STATUS"
    );
    console.log(
      "------------------------------------"
    );

    console.log(
      banks.length ===
        expectedBanks
        ? "✓ Bank count correct"
        : `✗ Expected ${expectedBanks} banks`
    );

    console.log(
      loanTypes.length ===
        expectedLoanTypes
        ? "✓ Loan type count correct"
        : `✗ Expected ${expectedLoanTypes} loan types`
    );

    console.log(
      products.length ===
        expectedProducts
        ? "✓ Loan product count correct"
        : `✗ Expected ${expectedProducts} products`
    );

    console.log(
      orphanedProducts.length ===
        0
        ? "✓ No orphaned products"
        : `✗ ${orphanedProducts.length} orphaned products`
    );

    console.log(
      "===================================="
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Audit failed:",
      error
    );

    process.exit(1);
  }
};

runAudit();