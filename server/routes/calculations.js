import express from "express";

import LoanProduct from "../models/LoanProduct.js";

import {
  calculateEMI,
  calculateFOIR,
  calculateMaxAffordableEMI,
  calculateMaxLoanAmount,
  generateAmortizationRange,
  calculateFloatingRateScenario,
  checkBasicEligibility,
} from "../utils/emiCalculator.js";

const router =
  express.Router();

/*
  =====================================
  PERSONALIZED COMPARISON
  =====================================

  POST
  /api/calculations/compare
*/

router.post(
  "/compare",
  async (req, res) => {
    try {
      const {
        loanType,
        bankIds,
        loanAmount,
        tenureMonths,
        monthlyIncome,
        existingEMIs,
        age,
        creditScore,
      } = req.body;

      if (
        !loanType ||
        !Array.isArray(
          bankIds
        ) ||
        bankIds.length === 0
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Loan type and selected bank IDs are required.",
          });
      }

      if (
        !loanAmount ||
        !tenureMonths ||
        !monthlyIncome
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Loan amount, tenure and monthly income are required.",
          });
      }

      const products =
        await LoanProduct.find({
          bankId: {
            $in: bankIds,
          },
        })
          .populate(
            "bankId",
            "name logoUrl websiteUrl"
          )
          .populate(
            "loanTypeId",
            "name slug"
          );

      const matchingProducts =
        products.filter(
          (product) =>
            product.loanTypeId
              ?.slug ===
            loanType
        );

      const results =
        matchingProducts.map(
          (product) => {
            const minRate =
              product
                .interestRate
                ?.min;

            const publishedMaxRate =
              product
                .interestRate
                ?.max;

            const eligibility =
              checkBasicEligibility({
                product,

                monthlyIncome,

                creditScore,

                age,

                requestedLoanAmount:
                  loanAmount,

                tenureMonths,
              });

            if (
              minRate === null ||
              minRate === undefined
            ) {
              return {
                bank:
                  product.bankId,

                productId:
                  product._id,

                productName:
                  product.productName,

                calculationAvailable:
                  false,

                reason:
                  "A numeric interest rate is not currently stored for this product.",

                eligibility,
              };
            }

            const maxRate =
              publishedMaxRate ===
                null ||
              publishedMaxRate ===
                undefined
                ? minRate
                : publishedMaxRate;

            const hasRateRange =
              maxRate >
              minRate;

            const minFinancial =
              calculateEMI({
                principal:
                  loanAmount,

                annualRate:
                  minRate,

                tenureMonths,
              });

            const minFOIR =
              calculateFOIR({
                monthlyIncome,

                existingEMIs,

                proposedEMI:
                  minFinancial.emi,
              });

            const maxFinancial =
              hasRateRange
                ? calculateEMI({
                    principal:
                      loanAmount,

                    annualRate:
                      maxRate,

                    tenureMonths,
                  })
                : minFinancial;

            const maxFOIR =
              hasRateRange
                ? calculateFOIR({
                    monthlyIncome,

                    existingEMIs,

                    proposedEMI:
                      maxFinancial.emi,
                  })
                : minFOIR;

            const maxAffordableEMI =
              calculateMaxAffordableEMI({
                monthlyIncome,

                existingEMIs,

                foirLimit: 50,
              });

            const maxLoanAtMinRate =
              calculateMaxLoanAmount({
                maxEMI:
                  maxAffordableEMI,

                annualRate:
                  minRate,

                tenureMonths,
              });

            const maxLoanAtMaxRate =
              calculateMaxLoanAmount({
                maxEMI:
                  maxAffordableEMI,

                annualRate:
                  maxRate,

                tenureMonths,
              });

            const minRateFOIREligible =
              minFOIR <= 50;

            const maxRateFOIREligible =
              maxFOIR <= 50;

            let eligibilityStatus =
              "eligible";

            if (
              !eligibility.eligible ||
              !minRateFOIREligible
            ) {
              eligibilityStatus =
                "not-eligible";
            } else if (
              hasRateRange &&
              !maxRateFOIREligible
            ) {
              eligibilityStatus =
                "rate-dependent";
            }

            const reasons = [
              ...eligibility.reasons,
            ];

            if (hasRateRange) {
              reasons.push(
                `Estimated FOIR ranges from ${minFOIR}% at ${minRate}% interest to ${maxFOIR}% at ${maxRate}% interest.`
              );
            } else {
              reasons.push(
                `Estimated FOIR is ${minFOIR}% using the available ${minRate}% rate.`
              );
            }

            return {
              bank:
                product.bankId,

              productId:
                product._id,

              productName:
                product.productName,

              calculationAvailable:
                true,

              hasRateRange,

              rateRange: {
                min:
                  Number(
                    minRate
                  ),

                max:
                  Number(
                    maxRate
                  ),
              },

              emiRange: {
                min:
                  minFinancial.emi,

                max:
                  maxFinancial.emi,
              },

              totalInterestRange: {
                min:
                  minFinancial
                    .totalInterest,

                max:
                  maxFinancial
                    .totalInterest,
              },

              totalPaymentRange: {
                min:
                  minFinancial
                    .totalPayment,

                max:
                  maxFinancial
                    .totalPayment,
              },

              foirRange: {
                min:
                  minFOIR,

                max:
                  maxFOIR,
              },

              maxAffordableEMI,

              maxLoanByFOIRRange: {
                min:
                  maxLoanAtMaxRate,

                max:
                  maxLoanAtMinRate,
              },

              eligibility: {
                eligible:
                  eligibilityStatus ===
                  "eligible",

                status:
                  eligibilityStatus,

                basicRulesPassed:
                  eligibility.eligible,

                minRateFOIRPassed:
                  minRateFOIREligible,

                maxRateFOIRPassed:
                  maxRateFOIREligible,

                reasons,
              },
            };
          }
        );

      res.json({
        success: true,

        input: {
          loanType,

          loanAmount:
            Number(
              loanAmount
            ),

          tenureMonths:
            Number(
              tenureMonths
            ),

          monthlyIncome:
            Number(
              monthlyIncome
            ),

          existingEMIs:
            Number(
              existingEMIs ||
                0
            ),

          age:
            age
              ? Number(age)
              : null,

          creditScore:
            creditScore
              ? Number(
                  creditScore
                )
              : null,
        },

        count:
          results.length,

        results,

        disclaimer:
          "LoanLens calculates published minimum and maximum rate scenarios where both rates are available. Where only a starting rate is published, only that rate is used. These are indicative calculations and not bank approvals.",
      });
    } catch (error) {
      console.error(
        "Personalized comparison error:",
        error
      );

      res
        .status(500)
        .json({
          success: false,

          message:
            "Failed to calculate personalized comparison.",

          error:
            error.message,
        });
    }
  }
);

/*
  =====================================
  AMORTIZATION RANGE
  =====================================

  POST
  /api/calculations/amortization
*/

router.post(
  "/amortization",
  async (req, res) => {
    try {
      const {
        loanAmount,
        minRate,
        maxRate,
        tenureMonths,
      } = req.body;

      if (
        !loanAmount ||
        !minRate ||
        !tenureMonths
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Loan amount, minimum rate and tenure are required.",
          });
      }

      const result =
        generateAmortizationRange({
          principal:
            Number(
              loanAmount
            ),

          minRate:
            Number(
              minRate
            ),

          maxRate:
            maxRate === null ||
            maxRate === undefined
              ? null
              : Number(
                  maxRate
                ),

          tenureMonths:
            Number(
              tenureMonths
            ),
        });

      res.json({
        success: true,

        loanAmount:
          Number(
            loanAmount
          ),

        tenureMonths:
          Number(
            tenureMonths
          ),

        ...result,

        disclaimer:
          "The minimum-rate scenario uses the published minimum rate and the maximum-rate scenario uses the published maximum rate. If only one rate is available, both scenarios are identical.",
      });
    } catch (error) {
      console.error(
        "Amortization calculation error:",
        error
      );

      res
        .status(500)
        .json({
          success: false,

          message:
            "Failed to generate amortization schedule.",

          error:
            error.message,
        });
    }
  }
);

/*
  =====================================
  FLOATING-RATE SIMULATOR
  =====================================

  POST
  /api/calculations/floating-rate
*/

router.post(
  "/floating-rate",
  async (req, res) => {
    try {
      const {
        loanAmount,
        originalRate,
        newRate,
        tenureMonths,
        changeAfterMonths,
      } = req.body;

      if (
        !loanAmount ||
        !originalRate ||
        !newRate ||
        !tenureMonths ||
        !changeAfterMonths
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Loan amount, original rate, new rate, tenure and rate-change time are required.",
          });
      }

      const result =
        calculateFloatingRateScenario({
          principal:
            Number(
              loanAmount
            ),

          originalRate:
            Number(
              originalRate
            ),

          newRate:
            Number(
              newRate
            ),

          tenureMonths:
            Number(
              tenureMonths
            ),

          changeAfterMonths:
            Number(
              changeAfterMonths
            ),
        });

      res.json({
        success: true,

        ...result,

        disclaimer:
          "This simulator assumes the original interest rate applies until the selected change month, after which the new rate remains constant for the rest of the loan. The remaining tenure is kept unchanged and EMI is recalculated.",
      });
    } catch (error) {
      console.error(
        "Floating-rate simulation error:",
        error
      );

      res
        .status(400)
        .json({
          success: false,

          message:
            "Failed to calculate floating-rate scenario.",

          error:
            error.message,
        });
    }
  }
);

export default router;