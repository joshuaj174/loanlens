import dotenv from "dotenv";
import mongoose from "mongoose";

import Bank from "../models/Bank.js";
import LoanType from "../models/LoanType.js";

dotenv.config();

const banks = [
  {
    name: "State Bank of India",
    osmNameVariants: ["State Bank of India", "SBI"],
    websiteUrl: "https://sbi.co.in",
  },
  {
    name: "HDFC Bank",
    osmNameVariants: ["HDFC Bank", "HDFC"],
    websiteUrl: "https://www.hdfcbank.com",
  },
  {
    name: "ICICI Bank",
    osmNameVariants: ["ICICI Bank", "ICICI"],
    websiteUrl: "https://www.icicibank.com",
  },
  {
    name: "Axis Bank",
    osmNameVariants: ["Axis Bank", "Axis"],
    websiteUrl: "https://www.axisbank.com",
  },
  {
    name: "Kotak Mahindra Bank",
    osmNameVariants: ["Kotak Mahindra Bank", "Kotak Bank", "Kotak"],
    websiteUrl: "https://www.kotak.com",
  },
  {
    name: "Bank of Baroda",
    osmNameVariants: ["Bank of Baroda", "BOB"],
    websiteUrl: "https://www.bankofbaroda.in",
  },
  {
    name: "Punjab National Bank",
    osmNameVariants: ["Punjab National Bank", "PNB"],
    websiteUrl: "https://www.pnbindia.in",
  },
  {
    name: "Canara Bank",
    osmNameVariants: ["Canara Bank"],
    websiteUrl: "https://canarabank.com",
  },
];

const loanTypes = [
  {
    name: "Home Loan",
    slug: "home",
    description: "Loan for purchasing, constructing, or financing a residential property.",
    isAssetBacked: true,
  },
  {
    name: "Personal Loan",
    slug: "personal",
    description: "Unsecured loan for personal financial requirements.",
    isAssetBacked: false,
  },
  {
    name: "Car Loan",
    slug: "car",
    description: "Loan used to finance the purchase of a vehicle.",
    isAssetBacked: true,
  },
  {
    name: "Education Loan",
    slug: "education",
    description: "Loan used to finance higher education expenses.",
    isAssetBacked: false,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected for seeding.");

    await Bank.deleteMany({});
    await LoanType.deleteMany({});

    await Bank.insertMany(banks);
    await LoanType.insertMany(loanTypes);

    console.log(`${banks.length} banks inserted.`);
    console.log(`${loanTypes.length} loan types inserted.`);
    console.log("LoanLens seed completed successfully.");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:");
    console.error(error.message);

    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();