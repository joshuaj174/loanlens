import dotenv from "dotenv";
import mongoose from "mongoose";

import Bank from "../models/Bank.js";
import LoanType from "../models/LoanType.js";
import LoanProduct from "../models/LoanProduct.js";

dotenv.config();

const seedLoanProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected for loan-product seeding.");

    const homeLoan = await LoanType.findOne({
      slug: "home",
    });

    if (!homeLoan) {
      throw new Error(
        "Home Loan type was not found. Run the main seed first."
      );
    }

    const sbi = await Bank.findOne({
      name: "State Bank of India",
    });

    const hdfc = await Bank.findOne({
      name: "HDFC Bank",
    });

    const icici = await Bank.findOne({
      name: "ICICI Bank",
    });

    const axis = await Bank.findOne({
      name: "Axis Bank",
    });

    const kotak = await Bank.findOne({
      name: "Kotak Mahindra Bank",
    });

    const bob = await Bank.findOne({
      name: "Bank of Baroda",
    });

    const pnb = await Bank.findOne({
      name: "Punjab National Bank",
    });

    const canara = await Bank.findOne({
      name: "Canara Bank",
    });

    if (
      !sbi ||
      !hdfc ||
      !icici ||
      !axis ||
      !kotak ||
      !bob ||
      !pnb ||
      !canara
    ) {
      throw new Error(
        "One or more banks were not found in the banks collection."
      );
    }

    const homeLoanProducts = [
      {
        bankId: sbi._id,
        loanTypeId: homeLoan._id,

        productName: "SBI Home Loan",

        interestRate: {
          min: null,
          max: null,
          displayText:
            "Rate depends on borrower profile, credit score and applicable SBI home-loan pricing.",
        },

        processingFee:
          "Official SBI terms state processing fees vary by loan amount; see source for applicable slab.",

        tenureMonths: {
          min: null,
          max: null,
        },

        minLoanAmount: null,
        maxLoanAmount: null,

        minCreditScore: 550,

        minIncome: null,

        maxLTV: 90,

        minAge: null,
        maxAgeAtLoanEnd: null,

        prepaymentRules:
          "Floating-rate home-loan terms and applicable foreclosure/prepayment conditions are governed by SBI and RBI rules.",

        eligibilityNotes:
          "SBI states that home-loan pricing varies by credit score and borrower profile. CIBIL scores below 550 are not eligible under the cited pricing framework.",

        specialFeatures: [
          "Floating-rate home loan",
          "Multiple home-loan variants",
          "MaxGain overdraft variant available",
          "Balance transfer supported",
        ],

        applyUrl:
          "https://sbi.co.in/web/personal-banking/loans/home-loans",

        documentsUrl:
          "https://sbi.co.in/web/personal-banking/loans/home-loans",

        sourceUrl:
          "https://sbi.co.in/web/business/information/interest-rates",

        sourceType: "official-bank",

        lastVerified: new Date("2026-09-29"),
      },

      {
        bankId: hdfc._id,
        loanTypeId: homeLoan._id,

        productName: "HDFC Bank Home Loan",

        interestRate: {
          min: null,
          max: null,
          displayText:
            "Current applicable rate depends on borrower profile and bank pricing.",
        },

        processingFee:
          "For salaried/self-employed professionals: up to 0.50% of loan amount or ₹3,000, whichever is higher, plus applicable taxes and charges.",

        tenureMonths: {
          min: null,
          max: null,
        },

        minLoanAmount: null,
        maxLoanAmount: null,

        minCreditScore: null,

        minIncome: null,

        maxLTV: null,

        minAge: null,
        maxAgeAtLoanEnd: null,

        prepaymentRules:
          "Refer to HDFC Bank's current official home-loan terms for applicable prepayment and foreclosure conditions.",

        eligibilityNotes:
          "Final eligibility and pricing depend on applicant profile, income, property and credit assessment.",

        specialFeatures: [
          "Home purchase",
          "Home construction",
          "Home improvement",
          "Refinance options",
        ],

        applyUrl:
          "https://www.hdfcbank.com/personal/borrow/popular-loans/home-loan",

        documentsUrl:
          "https://www.hdfcbank.com/personal/borrow/popular-loans/home-loan",

        sourceUrl:
          "https://www.hdfcbank.com/personal/borrow/popular-loans/home-loan",

        sourceType: "official-bank",

        lastVerified: new Date("2026-09-29"),
      },

      {
        bankId: icici._id,
        loanTypeId: homeLoan._id,

        productName: "ICICI Bank Home Loan",

        interestRate: {
          min: 8.75,
          max: 9.8,
          displayText:
            "Approximately 8.75%–9.80% depending on loan slab, employment type, credit score and borrower profile, based on the cited official rate table.",
        },

        processingFee:
          "0.50% of the loan amount plus applicable taxes according to the official home-loan rate page; some official service-charge pages may list higher maximum charges for specific facilities.",

        tenureMonths: {
          min: null,
          max: null,
        },

        minLoanAmount: null,
        maxLoanAmount: null,

        minCreditScore: null,

        minIncome: null,

        maxLTV: null,

        minAge: null,
        maxAgeAtLoanEnd: null,

        prepaymentRules:
          "Nil prepayment charges are listed for adjustable-rate home loans on the cited official service-charges page.",

        eligibilityNotes:
          "Rates vary based on bureau score, customer profile, segment, loan amount and employment type.",

        specialFeatures: [
          "Floating-rate home loans",
          "Fixed-rate options",
          "Online application",
          "Balance transfer",
        ],

        applyUrl:
          "https://www.icicibank.com/personal-banking/loans/home-loan",

        documentsUrl:
          "https://www.icicibank.com/personal-banking/loans/home-loan",

        sourceUrl:
          "https://www.icicibank.com/personal-banking/loans/home-loan/home-loan-interest-rates",

        sourceType: "official-bank",

        lastVerified: new Date("2026-09-29"),
      },

      {
        bankId: axis._id,
        loanTypeId: homeLoan._id,

        productName: "Axis Bank Home Loan",

        interestRate: {
          min: 8.35,
          max: 9.35,
          displayText:
            "8.35%–9.35% depending on CIBIL score, borrower profile, loan variant and other risk factors.",
        },

        processingFee:
          "Up to 1% of loan amount plus GST, subject to a minimum ₹10,000. ₹5,000 plus GST may be collected upfront at application.",

        tenureMonths: {
          min: 12,
          max: 360,
        },

        minLoanAmount: 300000,
        maxLoanAmount: 50000000,

        minCreditScore: null,

        minIncome: null,

        maxLTV: null,

        minAge: null,
        maxAgeAtLoanEnd: null,

        prepaymentRules:
          "Axis Bank states no prepayment charges for floating-rate home loans.",

        eligibilityNotes:
          "Final rate and approval depend on customer profile, CIBIL score, loan variant and risk assessment.",

        specialFeatures: [
          "Up to 30-year tenure",
          "Home loan balance transfer",
          "Floating and fixed-rate options",
          "No prepayment charges on floating-rate home loans",
        ],

        applyUrl:
          "https://www.axisbank.com/retail/loans/home-loan",

        documentsUrl:
          "https://www.axisbank.com/retail/loans/home-loan",

        sourceUrl:
          "https://www.axisbank.com/retail/loans/home-loan",

        sourceType: "official-bank",

        lastVerified: new Date("2026-09-29"),
      },

      {
        bankId: kotak._id,
        loanTypeId: homeLoan._id,

        productName: "Kotak Mahindra Bank Home Loan",

        interestRate: {
          min: null,
          max: null,
          displayText:
            "Competitive floating home-loan rate; final pricing depends on borrower profile and bank assessment.",
        },

        processingFee:
          "Up to 2% of the loan amount plus applicable taxes. An upfront processing fee of ₹5,000 plus taxes may be collected at application.",

        tenureMonths: {
          min: null,
          max: 300,
        },

        minLoanAmount: null,
        maxLoanAmount: null,

        minCreditScore: null,

        minIncome: null,

        maxLTV: 90,

        minAge: null,
        maxAgeAtLoanEnd: null,

        prepaymentRules:
          "Prepayment / foreclosure is allowed without charges for the applicable Home Loan terms cited by Kotak.",

        eligibilityNotes:
          "Final eligibility depends on income, repayment capacity, credit profile, property details, and Kotak's internal assessment.",

        specialFeatures: [
          "Flexible tenure up to 25 years",
          "Home Loan Balance Transfer",
          "Top-Up Loan facility",
          "Prepayment supported",
          "Doorstep service",
        ],

        applyUrl:
          "https://homeloans.kotak.com/",

        documentsUrl:
          "https://homeloans.kotak.com/",

        sourceUrl:
          "https://homeloans.kotak.com/",

        sourceType: "official-bank",

        lastVerified: new Date("2026-09-29"),
      },

      {
        bankId: bob._id,
        loanTypeId: homeLoan._id,

        productName: "Bank of Baroda Home Loan",

        interestRate: {
          min: 7.2,
          max: null,
          displayText:
            "Starting from 7.20% p.a.; final rate depends on loan amount, CIBIL score, applicant profile and applicable BRLLR spread.",
        },

        processingFee:
          "For Home Loan variants: up to ₹50 lakh, 0.50% with minimum ₹8,500 and maximum ₹15,000; above ₹50 lakh, 0.25% with minimum ₹8,500 and maximum ₹25,000, excluding GST.",

        tenureMonths: {
          min: 12,
          max: 360,
        },

        minLoanAmount: null,
        maxLoanAmount: 200000000,

        minCreditScore: null,

        minIncome: null,

        maxLTV: 90,

        minAge: 21,
        maxAgeAtLoanEnd: 70,

        prepaymentRules:
          "Bank of Baroda states that there is no prepayment penalty on its Home Loan.",

        eligibilityNotes:
          "Loan eligibility depends on age, income, existing obligations, repayment capacity, property cost and applicant profile.",

        specialFeatures: [
          "Tenure up to 30 years",
          "Home Loan Takeover",
          "Pre-approved Home Loan",
          "Max Savings Home Loan",
          "No prepayment penalty",
          "Loan amount up to ₹20 crore in Mumbai",
        ],

        applyUrl:
          "https://bankofbaroda.bank.in/loans/home-loan/baroda-home-loan",

        documentsUrl:
          "https://bankofbaroda.bank.in/loans/home-loan/baroda-home-loan",

        sourceUrl:
          "https://bankofbaroda.bank.in/loans/home-loan/baroda-home-loan",

        sourceType: "official-bank",

        lastVerified: new Date("2026-09-29"),
      },

      {
        bankId: pnb._id,
        loanTypeId: homeLoan._id,

        productName: "PNB Housing Loan",

        interestRate: {
          min: 7.5,
          max: 9.2,
          displayText:
            "Floating rates vary by CIBIL score, LTV and loan amount. Published standard slabs range roughly from 7.50% to 9.20% under the cited PNB rate framework.",
        },

        processingFee:
          "0.35% of the loan amount, minimum ₹2,500 and maximum ₹15,000 plus applicable taxes. Documentation charges may apply.",

        tenureMonths: {
          min: null,
          max: 360,
        },

        minLoanAmount: null,
        maxLoanAmount: null,

        minCreditScore: null,

        minIncome: null,

        maxLTV: 90,

        minAge: null,
        maxAgeAtLoanEnd: 70,

        prepaymentRules:
          "No prepayment penalty is specified for floating-rate housing loans in PNB's published sanction terms.",

        eligibilityNotes:
          "PNB does not prescribe one universal minimum CIC score for all housing-loan applicants; better credit scores may receive more favourable pricing.",

        specialFeatures: [
          "Tenure up to 30 years",
          "CIBIL-linked pricing",
          "Home Loan Takeover cases supported",
          "Floating and fixed-rate options",
        ],

        applyUrl:
          "https://www.pnbindia.in/housingloanforpublic.html",

        documentsUrl:
          "https://www.pnbindia.in/housingloanforpublic.html",

        sourceUrl:
          "https://www.pnbindia.in/interst-rate-on-advances-linked-to-mclr.html",

        sourceType: "official-bank",

        lastVerified: new Date("2026-09-29"),
      },

      {
        bankId: canara._id,
        loanTypeId: homeLoan._id,

        productName: "Canara Bank Housing Loan",

        interestRate: {
          min: null,
          max: null,
          displayText:
            "Canara Bank housing-loan pricing is linked to its applicable lending benchmark and borrower risk profile.",
        },

        processingFee:
          "0.50% of loan amount, minimum ₹1,500 and maximum ₹10,000 plus applicable GST for the standard Housing Loan scheme.",

        tenureMonths: {
          min: null,
          max: null,
        },

        minLoanAmount: null,
        maxLoanAmount: null,

        minCreditScore: null,

        minIncome: null,

        maxLTV: null,

        minAge: null,
        maxAgeAtLoanEnd: null,

        prepaymentRules:
          "Applicable prepayment conditions depend on the loan structure and prevailing Canara Bank/RBI terms.",

        eligibilityNotes:
          "Final sanction and pricing depend on borrower profile, repayment capacity, collateral/property and the applicable scheme.",

        specialFeatures: [
          "Housing Loan",
          "Home Improvement Loan",
          "NRI Housing Loan",
          "Canara Home Loan Plus",
          "Canara Home Loan Super Gain",
        ],

        applyUrl:
          "https://canarabank.com/",

        documentsUrl:
          "https://canarabank.com/",

        sourceUrl:
          "https://canarabank.com/",

        sourceType: "official-bank",

        lastVerified: new Date("2026-09-29"),
      },
    ];

    for (const product of homeLoanProducts) {
      await LoanProduct.findOneAndUpdate(
        {
          bankId: product.bankId,
          loanTypeId: product.loanTypeId,
        },
        product,
        {
          upsert: true,
          new: true,
          runValidators: true,
        }
      );
    }

    console.log(
      `${homeLoanProducts.length} Home Loan products inserted/updated.`
    );

    console.log(
      "LoanLens Home Loan product seed completed successfully."
    );

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("Loan-product seed failed:");
    console.error(error.message);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedLoanProducts();