export const calculateEMI = ({
  principal,
  annualRate,
  tenureMonths,
}) => {
  const P = Number(principal);
  const annual = Number(annualRate);
  const n = Number(tenureMonths);

  if (
    !P ||
    annual === null ||
    annual === undefined ||
    !n ||
    P <= 0 ||
    annual <= 0 ||
    n <= 0
  ) {
    throw new Error(
      "Valid principal, interest rate and tenure are required."
    );
  }

  const monthlyRate =
    annual / 12 / 100;

  const factor =
    Math.pow(
      1 + monthlyRate,
      n
    );

  const emi =
    (P *
      monthlyRate *
      factor) /
    (factor - 1);

  const totalPayment =
    emi * n;

  const totalInterest =
    totalPayment - P;

  return {
    emi: Number(
      emi.toFixed(2)
    ),

    totalInterest: Number(
      totalInterest.toFixed(2)
    ),

    totalPayment: Number(
      totalPayment.toFixed(2)
    ),
  };
};

export const calculateFOIR = ({
  monthlyIncome,
  existingEMIs,
  proposedEMI,
}) => {
  const income =
    Number(monthlyIncome);

  const existing =
    Number(existingEMIs || 0);

  const proposed =
    Number(proposedEMI);

  if (
    !income ||
    income <= 0
  ) {
    throw new Error(
      "Monthly income must be greater than zero."
    );
  }

  const totalObligations =
    existing + proposed;

  const foir =
    (totalObligations /
      income) *
    100;

  return Number(
    foir.toFixed(2)
  );
};

export const calculateMaxAffordableEMI = ({
  monthlyIncome,
  existingEMIs,
  foirLimit = 50,
}) => {
  const income =
    Number(monthlyIncome);

  const existing =
    Number(existingEMIs || 0);

  const limit =
    Number(foirLimit);

  const maxTotalObligations =
    income *
    (limit / 100);

  const maxAffordableEMI =
    maxTotalObligations -
    existing;

  return Math.max(
    0,
    Number(
      maxAffordableEMI.toFixed(2)
    )
  );
};

export const calculateMaxLoanAmount = ({
  maxEMI,
  annualRate,
  tenureMonths,
}) => {
  const EMI =
    Number(maxEMI);

  const annual =
    Number(annualRate);

  const n =
    Number(tenureMonths);

  if (
    EMI <= 0 ||
    annual <= 0 ||
    n <= 0
  ) {
    return 0;
  }

  const monthlyRate =
    annual / 12 / 100;

  const factor =
    Math.pow(
      1 + monthlyRate,
      n
    );

  const numerator =
    EMI *
    (factor - 1);

  const denominator =
    monthlyRate *
    factor;

  const principal =
    numerator /
    denominator;

  return Number(
    principal.toFixed(2)
  );
};

export const generateAmortizationSchedule = ({
  principal,
  annualRate,
  tenureMonths,
}) => {
  const P =
    Number(principal);

  const annual =
    Number(annualRate);

  const n =
    Number(tenureMonths);

  if (
    !P ||
    !annual ||
    !n ||
    P <= 0 ||
    annual <= 0 ||
    n <= 0
  ) {
    throw new Error(
      "Valid principal, annual rate and tenure are required."
    );
  }

  const financial =
    calculateEMI({
      principal: P,
      annualRate: annual,
      tenureMonths: n,
    });

  const monthlyRate =
    annual / 12 / 100;

  let balance = P;

  let cumulativePrincipal = 0;
  let cumulativeInterest = 0;

  const monthlySchedule = [];

  for (
    let month = 1;
    month <= n;
    month += 1
  ) {
    const interestPaid =
      balance *
      monthlyRate;

    let principalPaid =
      financial.emi -
      interestPaid;

    let payment =
      financial.emi;

    if (
      principalPaid >
      balance
    ) {
      principalPaid =
        balance;

      payment =
        principalPaid +
        interestPaid;
    }

    balance -=
      principalPaid;

    if (
      balance < 0.01
    ) {
      balance = 0;
    }

    cumulativePrincipal +=
      principalPaid;

    cumulativeInterest +=
      interestPaid;

    monthlySchedule.push({
      month,

      year:
        Math.ceil(
          month / 12
        ),

      emi:
        Number(
          payment.toFixed(2)
        ),

      principalPaid:
        Number(
          principalPaid.toFixed(2)
        ),

      interestPaid:
        Number(
          interestPaid.toFixed(2)
        ),

      remainingBalance:
        Number(
          balance.toFixed(2)
        ),

      cumulativePrincipal:
        Number(
          cumulativePrincipal.toFixed(
            2
          )
        ),

      cumulativeInterest:
        Number(
          cumulativeInterest.toFixed(
            2
          )
        ),
    });
  }

  const yearlyMap = {};

  monthlySchedule.forEach(
    (item) => {
      const year =
        item.year;

      if (!yearlyMap[year]) {
        yearlyMap[year] = {
          year,

          principalPaid: 0,

          interestPaid: 0,

          totalPayment: 0,

          endingBalance: 0,
        };
      }

      yearlyMap[
        year
      ].principalPaid +=
        item.principalPaid;

      yearlyMap[
        year
      ].interestPaid +=
        item.interestPaid;

      yearlyMap[
        year
      ].totalPayment +=
        item.emi;

      yearlyMap[
        year
      ].endingBalance =
        item.remainingBalance;
    }
  );

  const yearlySchedule =
    Object.values(
      yearlyMap
    ).map(
      (item) => ({
        year:
          item.year,

        principalPaid:
          Number(
            item.principalPaid.toFixed(
              2
            )
          ),

        interestPaid:
          Number(
            item.interestPaid.toFixed(
              2
            )
          ),

        totalPayment:
          Number(
            item.totalPayment.toFixed(
              2
            )
          ),

        endingBalance:
          Number(
            item.endingBalance.toFixed(
              2
            )
          ),
      })
    );

  return {
    loanAmount:
      P,

    annualRate:
      annual,

    tenureMonths:
      n,

    emi:
      financial.emi,

    totalInterest:
      financial.totalInterest,

    totalPayment:
      financial.totalPayment,

    monthlySchedule,

    yearlySchedule,
  };
};

export const generateAmortizationRange = ({
  principal,
  minRate,
  maxRate,
  tenureMonths,
}) => {
  const minimumRate =
    Number(minRate);

  const maximumRate =
    maxRate === null ||
    maxRate === undefined
      ? minimumRate
      : Number(maxRate);

  if (
    !minimumRate ||
    minimumRate <= 0
  ) {
    throw new Error(
      "A valid minimum interest rate is required."
    );
  }

  const minScenario =
    generateAmortizationSchedule({
      principal,
      annualRate:
        minimumRate,
      tenureMonths,
    });

  const hasRateRange =
    maximumRate >
    minimumRate;

  const maxScenario =
    hasRateRange
      ? generateAmortizationSchedule({
          principal,
          annualRate:
            maximumRate,
          tenureMonths,
        })
      : minScenario;

  const yearlySchedule =
    minScenario.yearlySchedule.map(
      (
        minYear,
        index
      ) => {
        const maxYear =
          maxScenario
            .yearlySchedule[
            index
          ];

        return {
          year:
            minYear.year,

          minPrincipalPaid:
            minYear.principalPaid,

          maxPrincipalPaid:
            maxYear.principalPaid,

          minInterestPaid:
            minYear.interestPaid,

          maxInterestPaid:
            maxYear.interestPaid,

          minTotalPayment:
            minYear.totalPayment,

          maxTotalPayment:
            maxYear.totalPayment,

          minEndingBalance:
            minYear.endingBalance,

          maxEndingBalance:
            maxYear.endingBalance,
        };
      }
    );

  return {
    hasRateRange,

    minRate:
      minimumRate,

    maxRate:
      maximumRate,

    minScenario,

    maxScenario,

    yearlySchedule,
  };
};

export const calculateFloatingRateScenario = ({
  principal,
  originalRate,
  newRate,
  tenureMonths,
  changeAfterMonths,
}) => {
  const P =
    Number(principal);

  const startingRate =
    Number(originalRate);

  const changedRate =
    Number(newRate);

  const totalMonths =
    Number(tenureMonths);

  const changeMonth =
    Number(changeAfterMonths);

  if (
    !P ||
    P <= 0
  ) {
    throw new Error(
      "Valid loan amount is required."
    );
  }

  if (
    !startingRate ||
    startingRate <= 0 ||
    !changedRate ||
    changedRate <= 0
  ) {
    throw new Error(
      "Valid original and new interest rates are required."
    );
  }

  if (
    !totalMonths ||
    totalMonths <= 0
  ) {
    throw new Error(
      "Valid loan tenure is required."
    );
  }

  if (
    changeMonth <= 0 ||
    changeMonth >= totalMonths
  ) {
    throw new Error(
      "Rate-change month must be greater than 0 and less than the full loan tenure."
    );
  }

  /*
    ORIGINAL LOAN

    This represents what would happen
    if the original rate never changed.
  */

  const originalSchedule =
    generateAmortizationSchedule({
      principal: P,
      annualRate:
        startingRate,
      tenureMonths:
        totalMonths,
    });

  const lastPaidMonth =
    originalSchedule
      .monthlySchedule[
      changeMonth - 1
    ];

  const remainingBalance =
    lastPaidMonth
      .remainingBalance;

  const interestPaidBeforeChange =
    lastPaidMonth
      .cumulativeInterest;

  const principalPaidBeforeChange =
    lastPaidMonth
      .cumulativePrincipal;

  const amountPaidBeforeChange =
    originalSchedule
      .monthlySchedule
      .slice(
        0,
        changeMonth
      )
      .reduce(
        (
          total,
          month
        ) =>
          total +
          month.emi,
        0
      );

  const remainingMonths =
    totalMonths -
    changeMonth;

  /*
    RECALCULATED LOAN

    Same remaining tenure,
    but new interest rate.
  */

  const changedSchedule =
    generateAmortizationSchedule({
      principal:
        remainingBalance,

      annualRate:
        changedRate,

      tenureMonths:
        remainingMonths,
    });

  const originalEMI =
    originalSchedule.emi;

  const newEMI =
    changedSchedule.emi;

  const emiDifference =
    newEMI -
    originalEMI;

  const futurePaymentAfterChange =
    changedSchedule
      .totalPayment;

  const revisedTotalPayment =
    amountPaidBeforeChange +
    futurePaymentAfterChange;

  const revisedTotalInterest =
    interestPaidBeforeChange +
    changedSchedule
      .totalInterest;

  const paymentDifference =
    revisedTotalPayment -
    originalSchedule
      .totalPayment;

  const interestDifference =
    revisedTotalInterest -
    originalSchedule
      .totalInterest;

  /*
    BUILD A COMBINED MONTHLY
    SCHEDULE FOR CHARTING
  */

  const beforeChangeSchedule =
    originalSchedule
      .monthlySchedule
      .slice(
        0,
        changeMonth
      )
      .map(
        (month) => ({
          ...month,

          appliedRate:
            startingRate,

          phase:
            "Before rate change",
        })
      );

  const afterChangeSchedule =
    changedSchedule
      .monthlySchedule
      .map(
        (month) => ({
          month:
            month.month +
            changeMonth,

          year:
            Math.ceil(
              (
                month.month +
                changeMonth
              ) / 12
            ),

          emi:
            month.emi,

          principalPaid:
            month.principalPaid,

          interestPaid:
            month.interestPaid,

          remainingBalance:
            month.remainingBalance,

          appliedRate:
            changedRate,

          phase:
            "After rate change",
        })
      );

  const combinedMonthlySchedule = [
    ...beforeChangeSchedule,
    ...afterChangeSchedule,
  ];

  /*
    YEARLY SUMMARY OF THE
    FLOATING-RATE SCENARIO
  */

  const yearlyMap = {};

  combinedMonthlySchedule.forEach(
    (item) => {
      const year =
        item.year;

      if (!yearlyMap[year]) {
        yearlyMap[year] = {
          year,

          principalPaid: 0,

          interestPaid: 0,

          totalPayment: 0,

          endingBalance: 0,
        };
      }

      yearlyMap[
        year
      ].principalPaid +=
        item.principalPaid;

      yearlyMap[
        year
      ].interestPaid +=
        item.interestPaid;

      yearlyMap[
        year
      ].totalPayment +=
        item.emi;

      yearlyMap[
        year
      ].endingBalance =
        item.remainingBalance;
    }
  );

  const floatingYearlySchedule =
    Object.values(
      yearlyMap
    ).map(
      (item) => ({
        year:
          item.year,

        principalPaid:
          Number(
            item.principalPaid.toFixed(
              2
            )
          ),

        interestPaid:
          Number(
            item.interestPaid.toFixed(
              2
            )
          ),

        totalPayment:
          Number(
            item.totalPayment.toFixed(
              2
            )
          ),

        endingBalance:
          Number(
            item.endingBalance.toFixed(
              2
            )
          ),
      })
    );

  /*
    MERGE ORIGINAL AND FLOATING
    YEARLY DATA FOR COMPARISON
    CHARTS
  */

  const comparisonYearlySchedule =
    originalSchedule
      .yearlySchedule
      .map(
        (
          originalYear,
          index
        ) => {
          const floatingYear =
            floatingYearlySchedule[
              index
            ];

          return {
            year:
              originalYear.year,

            originalPrincipalPaid:
              originalYear
                .principalPaid,

            floatingPrincipalPaid:
              floatingYear
                ?.principalPaid ??
              0,

            originalInterestPaid:
              originalYear
                .interestPaid,

            floatingInterestPaid:
              floatingYear
                ?.interestPaid ??
              0,

            originalTotalPayment:
              originalYear
                .totalPayment,

            floatingTotalPayment:
              floatingYear
                ?.totalPayment ??
              0,

            originalEndingBalance:
              originalYear
                .endingBalance,

            floatingEndingBalance:
              floatingYear
                ?.endingBalance ??
              0,
          };
        }
      );

  return {
    loanAmount:
      P,

    originalRate:
      startingRate,

    newRate:
      changedRate,

    rateChange:
      Number(
        (
          changedRate -
          startingRate
        ).toFixed(2)
      ),

    tenureMonths:
      totalMonths,

    changeAfterMonths:
      changeMonth,

    remainingMonths,

    remainingBalance,

    principalPaidBeforeChange:
      Number(
        principalPaidBeforeChange.toFixed(
          2
        )
      ),

    interestPaidBeforeChange:
      Number(
        interestPaidBeforeChange.toFixed(
          2
        )
      ),

    originalScenario: {
      emi:
        originalEMI,

      totalInterest:
        originalSchedule
          .totalInterest,

      totalPayment:
        originalSchedule
          .totalPayment,

      yearlySchedule:
        originalSchedule
          .yearlySchedule,
    },

    floatingScenario: {
      newEMI,

      emiDifference:
        Number(
          emiDifference.toFixed(
            2
          )
        ),

      totalInterest:
        Number(
          revisedTotalInterest.toFixed(
            2
          )
        ),

      totalPayment:
        Number(
          revisedTotalPayment.toFixed(
            2
          )
        ),

      interestDifference:
        Number(
          interestDifference.toFixed(
            2
          )
        ),

      paymentDifference:
        Number(
          paymentDifference.toFixed(
            2
          )
        ),

      yearlySchedule:
        floatingYearlySchedule,
    },

    comparisonYearlySchedule,

    monthlySchedule:
      combinedMonthlySchedule,
  };
};

export const checkBasicEligibility = ({
  product,
  monthlyIncome,
  creditScore,
  age,
  requestedLoanAmount,
  tenureMonths,
}) => {
  const reasons = [];

  let eligible = true;

  if (
    product.minIncome &&
    Number(monthlyIncome) <
      product.minIncome
  ) {
    eligible = false;

    reasons.push(
      `Minimum income is ${product.minIncome}.`
    );
  }

  if (
    product.minCreditScore &&
    creditScore &&
    Number(creditScore) <
      product.minCreditScore
  ) {
    eligible = false;

    reasons.push(
      `Minimum credit score is ${product.minCreditScore}.`
    );
  }

  if (
    product.minAge &&
    age &&
    Number(age) <
      product.minAge
  ) {
    eligible = false;

    reasons.push(
      `Minimum age is ${product.minAge}.`
    );
  }

  if (
    product.maxLoanAmount &&
    Number(
      requestedLoanAmount
    ) >
      product.maxLoanAmount
  ) {
    eligible = false;

    reasons.push(
      "Requested amount is above this product's published maximum."
    );
  }

  if (
    product.tenureMonths
      ?.max &&
    Number(tenureMonths) >
      product.tenureMonths.max
  ) {
    eligible = false;

    reasons.push(
      "Requested tenure is above this product's published maximum."
    );
  }

  if (
    product.maxAgeAtLoanEnd &&
    age
  ) {
    const tenureYears =
      Number(
        tenureMonths
      ) / 12;

    const ageAtEnd =
      Number(age) +
      tenureYears;

    if (
      ageAtEnd >
      product.maxAgeAtLoanEnd
    ) {
      eligible = false;

      reasons.push(
        `Applicant age at loan completion would exceed the published maximum age of ${product.maxAgeAtLoanEnd}.`
      );
    }
  }

  if (eligible) {
    reasons.push(
      "No published eligibility requirement stored in LoanLens was violated."
    );
  }

  return {
    eligible,
    reasons,
  };
};