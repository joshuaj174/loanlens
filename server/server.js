import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import bankRoutes from "./routes/bank.js";
import loanTypeRoutes from "./routes/LoanTypes.js";
import loanProductRoutes from "./routes/loanProducts.js";
import calculationRoutes from "./routes/calculations.js";
import authRoutes from "./routes/auth.js";
import savedComparisonRoutes from "./routes/savedComparisons.js";
import savedSimulationRoutes from "./routes/savedSimulations.js";

dotenv.config();

const app = express();

const PORT =
  process.env.PORT ||
  5000;

connectDB();

app.use(cors());

app.use(
  express.json({
    limit: "2mb",
  })
);

app.get(
  "/",
  (req, res) => {
    res.json({
      success: true,
      message:
        "LoanLens API is running",
    });
  }
);

app.get(
  "/api/health",
  (req, res) => {
    res.json({
      success: true,
      status: "OK",
      message:
        "LoanLens backend is healthy",
    });
  }
);

app.use(
  "/api/banks",
  bankRoutes
);

app.use(
  "/api/loan-types",
  loanTypeRoutes
);

app.use(
  "/api/loan-products",
  loanProductRoutes
);

app.use(
  "/api/calculations",
  calculationRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/saved-comparisons",
  savedComparisonRoutes
);

app.use(
  "/api/saved-simulations",
  savedSimulationRoutes
);

app.listen(
  PORT,
  () => {
    console.log(
      `LoanLens server running on http://localhost:${PORT}`
    );
  }
);