import dotenv from "dotenv";

import connectDB from "../config/db.js";

import Bank from "../models/Bank.js";
import LoanType from "../models/LoanType.js";
import LoanProduct from "../models/LoanProduct.js";

dotenv.config();

const VERIFIED_DATE =
  new Date("2026-09-30");

/*
  ==========================================================
  LOANLENS - ADDITIONAL 6 BANKS x 4 LOAN TYPES
  ==========================================================

  Banks:
  1. Bank of India
  2. Union Bank of India
  3. IDBI Bank
  4. IndusInd Bank
  5. Yes Bank
  6. Federal Bank

  Loan Types:
  - home
  - personal
  - car
  - education

  IMPORTANT:
  Where an official bank source publishes only a
  "starting from" rate, max is intentionally omitted.

  LoanLens already handles this by showing:
  "Starting from X%"

  We do NOT invent a fake maximum rate.
*/

const products = [
  /*
    ========================================================
    BANK OF INDIA
    ========================================================
  */

  {
    bankName: "Bank of India",
    loanSlug: "home",

    productName:
      "BOI Star Home Loan",

    interestRate: {
      min: 7.35,
      displayText:
        "Starting from 7.35% p.a.; final rate depends on borrower profile and applicable scheme.",
    },

    processingFee:
      "Processing charges apply as per Bank of India retail loan schedule.",

    tenureMonths: {
      min: 12,
      max: 360,
    },

    minCreditScore: 675,

    prepaymentRules:
      "Floating-rate home loans to individual borrowers may be prepaid without foreclosure charges, subject to applicable bank terms.",

    eligibilityNotes:
      "Rate depends on CIBIL score, borrower category, employment profile and applicable concessions.",

    specialFeatures: [
      "Home purchase",
      "Construction",
      "Home loan takeover",
      "Smart Home Loan option",
      "Rate linked to borrower credit profile",
    ],

    applyUrl:
      "https://bankofindia.co.in/home-loan",

    documentsUrl:
      "https://bankofindia.co.in/home-loan",

    sourceUrl:
      "https://bankofindia.co.in/documents/20121/26765626/Floating-ROI-wef-04.08.2025.pdf/4d08af69-2160-e32d-0046-5663238f252e?t=1754201420151",

    sourceType:
      "official-bank",

    lastVerified:
      VERIFIED_DATE,
  },

  {
    bankName: "Bank of India",
    loanSlug: "personal",

    productName:
      "BOI Star Personal Loan",

    interestRate: {
      min: 11.1,
      max: 14.1,
      displayText:
        "Approximately 11.10% - 14.10% depending on scheme and security profile.",
    },

    processingFee:
      "1% of loan amount, subject to applicable minimum and maximum limits.",

    tenureMonths: {
      min: 12,
      max: 84,
    },

    prepaymentRules:
      "Prepayment conditions depend on the selected Star Personal Loan variant.",

    eligibilityNotes:
      "Rates vary for salaried borrowers, pensioners, secured borrowers and unsecured borrowers.",

    specialFeatures: [
      "Secured and unsecured variants",
      "Salaried borrower options",
      "Senior citizen concessions",
      "EMI repayment",
    ],

    applyUrl:
      "https://bankofindia.co.in/personal-loan",

    documentsUrl:
      "https://bankofindia.co.in/personal-loan",

    sourceUrl:
      "https://bankofindia.co.in/documents/20121/26765626/Floating-ROI-wef-04.08.2025.pdf/4d08af69-2160-e32d-0046-5663238f252e?t=1754201420151",

    sourceType:
      "official-bank",

    lastVerified:
      VERIFIED_DATE,
  },

  {
    bankName: "Bank of India",
    loanSlug: "car",

    productName:
      "BOI Star Vehicle Loan",

    interestRate: {
      min: 10.65,
      max: 12.65,
      displayText:
        "Published fixed-rate vehicle-loan slabs approximately 10.65% - 12.65%, depending on borrower and vehicle profile.",
    },

    processingFee:
      "New four-wheeler processing fee subject to Bank of India applicable limits.",

    tenureMonths: {
      min: 12,
      max: 84,
    },

    prepaymentRules:
      "Prepayment and foreclosure charges depend on rate type and borrower category.",

    eligibilityNotes:
      "Applicable rate varies by CIBIL score, employment profile and vehicle type.",

    specialFeatures: [
      "New four-wheelers",
      "Two-wheelers",
      "Used vehicles",
      "Electric vehicle concessions may apply",
    ],

    applyUrl:
      "https://bankofindia.co.in/vehicle-loan",

    documentsUrl:
      "https://bankofindia.co.in/vehicle-loan",

    sourceUrl:
      "https://bankofindia.co.in/documents/20121/26014890/Fixed-ROI-wef-01.07.2025.pdf/8a93549a-59dc-c820-846c-6c307b4b8c53?t=1751369698235",

    sourceType:
      "official-bank",

    lastVerified:
      VERIFIED_DATE,
  },

  {
    bankName: "Bank of India",
    loanSlug: "education",

    productName:
      "BOI Star Education Loan",

    interestRate: {
      min: 10.65,
      max: 12.35,
      displayText:
        "Published fixed-rate education-loan variants approximately 10.65% - 12.35%; concessions may apply.",
    },

    processingFee:
      "Nil for several domestic education schemes; study-abroad processing charges may apply.",

    tenureMonths: {
      min: 12,
      max: 180,
    },

    prepaymentRules:
      "Subject to the applicable education-loan scheme and sanction terms.",

    eligibilityNotes:
      "Rate depends on loan amount, institution category and education-loan scheme. Concessions may apply for eligible students.",

    specialFeatures: [
      "IBA education loan",
      "Vidyalaxmi scheme",
      "Professional course concessions",
      "Girl-student concessions may apply",
    ],

    applyUrl:
      "https://bankofindia.co.in/education-loan",

    documentsUrl:
      "https://bankofindia.co.in/education-loan",

    sourceUrl:
      "https://bankofindia.co.in/documents/20121/26014890/Fixed-ROI-wef-01.07.2025.pdf/8a93549a-59dc-c820-846c-6c307b4b8c53?t=1751369698235",

    sourceType:
      "official-bank",

    lastVerified:
      VERIFIED_DATE,
  },

  /*
    ========================================================
    UNION BANK OF INDIA
    ========================================================
  */

  {
    bankName:
      "Union Bank of India",

    loanSlug: "home",

    productName:
      "Union Home Loan",

    interestRate: {
      min: 8.6,
      displayText:
        "Starting from 8.60% p.a.; final rate depends on borrower profile and credit score.",
    },

    processingFee:
      "Processing charges depend on the applicable Union Home scheme and customer category.",

    tenureMonths: {
      min: 12,
      max: 360,
    },

    prepaymentRules:
      "Union Bank states no prepayment penalty on eligible Union Home loans.",

    eligibilityNotes:
      "Eligibility depends on income, repayment capacity, age, margin, employment continuity and credit history.",

    specialFeatures: [
      "Purchase",
      "Construction",
      "Home loan balance transfer",
      "Floating-rate option",
      "Long repayment tenure",
    ],

    applyUrl:
      "https://www.unionbankofindia.bank.in/en/details/home-loan",

    documentsUrl:
      "https://www.unionbankofindia.bank.in/en/Listing/home-loan",

    sourceUrl:
      "https://www.unionbankofindia.bank.in/en/details/home-loan-interest-rate",

    sourceType:
      "official-bank",

    lastVerified:
      VERIFIED_DATE,
  },

  {
    bankName:
      "Union Bank of India",

    loanSlug:
      "personal",

    productName:
      "Union Personal Loan",

    interestRate: {
      min: 8.75,
      displayText:
        "Starting from 8.75% p.a.; actual rate depends on applicant profile.",
    },

    processingFee:
      "Processing charges vary by personal-loan scheme and customer category.",

    tenureMonths: {
      min: 12,
      max: 84,
    },

    prepaymentRules:
      "Prepayment may be permitted subject to the applicable personal-loan scheme.",

    eligibilityNotes:
      "Rate and eligibility depend on income, employment, credit score, repayment history and loan amount.",

    specialFeatures: [
      "Salaried borrower schemes",
      "EMI repayment",
      "Credit-profile-based pricing",
    ],

    applyUrl:
      "https://www.unionbankofindia.bank.in/en/details/union-personal-salaried-individual-other-than-government-employee",

    documentsUrl:
      "https://www.unionbankofindia.bank.in/en/details/personal-loan-documents-required",

    sourceUrl:
      "https://www.unionbankofindia.bank.in/en/home",

    sourceType:
      "official-bank",

    lastVerified:
      VERIFIED_DATE,
  },

  {
    bankName:
      "Union Bank of India",

    loanSlug:
      "car",

    productName:
      "Union Miles Vehicle Loan",

    interestRate: {
      min: 7.5,
      displayText:
        "Starting from 7.50% p.a.; final vehicle-loan rate depends on CIC/CIBIL score and vehicle type.",
    },

    processingFee:
      "Processing charges apply according to vehicle category and current Union Bank schedule.",

    tenureMonths: {
      min: 12,
      max: 84,
    },

    minCreditScore: 700,

    minIncome: 20000,

    prepaymentRules:
      "Union Bank states eligible vehicle loans may be prepaid without prepayment penalty.",

    eligibilityNotes:
      "Union Bank currently states a minimum CIBIL score of 700 for further consideration of vehicle-loan applications.",

    specialFeatures: [
      "New four-wheelers",
      "New two-wheelers",
      "Used four-wheelers",
      "Up to 100% funding may be available depending on profile",
    ],

    applyUrl:
      "https://www.unionbankofindia.bank.in/en/details/union-vehicle",

    documentsUrl:
      "https://www.unionbankofindia.bank.in/en/details/vehicle-loan-documents-required",

    sourceUrl:
      "https://www.unionbankofindia.bank.in/en/home",

    sourceType:
      "official-bank",

    lastVerified:
      VERIFIED_DATE,
  },

  {
    bankName:
      "Union Bank of India",

    loanSlug:
      "education",

    productName:
      "Union Education Loan",

    interestRate: {
      min: 8,
      max: 15,
      displayText:
        "Union Bank's education-loan interest-rate information indicates rates generally vary around 8% - 15%, depending on borrower and scheme.",
    },

    processingFee:
      "Processing charges depend on education scheme, loan amount and study location.",

    tenureMonths: {
      min: 12,
      max: 180,
    },

    prepaymentRules:
      "Prepayment conditions depend on the applicable Union Education scheme.",

    eligibilityNotes:
      "Eligibility depends on institution, course, loan amount, co-applicant profile and security requirements.",

    specialFeatures: [
      "Study in India",
      "Study abroad",
      "NRI student options",
      "Moratorium available under applicable schemes",
    ],

    applyUrl:
      "https://www.unionbankofindia.bank.in/en/details/union-education-india-abroad-nri-student",

    documentsUrl:
      "https://www.unionbankofindia.bank.in/en/details/education-loan-documents-required",

    sourceUrl:
      "https://www.unionbankofindia.bank.in/en/details/educational-loan-interest-rate",

    sourceType:
      "official-bank",

    lastVerified:
      VERIFIED_DATE,
  },

  /*
    ========================================================
    IDBI BANK
    ========================================================
  */

  {
    bankName: "IDBI Bank",
    loanSlug: "home",

    productName:
      "IDBI Home Loan",

    interestRate: {
      min: 7.65,
      max: 11.75,
      displayText:
        "7.65% - 11.75% p.a. depending on borrower category and credit profile.",
    },

    processingFee:
      "As per IDBI Bank's applicable home-loan service-charge schedule.",

    tenureMonths: {
      min: 12,
      max: 360,
    },

    prepaymentRules:
      "Floating-rate individual home loans generally follow applicable regulatory and bank prepayment rules.",

    eligibilityNotes:
      "Published home-loan rates vary for salaried, professional and self-employed non-professional borrowers.",

    specialFeatures: [
      "Purchase",
      "Construction",
      "Extension",
      "Balance transfer",
      "Home Loan Ultra Saver option",
    ],

    applyUrl:
      "https://www.idbibank.in/home-loan.aspx",

    documentsUrl:
      "https://www.idbibank.in/home-loan.aspx",

    sourceUrl:
      "https://www.idbibank.in/interest-rates.aspx",

    sourceType:
      "official-bank",

    lastVerified:
      VERIFIED_DATE,
  },

  {
    bankName: "IDBI Bank",
    loanSlug: "personal",

    productName:
      "IDBI Personal Loan",

    interestRate: {
      min: 11,
      max: 15.5,
      displayText:
        "11.00% - 15.50% p.a.",
    },

    processingFee:
      "Applicable processing charges as per IDBI personal-loan terms.",

    tenureMonths: {
      min: 12,
      max: 60,
    },

    prepaymentRules:
      "Foreclosure or prepayment conditions depend on the sanction terms.",

    eligibilityNotes:
      "Final pricing depends on borrower creditworthiness and eligibility.",

    specialFeatures: [
      "Unsecured finance",
      "Fixed interest-rate range",
      "EMI repayment",
    ],

    applyUrl:
      "https://www.idbibank.in/personal-loan.aspx",

    documentsUrl:
      "https://www.idbibank.in/personal-loan.aspx",

    sourceUrl:
      "https://www.idbibank.in/interest-rates.aspx",

    sourceType:
      "official-bank",

    lastVerified:
      VERIFIED_DATE,
  },

  {
    bankName: "IDBI Bank",
    loanSlug: "car",

    productName:
      "IDBI Auto Loan",

    interestRate: {
      min: 8.3,
      max: 9.1,
      displayText:
        "New car loan: 8.30% - 9.10% p.a.",
    },

    processingFee:
      "Applicable processing charges as per IDBI Auto Loan schedule.",

    tenureMonths: {
      min: 12,
      max: 84,
    },

    prepaymentRules:
      "Prepayment conditions depend on the applicable auto-loan terms.",

    eligibilityNotes:
      "Rate depends on borrower profile, credit score and vehicle-finance assessment.",

    specialFeatures: [
      "New car finance",
      "Certified pre-owned vehicle option",
      "Credit-profile-based pricing",
    ],

    applyUrl:
      "https://www.idbibank.in/auto-loan.aspx",

    documentsUrl:
      "https://www.idbibank.in/auto-loan.aspx",

    sourceUrl:
      "https://www.idbibank.in/interest-rates.aspx",

    sourceType:
      "official-bank",

    lastVerified:
      VERIFIED_DATE,
  },

  {
    bankName: "IDBI Bank",
    loanSlug: "education",

    productName:
      "IDBI Education Loan",

    interestRate: {
      min: 7.65,
      max: 10.6,
      displayText:
        "Approximately 7.65% - 10.60% p.a. across published education-loan schemes.",
    },

    processingFee:
      "Processing charges vary by scheme and study location.",

    tenureMonths: {
      min: 12,
      max: 180,
    },

    prepaymentRules:
      "Subject to education-loan sanction terms.",

    eligibilityNotes:
      "Rate varies by loan amount, institution, domestic/overseas study and scheme.",

    specialFeatures: [
      "India study",
      "Overseas study",
      "Premier institution schemes",
      "PM Vidyalaxmi variants",
    ],

    applyUrl:
      "https://www.idbibank.in/education-loan.aspx",

    documentsUrl:
      "https://www.idbibank.in/education-loan.aspx",

    sourceUrl:
      "https://www.idbibank.in/interest-rates.aspx",

    sourceType:
      "official-bank",

    lastVerified:
      VERIFIED_DATE,
  },

  /*
    ========================================================
    INDUSIND BANK
    ========================================================
  */

  {
    bankName:
      "IndusInd Bank",

    loanSlug:
      "home",

    productName:
      "IndusInd Home Loan",

    interestRate: {
      min: 8.6,
      displayText:
        "Starting from 8.60% p.a.; actual rate depends on borrower profile.",
    },

    processingFee:
      "Applicable charges depend on the selected home-loan offering.",

    tenureMonths: {
      min: 12,
      max: 360,
    },

    minAge: 21,

    prepaymentRules:
      "Prepayment terms depend on rate structure and sanction conditions.",

    eligibilityNotes:
      "Eligibility depends on income, employment or business stability, age and property assessment.",

    specialFeatures: [
      "Purchase or construction",
      "Home renovation",
      "Balance transfer",
      "Tenure up to 30 years",
    ],

    applyUrl:
      "https://www.indusind.com/in/en/personal/loans/affordable-home-loans.html",

    documentsUrl:
      "https://www.indusind.com/in/en/personal/loans/affordable-home-loans.html",

    sourceUrl:
      "https://www.indusind.com/iblogs/manage-your-finance/make-your-dream-house-come-true-with-a-home-loan/",

    sourceType:
      "official-bank",

    lastVerified:
      VERIFIED_DATE,
  },

  {
    bankName:
      "IndusInd Bank",

    loanSlug:
      "personal",

    productName:
      "IndusInd Personal Loan",

    interestRate: {
      min: 10.49,
      displayText:
        "Starting from 10.49% p.a.; actual rate varies by applicant.",
    },

    processingFee:
      "Up to 3.5% of loan amount, excluding applicable taxes and statutory charges.",

    tenureMonths: {
      min: 12,
      max: 60,
    },

    minLoanAmount:
      30000,

    maxLoanAmount:
      5000000,

    minCreditScore:
      730,

    minIncome:
      25000,

    minAge:
      21,

    maxAgeAtLoanEnd:
      60,

    prepaymentRules:
      "Foreclosure and prepayment are subject to the personal-loan agreement and applicable charges.",

    eligibilityNotes:
      "IndusInd states minimum monthly income of ₹25,000 for salaried applicants and indicates a credit score of around 730 for instant personal-loan eligibility.",

    specialFeatures: [
      "100% digital process",
      "No collateral",
      "Loan amount up to ₹50 lakh",
      "Tenure up to 60 months",
    ],

    applyUrl:
      "https://www.indusind.com/in/en/personal/loans/personal-loan/personal-loan-in-mumbai.html",

    documentsUrl:
      "https://www.indusind.com/in/en/personal/loans/personal-loan/personal-loan-in-mumbai.html",

    sourceUrl:
      "https://www.indusind.com/in/en/personal/loans/personal-loan/personal-loan-in-mumbai.html",

    sourceType:
      "official-bank",

    lastVerified:
      VERIFIED_DATE,
  },

  {
    bankName:
      "IndusInd Bank",

    loanSlug:
      "car",

    productName:
      "IndusInd New Car Loan",

    interestRate: {
      displayText:
        "Personalised car-loan interest rate; IndusInd does not publish one universal numeric rate on its current public New Car Loan page.",
    },

    processingFee:
      "Applicable processing charges depend on vehicle and borrower profile.",

    tenureMonths: {
      min: 12,
      max: 84,
    },

    minCreditScore:
      600,

    minIncome:
      20834,

    minAge:
      23,

    maxAgeAtLoanEnd:
      65,

    maxLTV:
      100,

    prepaymentRules:
      "Prepayment terms depend on the individual loan agreement.",

    eligibilityNotes:
      "IndusInd states that new-car loan eligibility depends on income, credit profile, employment or business stability and vehicle details.",

    specialFeatures: [
      "Up to 100% vehicle finance subject to eligibility",
      "New car finance",
      "Tenure may extend up to 7 years",
      "Doorstep assistance",
    ],

    applyUrl:
      "https://www.indusind.com/in/en/personal/loans/vehicle-loan/new-cars-loan.html",

    documentsUrl:
      "https://www.indusind.com/in/en/personal/loans/vehicle-loan/new-cars-loan.html",

    sourceUrl:
      "https://www.indusind.com/in/en/personal/loans/vehicle-loan/new-cars-loan.html",

    sourceType:
      "official-bank",

    lastVerified:
      VERIFIED_DATE,
  },

  {
    bankName:
      "IndusInd Bank",

    loanSlug:
      "education",

    productName:
      "IndusInd Personal Loan for Education",

    interestRate: {
      min: 10.49,
      displayText:
        "Starting from 10.49% p.a. for IndusInd personal loans used for higher-education expenses.",
    },

    processingFee:
      "Up to 3.5% under the applicable personal-loan product.",

    tenureMonths: {
      min: 12,
      max: 60,
    },

    minLoanAmount:
      30000,

    maxLoanAmount:
      5000000,

    prepaymentRules:
      "Uses IndusInd personal-loan repayment and foreclosure terms.",

    eligibilityNotes:
      "This is a personal-loan route that IndusInd explicitly markets as usable for college and higher-education expenses; it is not represented as a traditional moratorium-based student loan.",

    specialFeatures: [
      "Can fund higher-education expenses",
      "Unsecured personal loan",
      "Quick disbursal",
      "No education-loan moratorium",
    ],

    applyUrl:
      "https://www.indusind.com/in/en/personal/loans/personal-loan.html",

    documentsUrl:
      "https://www.indusind.com/in/en/personal/loans/personal-loan.html",

    sourceUrl:
      "https://www.indusind.com/iblogs/personal-loan/personal-loans-for-college-education-is-it-a-wise-choice/",

    sourceType:
      "official-bank",

    lastVerified:
      VERIFIED_DATE,
  },

  /*
    ========================================================
    YES BANK
    ========================================================
  */

  {
    bankName:
      "Yes Bank",

    loanSlug:
      "home",

    productName:
      "YES BANK Home Loan",

    interestRate: {
      min: 7.4,
      max: 9.5,
      displayText:
        "7.40% - 9.50% p.a. based on YES BANK's Jan-Mar 2026 retail-loan rate disclosure.",
    },

    processingFee:
      "Processing and administrative charges apply according to YES BANK's Home Loan schedule of charges.",

    tenureMonths: {
      min: 12,
      max: 420,
    },

    maxLoanAmount:
      100000000,

    prepaymentRules:
      "Prepayment conditions depend on borrower type and interest-rate structure.",

    eligibilityNotes:
      "Final rate depends on credit profile, income, property and sanction conditions.",

    specialFeatures: [
      "Loan amount up to ₹10 crore",
      "Tenure up to 35 years",
      "Home purchase",
      "Home construction",
    ],

    applyUrl:
      "https://www.yes.bank.in/personal-banking/yes-individual/loans/home-loan",

    documentsUrl:
      "https://www.yes.bank.in/personal-banking/yes-individual/loans/home-loan",

    sourceUrl:
      "https://www.yes.bank.in/sites/web/content/published/api/v1.1/assets/CONTD0C00ACC07A042DAA4ED2E68E22B928F/native/retail_loans_interest_rates_pdf.pdf?download=false",

    sourceType:
      "official-bank",

    lastVerified:
      VERIFIED_DATE,
  },

  {
    bankName:
      "Yes Bank",

    loanSlug:
      "personal",

    productName:
      "YES BANK Personal Loan",

    interestRate: {
      min: 10.7,
      max: 21,
      displayText:
        "10.70% - 21.00% p.a. in YES BANK's Jan-Mar 2026 retail-loan rate disclosure.",
    },

    processingFee:
      "Applicable processing fee according to YES BANK Personal Loan terms.",

    tenureMonths: {
      min: 12,
      max: 72,
    },

    maxLoanAmount:
      5000000,

    minAge:
      21,

    maxAgeAtLoanEnd:
      60,

    prepaymentRules:
      "Part-payment facility is available subject to applicable terms.",

    eligibilityNotes:
      "Rate depends on creditworthiness, income, employment and bank assessment.",

    specialFeatures: [
      "Loan up to ₹50 lakh",
      "Tenure up to 72 months",
      "Part-payment facility",
      "Digital eligibility check",
    ],

    applyUrl:
      "https://www.yes.bank.in/sites/yesbank/personal-banking/loans/personal-loan",

    documentsUrl:
      "https://www.yes.bank.in/sites/yesbank/personal-banking/loans/personal-loan",

    sourceUrl:
      "https://www.yes.bank.in/sites/web/content/published/api/v1.1/assets/CONTD0C00ACC07A042DAA4ED2E68E22B928F/native/retail_loans_interest_rates_pdf.pdf?download=false",

    sourceType:
      "official-bank",

    lastVerified:
      VERIFIED_DATE,
  },

  {
    bankName:
      "Yes Bank",

    loanSlug:
      "car",

    productName:
      "YES BANK Car Loan",

    interestRate: {
      min: 8.3,
      max: 11.52,
      displayText:
        "8.30% - 11.52% p.a. based on YES BANK's Jan-Mar 2026 retail-loan rate disclosure.",
    },

    processingFee:
      "Applicable one-time processing charges according to YES BANK Auto Loan terms.",

    tenureMonths: {
      min: 12,
      max: 84,
    },

    maxLTV:
      100,

    minAge:
      21,

    maxAgeAtLoanEnd:
      65,

    prepaymentRules:
      "Pre-closure is subject to YES BANK's applicable auto-loan terms.",

    eligibilityNotes:
      "Available to eligible salaried and self-employed applicants.",

    specialFeatures: [
      "Up to 100% on-road funding subject to eligibility",
      "Tenure up to 84 months",
      "Structured repayment schemes",
      "New car financing",
    ],

    applyUrl:
      "https://www.yes.bank.in/sites/yesbank/personal-banking/yes-individual/loans/car-loans",

    documentsUrl:
      "https://www.yes.bank.in/personal-banking/loans/car-loan-documentation",

    sourceUrl:
      "https://www.yes.bank.in/sites/web/content/published/api/v1.1/assets/CONTD0C00ACC07A042DAA4ED2E68E22B928F/native/retail_loans_interest_rates_pdf.pdf?download=false",

    sourceType:
      "official-bank",

    lastVerified:
      VERIFIED_DATE,
  },

  {
    bankName:
      "Yes Bank",

    loanSlug:
      "education",

    productName:
      "YES BANK Education Loan",

    interestRate: {
      min: 10.6,
      max: 13,
      displayText:
        "10.60% - 13.00% p.a. based on YES BANK's Jan-Mar 2026 retail-loan rate disclosure.",
    },

    processingFee:
      "2% of sanctioned loan amount according to YES BANK's current education-loan information.",

    tenureMonths: {
      min: 12,
      max: 180,
    },

    prepaymentRules:
      "Subject to education-loan agreement and applicable sanction conditions.",

    eligibilityNotes:
      "Available for eligible students pursuing higher education in India or abroad, subject to co-applicant and credit assessment.",

    specialFeatures: [
      "Study in India",
      "Study abroad",
      "Repayment up to 15 years",
      "Preferential rates may apply for eligible girl students",
    ],

    applyUrl:
      "https://www.yes.bank.in/personal-banking/yes-individual/loans/education-loan",

    documentsUrl:
      "https://www.yes.bank.in/personal-banking/yes-individual/loans/education-loan",

    sourceUrl:
      "https://www.yes.bank.in/sites/web/content/published/api/v1.1/assets/CONTD0C00ACC07A042DAA4ED2E68E22B928F/native/retail_loans_interest_rates_pdf.pdf?download=false",

    sourceType:
      "official-bank",

    lastVerified:
      VERIFIED_DATE,
  },

  /*
    ========================================================
    FEDERAL BANK
    ========================================================
  */

  {
    bankName:
      "Federal Bank",

    loanSlug:
      "home",

    productName:
      "Federal Bank Home Loan",

    interestRate: {
      min: 7.5,
      max: 11.55,
      displayText:
        "7.50% - 11.55% p.a.",
    },

    processingFee:
      "0.50% of sanctioned limit, subject to Federal Bank's applicable minimum and maximum charges.",

    tenureMonths: {
      min: 12,
      max: 360,
    },

    prepaymentRules:
      "Nil prepayment charge for eligible floating-rate housing loans to individuals.",

    eligibilityNotes:
      "Final pricing depends on borrower credit profile, income, property and sanction conditions.",

    specialFeatures: [
      "Floating-rate home loans",
      "Home purchase",
      "Construction",
      "Balance-transfer options",
    ],

    applyUrl:
      "https://www.federalbank.co.in/housing-loan",

    documentsUrl:
      "https://www.federalbank.co.in/housing-loan",

    sourceUrl:
      "https://www.federalbank.co.in/documents/10180/6159080/APR%2BNOTE%2BQ1%2BFY2025-26.pdf/3abdbda0-0868-6579-c55f-b45be8139f6c?t=1755164339738",

    sourceType:
      "official-bank",

    lastVerified:
      VERIFIED_DATE,
  },

  {
    bankName:
      "Federal Bank",

    loanSlug:
      "personal",

    productName:
      "Federal Bank Personal Loan",

    interestRate: {
      min: 8.9,
      max: 22.5,
      displayText:
        "8.90% - 22.50% p.a.",
    },

    processingFee:
      "Up to 3% according to Federal Bank's retail loan service-charge schedule.",

    tenureMonths: {
      min: 12,
      max: 60,
    },

    prepaymentRules:
      "Floating-rate schemes may have nil prepayment charge; fixed-rate schemes may attract applicable charges.",

    eligibilityNotes:
      "Final rate depends on borrower profile, income, credit score and bank assessment.",

    specialFeatures: [
      "Unsecured personal loan",
      "Flexible repayment",
      "Profile-based pricing",
    ],

    applyUrl:
      "https://www.federalbank.co.in/personal-loan",

    documentsUrl:
      "https://www.federalbank.co.in/personal-loan",

    sourceUrl:
      "https://www.federalbank.co.in/documents/10180/6159080/APR%2BNOTE%2BQ1%2BFY2025-26.pdf/3abdbda0-0868-6579-c55f-b45be8139f6c?t=1755164339738",

    sourceType:
      "official-bank",

    lastVerified:
      VERIFIED_DATE,
  },

  {
    bankName:
      "Federal Bank",

    loanSlug:
      "car",

    productName:
      "Federal Bank Vehicle Loan",

    interestRate: {
      min: 7.9,
      max: 18,
      displayText:
        "7.90% - 18.00% p.a. across Federal Bank's published vehicle-loan pricing range.",
    },

    processingFee:
      "New car processing charge varies by loan amount according to Federal Bank's service-charge schedule.",

    tenureMonths: {
      min: 12,
      max: 84,
    },

    prepaymentRules:
      "Applicable according to vehicle-loan agreement and interest-rate type.",

    eligibilityNotes:
      "Final interest rate depends on borrower profile, vehicle and credit assessment.",

    specialFeatures: [
      "New car loans",
      "Used car loans",
      "Two-wheeler finance",
      "Vehicle-loan EMI repayment",
    ],

    applyUrl:
      "https://www.federalbank.co.in/car-loan",

    documentsUrl:
      "https://www.federalbank.co.in/car-loan",

    sourceUrl:
      "https://www.federalbank.co.in/documents/10180/6159080/APR%2BNOTE%2BQ1%2BFY2025-26.pdf/3abdbda0-0868-6579-c55f-b45be8139f6c?t=1755164339738",

    sourceType:
      "official-bank",

    lastVerified:
      VERIFIED_DATE,
  },

  {
    bankName:
      "Federal Bank",

    loanSlug:
      "education",

    productName:
      "Federal Bank Education Loan",

    interestRate: {
      min: 8.25,
      max: 15,
      displayText:
        "8.25% - 15.00% p.a.",
    },

    processingFee:
      "Processing charges depend on education-loan scheme and sanction conditions.",

    tenureMonths: {
      min: 12,
      max: 180,
    },

    prepaymentRules:
      "Subject to Federal Bank education-loan conditions.",

    eligibilityNotes:
      "Rate and eligibility depend on institution, course, loan amount, co-applicant and security requirements.",

    specialFeatures: [
      "Higher education funding",
      "India and overseas education",
      "Long repayment tenure",
      "Profile-based pricing",
    ],

    applyUrl:
      "https://www.federalbank.co.in/education-loan",

    documentsUrl:
      "https://www.federalbank.co.in/education-loan",

    sourceUrl:
      "https://www.federalbank.co.in/documents/10180/6159080/APR%2BNOTE%2BQ1%2BFY2025-26.pdf/3abdbda0-0868-6579-c55f-b45be8139f6c?t=1755164339738",

    sourceType:
      "official-bank",

    lastVerified:
      VERIFIED_DATE,
  },
];

/*
  ==========================================================
  SEED FUNCTION
  ==========================================================
*/

const seedAdditionalLoanProducts =
  async () => {
    try {
      await connectDB();

      console.log(
        "Connected to MongoDB."
      );

      let seededCount = 0;
      let skippedCount = 0;

      for (
        const item
        of products
      ) {
        const bank =
          await Bank.findOne({
            name:
              item.bankName,
          });

        if (!bank) {
          console.log(
            `SKIPPED: Bank not found -> ${item.bankName}`
          );

          skippedCount++;
          continue;
        }

        const loanType =
          await LoanType.findOne({
            slug:
              item.loanSlug,
          });

        if (!loanType) {
          console.log(
            `SKIPPED: Loan type not found -> ${item.loanSlug}`
          );

          skippedCount++;
          continue;
        }

        const {
          bankName,
          loanSlug,
          ...productData
        } = item;

        const result =
          await LoanProduct.findOneAndUpdate(
            {
              bankId:
                bank._id,

              loanTypeId:
                loanType._id,
            },

            {
              $set: {
                ...productData,

                bankId:
                  bank._id,

                loanTypeId:
                  loanType._id,
              },
            },

            {
              upsert: true,

              returnDocument:
                "after",

              setDefaultsOnInsert:
                true,
            }
          );

        seededCount++;

        console.log(
          `Seeded: ${bank.name} -> ${loanType.name} -> ${result.productName}`
        );
      }

      const totalProducts =
        await LoanProduct.countDocuments();

      console.log("");
      console.log(
        "===================================="
      );

      console.log(
        `New/updated products: ${seededCount}`
      );

      console.log(
        `Skipped products: ${skippedCount}`
      );

      console.log(
        `Total loan products in DB: ${totalProducts}`
      );

      console.log(
        "===================================="
      );

      process.exit(0);
    } catch (error) {
      console.error(
        "Additional loan product seed failed:",
        error
      );

      process.exit(1);
    }
  };

seedAdditionalLoanProducts();