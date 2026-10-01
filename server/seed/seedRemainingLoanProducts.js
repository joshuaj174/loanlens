import dotenv from "dotenv";
import mongoose from "mongoose";

import Bank from "../models/Bank.js";
import LoanType from "../models/LoanType.js";
import LoanProduct from "../models/LoanProduct.js";

dotenv.config();

const seedRemainingLoanProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected for remaining loan-product seeding.");

    // --------------------------------------------------
    // FETCH LOAN TYPES
    // --------------------------------------------------

    const personalLoan = await LoanType.findOne({
      slug: "personal",
    });

    const carLoan = await LoanType.findOne({
      slug: "car",
    });

    const educationLoan = await LoanType.findOne({
      slug: "education",
    });

    if (!personalLoan || !carLoan || !educationLoan) {
      throw new Error(
        "One or more loan types were not found. Run the main seed first."
      );
    }

    // --------------------------------------------------
    // FETCH BANKS
    // --------------------------------------------------

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

    // ==================================================
    // PERSONAL LOANS
    // ==================================================

    const personalLoanProducts = [
      {
        bankId: sbi._id,
        loanTypeId: personalLoan._id,

        productName: "SBI Xpress Credit Personal Loan",

        interestRate: {
          min: 11.0,
          max: 13.5,
          displayText:
            "Published SBI Xpress Credit rates generally range from about 11.00% to 13.50% depending on employer category and borrower profile.",
        },

        processingFee:
          "Applicable processing charges depend on the SBI personal-loan scheme and borrower category.",

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
          "Prepayment and foreclosure terms depend on the selected SBI personal-loan scheme.",

        eligibilityNotes:
          "Eligibility varies by employer category, salary relationship, repayment capacity and credit profile.",

        specialFeatures: [
          "Unsecured personal loan",
          "Xpress Credit scheme",
          "Preferential variants for eligible salary-account customers",
        ],

        applyUrl:
          "https://sbi.co.in/web/personal-banking/loans/personal-loans",

        documentsUrl:
          "https://sbi.co.in/web/personal-banking/loans/personal-loans",

        sourceUrl:
          "https://sbi.co.in/web/business/information/interest-rates",

        sourceType: "official-bank",

        lastVerified: new Date("2026-09-29"),
      },

      {
        bankId: hdfc._id,
        loanTypeId: personalLoan._id,

        productName: "HDFC Bank Personal Loan",

        interestRate: {
          min: 10.9,
          max: 24.0,
          displayText:
            "HDFC Bank publishes salaried Personal Loan rack rates from about 10.90% to 24% p.a.",
        },

        processingFee:
          "Up to ₹6,500 plus GST according to HDFC Bank's published Personal Loan charges.",

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
          "Foreclosure and prepayment charges depend on the loan agreement and repayment stage.",

        eligibilityNotes:
          "Final pricing and eligibility depend on income, employer, repayment history, credit profile and existing obligations.",

        specialFeatures: [
          "Unsecured loan",
          "Digital application",
          "Fast disbursal for eligible customers",
        ],

        applyUrl:
          "https://www.hdfcbank.com/personal/borrow/popular-loans/personal-loan",

        documentsUrl:
          "https://www.hdfcbank.com/personal/borrow/popular-loans/personal-loan",

        sourceUrl:
          "https://www.hdfcbank.com/personal/borrow/popular-loans/personal-loan/interest-rates-and-charges",

        sourceType: "official-bank",

        lastVerified: new Date("2026-09-29"),
      },

      {
        bankId: icici._id,
        loanTypeId: personalLoan._id,

        productName: "ICICI Bank Personal Loan",

        interestRate: {
          min: 10.6,
          max: 16.5,
          displayText:
            "ICICI Bank publishes Personal Loan rates from about 10.60% to 16.50% p.a.",
        },

        processingFee:
          "Up to 2% of the loan amount plus applicable taxes.",

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
          "Applicable foreclosure and part-payment conditions depend on the loan terms.",

        eligibilityNotes:
          "Pricing depends on applicant creditworthiness, income, employer profile and internal assessment.",

        specialFeatures: [
          "Unsecured loan",
          "Online application",
          "Instant offers for eligible customers",
        ],

        applyUrl:
          "https://www.icicibank.com/personal-banking/loans/personal-loan",

        documentsUrl:
          "https://www.icicibank.com/personal-banking/loans/personal-loan",

        sourceUrl:
          "https://www.icicibank.com/personal-banking/loans/personal-loan/personal-loan-interest-rates.html",

        sourceType: "official-bank",

        lastVerified: new Date("2026-09-29"),
      },

      {
        bankId: axis._id,
        loanTypeId: personalLoan._id,

        productName: "Axis Bank Personal Loan",

        interestRate: {
          min: 9.99,
          max: 22.0,
          displayText:
            "Axis Bank publishes Personal Loan rates starting from 9.99% and up to around 22% p.a.",
        },

        processingFee:
          "Up to 2% of the loan amount plus GST.",

        tenureMonths: {
          min: 12,
          max: 84,
        },

        minLoanAmount: 50000,
        maxLoanAmount: 4000000,

        minCreditScore: null,
        minIncome: null,
        maxLTV: null,

        minAge: 21,
        maxAgeAtLoanEnd: 60,

        prepaymentRules:
          "Prepayment and foreclosure conditions depend on the applicable loan agreement.",

        eligibilityNotes:
          "Loan amount and rate depend on income, credit profile, age and repayment capacity.",

        specialFeatures: [
          "Loan amount up to ₹40 lakh",
          "Tenure up to 84 months",
          "Unsecured loan",
        ],

        applyUrl:
          "https://www.axisbank.com/retail/loans/personal-loan",

        documentsUrl:
          "https://www.axisbank.com/retail/loans/personal-loan",

        sourceUrl:
          "https://www.axisbank.com/retail/loans/personal-loan",

        sourceType: "official-bank",

        lastVerified: new Date("2026-09-29"),
      },

      {
        bankId: kotak._id,
        loanTypeId: personalLoan._id,

        productName: "Kotak Mahindra Bank Personal Loan",

        interestRate: {
          min: 10.99,
          max: null,
          displayText:
            "Kotak Mahindra Bank Personal Loan interest rates start from 10.99% p.a.",
        },

        processingFee:
          "Up to 5% of the final loan amount plus applicable taxes.",

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
          "Foreclosure charges may apply depending on how long the loan has been active.",

        eligibilityNotes:
          "Final approval depends on applicant income, employer profile, repayment capacity and credit history.",

        specialFeatures: [
          "Unsecured Personal Loan",
          "Personal Loan Balance Transfer",
          "Digital application",
        ],

        applyUrl:
          "https://www.kotak.com/en/personal-banking/loans/personal-loan.html",

        documentsUrl:
          "https://www.kotak.com/en/personal-banking/loans/personal-loan.html",

        sourceUrl:
          "https://www.kotak.com/en/personal-banking/loans/personal-loan.html",

        sourceType: "official-bank",

        lastVerified: new Date("2026-09-29"),
      },

      {
        bankId: bob._id,
        loanTypeId: personalLoan._id,

        productName: "Baroda Personal Loan",

        interestRate: {
          min: 10.15,
          max: 17.5,
          displayText:
            "Bank of Baroda publishes Personal Loan rates broadly ranging from about 10.15% to 17.50%, depending on employment category, CIBIL score and banking relationship.",
        },

        processingFee:
          "Typically 1% to 2% of the loan amount plus GST, subject to applicable minimum and maximum charges.",

        tenureMonths: {
          min: 48,
          max: 84,
        },

        minLoanAmount: 50000,
        maxLoanAmount: 2000000,

        minCreditScore: null,
        minIncome: null,
        maxLTV: null,

        minAge: null,
        maxAgeAtLoanEnd: 65,

        prepaymentRules:
          "Applicable prepayment conditions depend on the borrower category and loan terms.",

        eligibilityNotes:
          "FOIR and eligible tenure vary by employment category, salary relationship and borrower profile.",

        specialFeatures: [
          "Different pricing for salary-account relationships",
          "FOIR-based repayment assessment",
          "Government employee variants",
        ],

        applyUrl:
          "https://bankofbaroda.bank.in/loans/personal-loan/baroda-personal-loan",

        documentsUrl:
          "https://bankofbaroda.bank.in/loans/personal-loan/baroda-personal-loan",

        sourceUrl:
          "https://bankofbaroda.bank.in/loans/personal-loan/baroda-personal-loan",

        sourceType: "official-bank",

        lastVerified: new Date("2026-09-29"),
      },

      {
        bankId: pnb._id,
        loanTypeId: personalLoan._id,

        productName: "PNB Personal Loan",

        interestRate: {
          min: 9.4,
          max: 17.05,
          displayText:
            "PNB has published Personal Loan interest-rate ranges broadly between about 9.40% and 17.05%, depending on the scheme and borrower profile.",
        },

        processingFee:
          "Approximately 1% of the loan amount plus applicable taxes for standard Personal Loan schemes, subject to current scheme terms.",

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
          "Prepayment and foreclosure rules depend on the specific PNB Personal Loan scheme.",

        eligibilityNotes:
          "Eligibility depends on income, occupation, salary account relationship, CIC score and repayment capacity.",

        specialFeatures: [
          "Salary-linked Personal Loan schemes",
          "Pensioner loan variants",
          "Government employee options",
        ],

        applyUrl:
          "https://www.pnbindia.in/personal.html",

        documentsUrl:
          "https://www.pnbindia.in/personal.html",

        sourceUrl:
          "https://www.pnbindia.in/display-of-rbi-norms.html",

        sourceType: "official-bank",

        lastVerified: new Date("2026-09-29"),
      },

      {
        bankId: canara._id,
        loanTypeId: personalLoan._id,

        productName: "Canara Budget Personal Loan",

        interestRate: {
          min: 9.7,
          max: 14.7,
          displayText:
            "Canara Bank publishes Canara Budget rates broadly from about 9.70% to 14.70%, depending on salary tie-up and credit risk grade.",
        },

        processingFee:
          "0.50% of the loan amount, minimum ₹1,000 and maximum ₹5,000, subject to applicable campaign waivers.",

        tenureMonths: {
          min: null,
          max: 84,
        },

        minLoanAmount: null,
        maxLoanAmount: 5000000,

        minCreditScore: null,
        minIncome: null,
        maxLTV: null,

        minAge: null,
        maxAgeAtLoanEnd: null,

        prepaymentRules:
          "Canara Budget lists no prepayment penalty under the cited scheme information.",

        eligibilityNotes:
          "The product primarily targets eligible salaried employees and requires minimum net take-home criteria.",

        specialFeatures: [
          "Up to 84-month tenure",
          "Salary-linked variants",
          "Reducing balance interest",
          "No prepayment penalty",
        ],

        applyUrl:
          "https://www.canarabank.bank.in/canara-budget",

        documentsUrl:
          "https://www.canarabank.bank.in/canara-budget",

        sourceUrl:
          "https://www.canarabank.bank.in/canara-budget",

        sourceType: "official-bank",

        lastVerified: new Date("2026-09-29"),
      },
    ];

    // ==================================================
    // CAR LOANS
    // ==================================================

    const carLoanProducts = [
      {
        bankId: sbi._id,
        loanTypeId: carLoan._id,

        productName: "SBI Car Loan",

        interestRate: {
          min: 8.95,
          max: 9.9,
          displayText:
            "SBI published new-car rates around 8.95% to 9.90% depending on CIC score and tenure.",
        },

        processingFee:
          "Applicable processing fee varies by SBI Auto Loan scheme and current promotional terms.",

        tenureMonths: {
          min: null,
          max: 84,
        },

        minLoanAmount: null,
        maxLoanAmount: null,

        minCreditScore: null,
        minIncome: null,

        maxLTV: null,

        minAge: null,
        maxAgeAtLoanEnd: null,

        prepaymentRules:
          "Applicable foreclosure and prepayment rules depend on SBI Auto Loan terms.",

        eligibilityNotes:
          "Pricing depends heavily on CIC score, tenure and selected vehicle-loan variant.",

        specialFeatures: [
          "New Car Loan",
          "Green Car Loan",
          "NRI Car Loan",
          "Certified Pre-Owned Car Loan",
        ],

        applyUrl:
          "https://sbi.co.in/web/personal-banking/loans/auto-loans",

        documentsUrl:
          "https://sbi.co.in/web/personal-banking/loans/auto-loans",

        sourceUrl:
          "https://sbi.co.in/web/interest-rates/interest-rates/loan-schemes-interest-rates/auto-loans",

        sourceType: "official-bank",

        lastVerified: new Date("2026-09-29"),
      },

      {
        bankId: hdfc._id,
        loanTypeId: carLoan._id,

        productName: "HDFC Bank Car Loan",

        interestRate: {
          min: 8.8,
          max: null,
          displayText:
            "HDFC Bank promotes new Car Loans starting around 8.80% p.a.; final pricing depends on profile and vehicle.",
        },

        processingFee:
          "Up to 1% of the loan amount, subject to published minimum and maximum charges.",

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
          "Premature closure charges reduce depending on the number of months completed after the first EMI.",

        eligibilityNotes:
          "Eligibility depends on income, vehicle, repayment history and applicant credit profile.",

        specialFeatures: [
          "New Car Loan",
          "Pre-Owned Car Loan",
          "Online application",
        ],

        applyUrl:
          "https://www.hdfcbank.com/personal/borrow/popular-loans/new-car-loan",

        documentsUrl:
          "https://www.hdfcbank.com/personal/borrow/popular-loans/new-car-loan",

        sourceUrl:
          "https://v.hdfcbank.com/amp/car-loan/rates-fees.html",

        sourceType: "official-bank",

        lastVerified: new Date("2026-09-29"),
      },

      {
        bankId: icici._id,
        loanTypeId: carLoan._id,

        productName: "ICICI Bank Car Loan",

        interestRate: {
          min: 9.1,
          max: null,
          displayText:
            "ICICI Bank publishes new Car Loans starting from around 9.10% p.a. for longer tenures, depending on CIBIL score and car model.",
        },

        processingFee:
          "Processing charges depend on the loan variant and applicable ICICI Bank service-charge schedule.",

        tenureMonths: {
          min: 12,
          max: 84,
        },

        minLoanAmount: null,
        maxLoanAmount: null,

        minCreditScore: null,

        minIncome: 30000,

        maxLTV: 100,

        minAge: 20,
        maxAgeAtLoanEnd: 65,

        prepaymentRules:
          "Applicable foreclosure and part-payment rules depend on ICICI Bank Car Loan terms.",

        eligibilityNotes:
          "Salaried applicants generally require minimum monthly income around ₹30,000; other requirements depend on profile.",

        specialFeatures: [
          "Up to 100% on-road funding",
          "New Car Loan",
          "Used Car Loan",
          "Tenure up to 84 months",
        ],

        applyUrl:
          "https://www.icicibank.com/personal-banking/loans/car-loan",

        documentsUrl:
          "https://www.icicibank.com/personal-banking/loans/car-loan",

        sourceUrl:
          "https://www.icicibank.com/personal-banking/loans/car-loan",

        sourceType: "official-bank",

        lastVerified: new Date("2026-09-29"),
      },

      {
        bankId: axis._id,
        loanTypeId: carLoan._id,

        productName: "Axis Bank New Car Loan",

        interestRate: {
          min: 8.9,
          max: 11.55,
          displayText:
            "Axis Bank publishes effective new Car Loan rates around 8.90% to 11.55% p.a. under the cited rate table.",
        },

        processingFee:
          "₹3,500 to ₹12,000 depending on the loan, plus applicable documentation charges.",

        tenureMonths: {
          min: null,
          max: null,
        },

        minLoanAmount: null,
        maxLoanAmount: null,

        minCreditScore: null,
        minIncome: null,

        maxLTV: 85,

        minAge: null,
        maxAgeAtLoanEnd: null,

        prepaymentRules:
          "Part-payment and foreclosure are allowed subject to applicable charges.",

        eligibilityNotes:
          "Rate depends on loan amount, vehicle type, credit history and borrower profile.",

        specialFeatures: [
          "New Car Loan",
          "Used Car Loan",
          "Fixed-rate finance",
          "Online application",
        ],

        applyUrl:
          "https://www.axisbank.com/retail/loans/car-loan/new-car-loan",

        documentsUrl:
          "https://www.axisbank.com/retail/loans/car-loan/new-car-loan",

        sourceUrl:
          "https://www.axisbank.com/retail/loans/car-loan/new-car-loan/interest-rates-charges",

        sourceType: "official-bank",

        lastVerified: new Date("2026-09-29"),
      },

      {
        bankId: kotak._id,
        loanTypeId: carLoan._id,

        productName: "Kotak Mahindra Prime New Car Finance",

        interestRate: {
          min: null,
          max: null,
          displayText:
            "Interest rate is determined by Kotak Mahindra Prime based on applicant and vehicle profile.",
        },

        processingFee:
          "Processing charge can be up to 3% of the loan amount, with additional documentation charges under the published 2026 schedule.",

        tenureMonths: {
          min: 12,
          max: 84,
        },

        minLoanAmount: 75000,
        maxLoanAmount: null,

        minCreditScore: null,

        minIncome: 15000,

        maxLTV: 100,

        minAge: 21,
        maxAgeAtLoanEnd: 60,

        prepaymentRules:
          "Full prepayment is permitted subject to the applicable Kotak Mahindra Prime prepayment charges.",

        eligibilityNotes:
          "The Car Loan is offered through Kotak Mahindra Prime Limited, a subsidiary of Kotak Mahindra Bank.",

        specialFeatures: [
          "Up to 100% invoice funding for eligible models",
          "Tenure up to 84 months",
          "Step-up repayment options",
          "Balloon EMI option",
        ],

        applyUrl:
          "https://www.primeloans.kotak.com/newCarFinance.htm",

        documentsUrl:
          "https://www.primeloans.kotak.com/newCarFinance.htm",

        sourceUrl:
          "https://www.primeloans.kotak.com/newCarFinance.htm",

        sourceType: "official-bank",

        lastVerified: new Date("2026-09-29"),
      },

      {
        bankId: bob._id,
        loanTypeId: carLoan._id,

        productName: "Bank of Baroda Digital Car Loan",

        interestRate: {
          min: 7.6,
          max: 9.35,
          displayText:
            "Published Bank of Baroda Digital Car Loan rates range from around 7.60%–8.75% floating and 8.50%–9.35% fixed.",
        },

        processingFee:
          "₹1,500 plus GST for loans up to ₹10 lakh and ₹2,000 plus GST for loans above ₹10 lakh under the cited Digital Car Loan scheme.",

        tenureMonths: {
          min: 12,
          max: 84,
        },

        minLoanAmount: null,
        maxLoanAmount: 50000000,

        minCreditScore: null,
        minIncome: null,

        maxLTV: 93,

        minAge: null,
        maxAgeAtLoanEnd: null,

        prepaymentRules:
          "No prepayment charges are stated for the floating-rate Digital Car Loan.",

        eligibilityNotes:
          "Interest rate depends on CIBIL score, income and applicant profile.",

        specialFeatures: [
          "Up to 93% financing",
          "Digital application",
          "Fixed and floating rate options",
          "Loan amount up to ₹5 crore under the broader Car Loan offering",
        ],

        applyUrl:
          "https://bankofbaroda.bank.in/loans/vehicle-loan/baroda-digital-car-loan",

        documentsUrl:
          "https://bankofbaroda.bank.in/loans/vehicle-loan/baroda-digital-car-loan",

        sourceUrl:
          "https://bankofbaroda.bank.in/loans/vehicle-loan/baroda-digital-car-loan",

        sourceType: "official-bank",

        lastVerified: new Date("2026-09-29"),
      },

      {
        bankId: pnb._id,
        loanTypeId: carLoan._id,

        productName: "PNB Car Loan",

        interestRate: {
          min: 7.85,
          max: 9.7,
          displayText:
            "PNB publishes CIC-linked Car Loan slabs starting around 7.85% for eligible profiles, with higher rates for lower CIC bands.",
        },

        processingFee:
          "Processing and documentation charges depend on the applicable PNB vehicle-loan scheme.",

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
          "Applicable foreclosure and prepayment rules depend on the selected PNB Car Loan scheme.",

        eligibilityNotes:
          "Pricing varies by CIC score and borrower category; special concessions may apply to eligible groups.",

        specialFeatures: [
          "New Car Loan",
          "E-Vehicle concession",
          "CIC-linked pricing",
          "PNB Pride variants",
        ],

        applyUrl:
          "https://www.pnbindia.in/vehicleloan.html",

        documentsUrl:
          "https://www.pnbindia.in/vehicleloan.html",

        sourceUrl:
          "https://www.pnbindia.in/interst-rate-on-advances-linked-to-mclr.html",

        sourceType: "official-bank",

        lastVerified: new Date("2026-09-29"),
      },

      {
        bankId: canara._id,
        loanTypeId: carLoan._id,

        productName: "Canara Vehicle Loan",

        interestRate: {
          min: 7.45,
          max: 15.0,
          displayText:
            "Canara Bank's published contracted retail Vehicle Loan range is approximately 7.45% to 15.00%, depending on borrower and product profile.",
        },

        processingFee:
          "Processing charges depend on the Canara Vehicle scheme and loan amount.",

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
          "Applicable terms depend on the Canara Vehicle loan structure.",

        eligibilityNotes:
          "Final rate and sanction depend on credit risk grade, income, vehicle cost and repayment capacity.",

        specialFeatures: [
          "Four-wheeler financing",
          "Retail vehicle lending",
          "Risk-based pricing",
        ],

        applyUrl:
          "https://www.canarabank.bank.in/",

        documentsUrl:
          "https://www.canarabank.bank.in/",

        sourceUrl:
          "https://www.canarabank.bank.in/pages/interest-rate-range-on-loans",

        sourceType: "official-bank",

        lastVerified: new Date("2026-09-29"),
      },
    ];

    // ==================================================
    // EDUCATION LOANS
    // ==================================================

    const educationLoanProducts = [
      {
        bankId: sbi._id,
        loanTypeId: educationLoan._id,

        productName: "SBI Student Loan",

        interestRate: {
          min: 7.15,
          max: 10.15,
          displayText:
            "SBI education-loan rates vary by scheme, institution and security, with published schemes ranging from about 7.15% to 10.15%.",
        },

        processingFee:
          "SBI Student Loan processing charge is NIL up to ₹20 lakh; above ₹20 lakh, ₹10,000 plus applicable taxes under the cited terms.",

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
          "Education Loan repayment and takeover conditions vary by SBI scheme.",

        eligibilityNotes:
          "Available for eligible Indian students pursuing recognised higher education in India or abroad after securing admission.",

        specialFeatures: [
          "Student Loan",
          "Scholar Loan",
          "Global Ed-Vantage",
          "PM-Vidyalaxmi",
          "Education Loan takeover for eligible cases",
        ],

        applyUrl:
          "https://sbi.co.in/web/personal-banking/loans/education-loans",

        documentsUrl:
          "https://sbi.co.in/web/personal-banking/loans/education-loans/student-loan-scheme",

        sourceUrl:
          "https://sbi.co.in/web/interest-rates/interest-rates/loan-schemes-interest-rates/education-loan-scheme",

        sourceType: "official-bank",

        lastVerified: new Date("2026-09-29"),
      },

      {
        bankId: hdfc._id,
        loanTypeId: educationLoan._id,

        productName: "HDFC Bank Education Loan",

        interestRate: {
          min: null,
          max: null,
          displayText:
            "Applicable Education Loan rate is determined by HDFC Bank based on applicant, course, institution and loan profile.",
        },

        processingFee:
          "Processing fee is determined according to the applicable HDFC Bank Education Loan offer.",

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
          "Repayment and prepayment conditions depend on the sanctioned loan terms.",

        eligibilityNotes:
          "Final approval depends on student, co-applicant, institution, course, income and credit assessment.",

        specialFeatures: [
          "Education Loan application",
          "Domestic and overseas education assessment",
          "Co-applicant based underwriting",
        ],

        applyUrl:
          "https://www.hdfcbank.com/",

        documentsUrl:
          "https://www.hdfcbank.com/",

        sourceUrl:
          "https://www.hdfcbank.com/",

        sourceType: "official-bank",

        lastVerified: new Date("2026-09-29"),
      },

      {
        bankId: icici._id,
        loanTypeId: educationLoan._id,

        productName: "ICICI Bank Education Loan",

        interestRate: {
          min: null,
          max: null,
          displayText:
            "Applicable rate depends on institution, course, loan amount, collateral and borrower profile.",
        },

        processingFee:
          "Starts at 0.50% plus GST or ₹30,000 plus GST, whichever is lower, according to the cited official Education Loan page.",

        tenureMonths: {
          min: null,
          max: 180,
        },

        minLoanAmount: null,
        maxLoanAmount: 30000000,

        minCreditScore: null,
        minIncome: null,
        maxLTV: null,

        minAge: null,
        maxAgeAtLoanEnd: null,

        prepaymentRules:
          "Prepayment conditions depend on the sanctioned ICICI Bank Education Loan terms.",

        eligibilityNotes:
          "Loan amount depends on eligibility, institution and course. Collateral-free lending may be available for eligible cases.",

        specialFeatures: [
          "Loan amount up to ₹3 crore",
          "Collateral-free loan up to ₹1 crore for eligible profiles",
          "Tenure up to 15 years",
          "Pre-admission sanction",
        ],

        applyUrl:
          "https://www.icicibank.com/personal-banking/loans/education-loan",

        documentsUrl:
          "https://www.icicibank.com/personal-banking/loans/education-loan",

        sourceUrl:
          "https://www.icicibank.com/nri-banking/loans/educational-loan",

        sourceType: "official-bank",

        lastVerified: new Date("2026-09-29"),
      },

      {
        bankId: axis._id,
        loanTypeId: educationLoan._id,

        productName: "Axis Bank Education Loan",

        interestRate: {
          min: null,
          max: null,
          displayText:
            "Education Loan rate depends on loan amount, institution, course, collateral and borrower profile.",
        },

        processingFee:
          "Up to 2% of the loan amount plus GST, or as decided by the bank, according to the current Education Loan application terms.",

        tenureMonths: {
          min: null,
          max: 180,
        },

        minLoanAmount: null,
        maxLoanAmount: null,

        minCreditScore: null,
        minIncome: null,
        maxLTV: null,

        minAge: null,
        maxAgeAtLoanEnd: null,

        prepaymentRules:
          "The cited Axis Bank Education Loan application terms list NIL foreclosure charges.",

        eligibilityNotes:
          "Eligibility depends on student profile, co-applicant, institute, course and financial assessment.",

        specialFeatures: [
          "Study in India or abroad",
          "Tenure up to 15 years",
          "Unsecured funding for selected prime colleges",
        ],

        applyUrl:
          "https://www.axisbank.com/retail/loans/education-loan",

        documentsUrl:
          "https://www.axisbank.com/retail/loans/education-loan",

        sourceUrl:
          "https://www.axisbank.com/retail/loans/education-loan",

        sourceType: "official-bank",

        lastVerified: new Date("2026-09-29"),
      },

      {
        bankId: kotak._id,
        loanTypeId: educationLoan._id,

        productName: "Education Loan via Credila",

        interestRate: {
          min: null,
          max: null,
          displayText:
            "Education Loan pricing is determined by Credila based on student, institution, co-applicant and credit profile.",
        },

        processingFee:
          "Charges are determined by Credila under the applicable Education Loan terms.",

        tenureMonths: {
          min: null,
          max: null,
        },

        minLoanAmount: null,
        maxLoanAmount: 7500000,

        minCreditScore: null,
        minIncome: null,
        maxLTV: 100,

        minAge: null,
        maxAgeAtLoanEnd: null,

        prepaymentRules:
          "Repayment and prepayment conditions are governed by Credila's Education Loan terms.",

        eligibilityNotes:
          "Kotak's official site refers customers to Credila Financial Services for overseas Education Loans. This is not a direct Kotak Mahindra Bank Education Loan product.",

        specialFeatures: [
          "Overseas education finance via Credila",
          "Up to 100% eligible education-cost finance",
          "Unsecured funding up to ₹75 lakh for eligible cases",
        ],

        applyUrl:
          "https://www.kotak.com/en/personal-banking/loans/education-loan/features.html",

        documentsUrl:
          "https://www.kotak.com/en/personal-banking/loans/education-loan/features.html",

        sourceUrl:
          "https://www.kotak.com/en/personal-banking/loans/education-loan/features.html",

        sourceType: "official-bank",

        lastVerified: new Date("2026-09-29"),
      },

      {
        bankId: bob._id,
        loanTypeId: educationLoan._id,

        productName: "Bank of Baroda Education Loan",

        interestRate: {
          min: null,
          max: null,
          displayText:
            "Interest rate varies by Bank of Baroda Education Loan scheme, institution category, loan amount and security.",
        },

        processingFee:
          "Study in India: generally NIL. Study abroad: 1% of loan amount up to ₹10,000, refundable on first disbursement under the cited service-charge schedule.",

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
          "Repayment and foreclosure terms depend on the selected Bank of Baroda Education Loan scheme.",

        eligibilityNotes:
          "Different schemes apply for domestic, overseas and premier-institution education.",

        specialFeatures: [
          "Study in India loans",
          "Study abroad loans",
          "Premier institution schemes",
          "Government-supported education schemes",
        ],

        applyUrl:
          "https://bankofbaroda.bank.in/loans/education-loan",

        documentsUrl:
          "https://bankofbaroda.bank.in/loans/education-loan",

        sourceUrl:
          "https://bankofbaroda.bank.in/interest-rate-and-service-charges/service-charges",

        sourceType: "official-bank",

        lastVerified: new Date("2026-09-29"),
      },

      {
        bankId: pnb._id,
        loanTypeId: educationLoan._id,

        productName: "PNB Education Loan",

        interestRate: {
          min: 8.6,
          max: null,
          displayText:
            "PNB Education Loan rates vary significantly by scheme, institution and security. Certain published schemes start around 8.60% p.a.",
        },

        processingFee:
          "Studies in India generally have NIL processing fee; overseas education may have a refundable upfront fee according to the applicable scheme.",

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
          "Repayment and prepayment terms depend on the PNB Education Loan scheme selected.",

        eligibilityNotes:
          "PNB offers multiple Education Loan schemes for regular study, premier institutions, vocational education and other eligible categories.",

        specialFeatures: [
          "PNB Saraswati",
          "PNB Udaan",
          "PNB Pratibha",
          "PNB Kaushal",
        ],

        applyUrl:
          "https://www.pnbindia.in/education.html",

        documentsUrl:
          "https://www.pnbindia.in/education.html",

        sourceUrl:
          "https://www.pnbindia.in/interst-rate-on-advances-linked-to-mclr.html",

        sourceType: "official-bank",

        lastVerified: new Date("2026-09-29"),
      },

      {
        bankId: canara._id,
        loanTypeId: educationLoan._id,

        productName: "Canara Vidya Turant",

        interestRate: {
          min: 6.85,
          max: null,
          displayText:
            "Canara Vidya Turant currently advertises rates starting from 6.85% p.a. for eligible premier-institution students.",
        },

        processingFee:
          "NIL processing charges under Canara Vidya Turant; applicable portal charges may still apply.",

        tenureMonths: {
          min: null,
          max: 180,
        },

        minLoanAmount: null,
        maxLoanAmount: 5000000,

        minCreditScore: null,
        minIncome: null,

        maxLTV: 100,

        minAge: null,
        maxAgeAtLoanEnd: null,

        prepaymentRules:
          "No prepayment penalty under the cited Canara Vidya Turant scheme.",

        eligibilityNotes:
          "Designed for eligible students admitted to selected premier institutions. Loan limit depends on the institution category.",

        specialFeatures: [
          "Collateral-free for eligible institutions",
          "Loan up to ₹50 lakh depending on institution category",
          "Tenure up to 15 years",
          "No processing charge",
          "No prepayment penalty",
        ],

        applyUrl:
          "https://www.canarabank.bank.in/vidya-turant",

        documentsUrl:
          "https://www.canarabank.bank.in/vidya-turant",

        sourceUrl:
          "https://www.canarabank.bank.in/vidya-turant",

        sourceType: "official-bank",

        lastVerified: new Date("2026-09-29"),
      },
    ];

    // ==================================================
    // COMBINE ALL REMAINING PRODUCTS
    // ==================================================

    const allProducts = [
      ...personalLoanProducts,
      ...carLoanProducts,
      ...educationLoanProducts,
    ];

    // ==================================================
    // INSERT OR UPDATE WITHOUT DUPLICATES
    // ==================================================

    for (const product of allProducts) {
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
      `${personalLoanProducts.length} Personal Loan products inserted/updated.`
    );

    console.log(
      `${carLoanProducts.length} Car Loan products inserted/updated.`
    );

    console.log(
      `${educationLoanProducts.length} Education Loan products inserted/updated.`
    );

    console.log(
      `${allProducts.length} remaining LoanLens products inserted/updated successfully.`
    );

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error(
      "Remaining loan-product seed failed:"
    );

    console.error(error.message);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedRemainingLoanProducts();