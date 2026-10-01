import {
  Fragment,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import api from "../lib/api.js";

import {
  useAuth,
} from "../context/AuthContext.jsx";

function ComparisonPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    user,
    token,
  } = useAuth();

  const selectedLoan =
    location.state?.selectedLoan;

  const selectedBanks =
    location.state?.selectedBanks || [];

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [detailedMode, setDetailedMode] =
    useState(false);

  const [
    personalizedResults,
    setPersonalizedResults,
  ] = useState([]);

  const [
    calculationLoading,
    setCalculationLoading,
  ] = useState(false);

  const [
    calculationError,
    setCalculationError,
  ] = useState("");

  const [
    showPersonalizedResults,
    setShowPersonalizedResults,
  ] = useState(false);

  const [
    selectedChartBank,
    setSelectedChartBank,
  ] = useState(null);

  const [
    amortizationData,
    setAmortizationData,
  ] = useState(null);

  const [
    amortizationLoading,
    setAmortizationLoading,
  ] = useState(false);

  const [
    amortizationError,
    setAmortizationError,
  ] = useState("");

  const [
    floatingBankId,
    setFloatingBankId,
  ] = useState("");

  const [
    floatingForm,
    setFloatingForm,
  ] = useState({
    rateScenario: "min",
    customOriginalRate: "",
    newRate: "",
    changeAfterYears: "",
  });

  const [
    floatingData,
    setFloatingData,
  ] = useState(null);

  const [
    floatingLoading,
    setFloatingLoading,
  ] = useState(false);

  const [
    floatingError,
    setFloatingError,
  ] = useState("");

  const [
    saveComparisonLoading,
    setSaveComparisonLoading,
  ] = useState(false);

  const [
    saveSimulationLoading,
    setSaveSimulationLoading,
  ] = useState(false);

  const [
    comparisonSaveMessage,
    setComparisonSaveMessage,
  ] = useState("");

  const [
    simulationSaveMessage,
    setSimulationSaveMessage,
  ] = useState("");

  const [formData, setFormData] =
    useState({
      loanAmount: "",
      tenureYears: "",
      monthlyIncome: "",
      existingEMIs: "",
      age: "",
      creditScore: "",
    });

  useEffect(() => {
    const fetchProducts = async () => {
      if (
        !selectedLoan ||
        selectedBanks.length === 0
      ) {
        setLoading(false);
        return;
      }

      try {
        const bankIds =
          selectedBanks
            .map((bank) => bank._id)
            .join(",");

        const response =
          await api.get(
            "/loan-products",
            {
              params: {
                loanType:
                  selectedLoan.slug,
                bankIds,
              },
            }
          );

        setProducts(
          response.data.products || []
        );
      } catch (err) {
        console.error(err);

        setError(
          "Could not load loan comparison data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    selectedLoan,
    selectedBanks,
  ]);

  const productMap =
    useMemo(() => {
      const map = {};

      products.forEach(
        (product) => {
          const bankId =
            product.bankId?._id;

          if (bankId) {
            map[bankId] =
              product;
          }
        }
      );

      return map;
    }, [products]);

  const personalizedMap =
    useMemo(() => {
      const map = {};

      personalizedResults.forEach(
        (result) => {
          const bankId =
            result.bank?._id;

          if (bankId) {
            map[bankId] =
              result;
          }
        }
      );

      return map;
    }, [personalizedResults]);

  const availableFloatingBanks =
    useMemo(
      () =>
        selectedBanks.filter(
          (bank) =>
            personalizedMap[
              bank._id
            ]?.calculationAvailable
        ),
      [
        selectedBanks,
        personalizedMap,
      ]
    );

  const formatMoney = (value) => {
    if (
      value === null ||
      value === undefined ||
      Number.isNaN(Number(value))
    ) {
      return "Not available";
    }

    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    ).format(value);
  };

  const formatCompactMoney = (
    value
  ) => {
    if (
      value === null ||
      value === undefined
    ) {
      return "";
    }

    return new Intl.NumberFormat(
      "en-IN",
      {
        notation: "compact",
        maximumFractionDigits: 1,
      }
    ).format(value);
  };

  const formatSignedMoney = (
    value
  ) => {
    if (
      value === null ||
      value === undefined
    ) {
      return "Not available";
    }

    const number =
      Number(value);

    if (number === 0) {
      return formatMoney(0);
    }

    return `${
      number > 0 ? "+" : "-"
    }${formatMoney(
      Math.abs(number)
    )}`;
  };

  const formatMoneyRange = (
    range
  ) => {
    if (
      !range ||
      range.min === null ||
      range.min === undefined
    ) {
      return "Not available";
    }

    if (
      range.max === null ||
      range.max === undefined ||
      Number(range.min) ===
        Number(range.max)
    ) {
      return formatMoney(
        range.min
      );
    }

    return `${formatMoney(
      range.min
    )} – ${formatMoney(
      range.max
    )}`;
  };

  const formatPercentRange = (
    range
  ) => {
    if (
      !range ||
      range.min === null ||
      range.min === undefined
    ) {
      return "Not available";
    }

    if (
      range.max === null ||
      range.max === undefined ||
      Number(range.min) ===
        Number(range.max)
    ) {
      return `${range.min}%`;
    }

    return `${range.min}% – ${range.max}%`;
  };

  const formatTenure = (
    tenureMonths
  ) => {
    if (
      !tenureMonths ||
      (
        tenureMonths.min == null &&
        tenureMonths.max == null
      )
    ) {
      return "Not published";
    }

    const min =
      tenureMonths.min;

    const max =
      tenureMonths.max;

    if (
      min != null &&
      max != null
    ) {
      return `${min} - ${max} months`;
    }

    if (max != null) {
      return `Up to ${max} months`;
    }

    return `${min}+ months`;
  };

  const formatRate = (
    product
  ) => {
    if (!product) {
      return "Not available";
    }

    const min =
      product.interestRate
        ?.min;

    const max =
      product.interestRate
        ?.max;

    if (
      min != null &&
      max != null
    ) {
      return `${min}% - ${max}%`;
    }

    if (min != null) {
      return `Starting from ${min}%`;
    }

    return (
      product.interestRate
        ?.displayText ||
      "Not published"
    );
  };

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "Not available";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getProductValue = (
    product,
    type
  ) => {
    if (!product) {
      return "No data";
    }

    switch (type) {
      case "rate":
        return formatRate(product);

      case "processingFee":
        return (
          product.processingFee ||
          "Not published"
        );

      case "tenure":
        return formatTenure(
          product.tenureMonths
        );

      case "minLoan":
        return product.minLoanAmount
          ? formatMoney(
              product.minLoanAmount
            )
          : "Not published";

      case "maxLoan":
        return product.maxLoanAmount
          ? formatMoney(
              product.maxLoanAmount
            )
          : "Not published";

      case "creditScore":
        return product.minCreditScore
          ? `${product.minCreditScore}+`
          : "Not published";

      case "income":
        return product.minIncome
          ? `${formatMoney(
              product.minIncome
            )} / month`
          : "Not published";

      case "ltv":
        return product.maxLTV
          ? `Up to ${product.maxLTV}%`
          : "Not applicable / not published";

      case "minAge":
        return product.minAge
          ? `${product.minAge} years`
          : "Not published";

      case "maxAge":
        return product.maxAgeAtLoanEnd
          ? `${product.maxAgeAtLoanEnd} years`
          : "Not published";

      case "prepayment":
        return (
          product.prepaymentRules ||
          "Not published"
        );

      case "eligibility":
        return (
          product.eligibilityNotes ||
          "Not published"
        );

      case "features":
        return product
          .specialFeatures
          ?.length
          ? product.specialFeatures.join(
              " • "
            )
          : "Not published";

      case "verified":
        return formatDate(
          product.lastVerified
        );

      default:
        return "Not available";
    }
  };

  const getPersonalizedValue = (
    result,
    type
  ) => {
    if (!result) {
      return "Not calculated";
    }

    if (
      !result.calculationAvailable
    ) {
      if (
        type ===
        "eligibilityResult"
      ) {
        return result.eligibility
          ?.eligible
          ? "Basic requirements passed"
          : "Some stored requirements were not met";
      }

      if (
        type ===
        "eligibilityReasons"
      ) {
        return (
          result.eligibility
            ?.reasons?.join(" ") ||
          "Rate-based calculation unavailable."
        );
      }

      return "—";
    }

    switch (type) {
      case "rateUsed":
        return formatPercentRange(
          result.rateRange
        );

      case "emi":
        return formatMoneyRange(
          result.emiRange
        );

      case "totalInterest":
        return formatMoneyRange(
          result.totalInterestRange
        );

      case "totalPayment":
        return formatMoneyRange(
          result.totalPaymentRange
        );

      case "foir":
        return formatPercentRange(
          result.foirRange
        );

      case "maxAffordableEMI":
        return formatMoney(
          result.maxAffordableEMI
        );

      case "maxLoanByFOIR":
        return formatMoneyRange(
          result.maxLoanByFOIRRange
        );

      case "eligibilityResult": {
        const status =
          result.eligibility
            ?.status;

        if (
          status ===
          "eligible"
        ) {
          return "Likely eligible across the calculated rate scenario";
        }

        if (
          status ===
          "rate-dependent"
        ) {
          return "Eligibility may depend on the final interest rate";
        }

        return "May not meet the stored requirements";
      }

      case "eligibilityReasons":
        return result.eligibility
          ?.reasons?.length
          ? result.eligibility.reasons.join(
              " "
            )
          : "No explanation available.";

      default:
        return "Not available";
    }
  };

  const quickRows = [
    {
      label: "Interest Rate",
      key: "rate",
    },
    {
      label: "Processing Fee",
      key: "processingFee",
    },
    {
      label: "Tenure",
      key: "tenure",
    },
    {
      label: "Maximum Loan",
      key: "maxLoan",
    },
    {
      label: "Credit Score",
      key: "creditScore",
    },
  ];

  const detailedRows = [
    ...quickRows,
    {
      label: "Minimum Loan",
      key: "minLoan",
    },
    {
      label: "Minimum Income",
      key: "income",
    },
    {
      label: "Maximum LTV",
      key: "ltv",
    },
    {
      label: "Minimum Age",
      key: "minAge",
    },
    {
      label:
        "Maximum Age at Loan End",
      key: "maxAge",
    },
    {
      label: "Prepayment Rules",
      key: "prepayment",
    },
    {
      label: "Eligibility Notes",
      key: "eligibility",
    },
    {
      label: "Special Features",
      key: "features",
    },
    {
      label: "Last Verified",
      key: "verified",
    },
  ];

  const personalizedRows = [
    {
      label: "Rate Used",
      key: "rateUsed",
    },
    {
      label:
        "Estimated Monthly EMI",
      key: "emi",
    },
    {
      label:
        "Estimated Total Interest",
      key: "totalInterest",
    },
    {
      label:
        "Estimated Total Repayment",
      key: "totalPayment",
    },
    {
      label: "Estimated FOIR",
      key: "foir",
    },
    {
      label:
        "Maximum Affordable EMI",
      key: "maxAffordableEMI",
    },
    {
      label:
        "Estimated Maximum Loan by FOIR",
      key: "maxLoanByFOIR",
    },
    {
      label:
        "Eligibility Result",
      key: "eligibilityResult",
    },
    {
      label:
        "Eligibility Explanation",
      key: "eligibilityReasons",
    },
  ];

  const rows =
    detailedMode
      ? detailedRows
      : quickRows;

  const handleInputChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  const handleCalculate =
    async (event) => {
      event.preventDefault();

      setCalculationError("");
      setComparisonSaveMessage("");

      setAmortizationData(null);
      setSelectedChartBank(null);

      setFloatingData(null);
      setFloatingError("");
      setSimulationSaveMessage("");

      if (
        !formData.loanAmount ||
        !formData.tenureYears ||
        !formData.monthlyIncome
      ) {
        setCalculationError(
          "Loan amount, tenure and monthly income are required."
        );

        return;
      }

      const loanAmount =
        Number(
          formData.loanAmount
        );

      const tenureYears =
        Number(
          formData.tenureYears
        );

      const monthlyIncome =
        Number(
          formData.monthlyIncome
        );

      const existingEMIs =
        Number(
          formData.existingEMIs ||
            0
        );

      const age =
        formData.age
          ? Number(
              formData.age
            )
          : null;

      const creditScore =
        formData.creditScore
          ? Number(
              formData.creditScore
            )
          : null;

      if (
        loanAmount <= 0 ||
        tenureYears <= 0 ||
        monthlyIncome <= 0
      ) {
        setCalculationError(
          "Please enter valid positive values."
        );

        return;
      }

      if (
        creditScore &&
        (
          creditScore < 300 ||
          creditScore > 900
        )
      ) {
        setCalculationError(
          "Credit score should be between 300 and 900."
        );

        return;
      }

      try {
        setCalculationLoading(true);

        const response =
          await api.post(
            "/calculations/compare",
            {
              loanType:
                selectedLoan.slug,

              bankIds:
                selectedBanks.map(
                  (bank) =>
                    bank._id
                ),

              loanAmount,

              tenureMonths:
                tenureYears * 12,

              monthlyIncome,

              existingEMIs,

              age,

              creditScore,
            }
          );

        const results =
          response.data.results ||
          [];

        setPersonalizedResults(
          results
        );

        setShowPersonalizedResults(
          true
        );

        const firstAvailable =
          results.find(
            (result) =>
              result.calculationAvailable
          );

        if (firstAvailable) {
          setFloatingBankId(
            firstAvailable.bank._id
          );
        }
      } catch (err) {
        console.error(err);

        setCalculationError(
          err.response?.data
            ?.message ||
            "Could not calculate personalized comparison."
        );
      } finally {
        setCalculationLoading(
          false
        );
      }
    };

  const handleSaveComparison =
    async () => {
      setComparisonSaveMessage("");

      if (!user || !token) {
        navigate("/login");
        return;
      }

      if (
        !showPersonalizedResults ||
        personalizedResults.length === 0
      ) {
        setComparisonSaveMessage(
          "Calculate the comparison first."
        );

        return;
      }

      try {
        setSaveComparisonLoading(
          true
        );

        await api.post(
          "/saved-comparisons",
          {
            title:
              `${selectedLoan.name} Comparison`,

            loanType: {
              name:
                selectedLoan.name,

              slug:
                selectedLoan.slug,
            },

            banks:
              selectedBanks.map(
                (bank) => ({
                  bankId:
                    bank._id,

                  name:
                    bank.name,
                })
              ),

            inputs: {
              loanAmount:
                Number(
                  formData.loanAmount
                ),

              tenureMonths:
                Number(
                  formData.tenureYears
                ) * 12,

              monthlyIncome:
                Number(
                  formData.monthlyIncome
                ),

              existingEMIs:
                Number(
                  formData.existingEMIs ||
                    0
                ),

              age:
                formData.age
                  ? Number(
                      formData.age
                    )
                  : null,

              creditScore:
                formData.creditScore
                  ? Number(
                      formData.creditScore
                    )
                  : null,
            },

            results:
              personalizedResults,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setComparisonSaveMessage(
          "Comparison saved successfully."
        );
      } catch (err) {
        console.error(err);

        setComparisonSaveMessage(
          err.response?.data
            ?.message ||
            "Could not save comparison."
        );
      } finally {
        setSaveComparisonLoading(
          false
        );
      }
    };

  const handleGenerateAmortization =
    async (bank) => {
      const result =
        personalizedMap[
          bank._id
        ];

      if (
        !result ||
        !result.calculationAvailable
      ) {
        setAmortizationError(
          "Repayment analysis cannot be generated because a numeric rate is unavailable."
        );

        return;
      }

      try {
        setAmortizationLoading(true);

        setAmortizationError("");

        setSelectedChartBank(
          bank
        );

        const response =
          await api.post(
            "/calculations/amortization",
            {
              loanAmount:
                Number(
                  formData.loanAmount
                ),

              minRate:
                result.rateRange.min,

              maxRate:
                result.rateRange.max,

              tenureMonths:
                Number(
                  formData.tenureYears
                ) * 12,
            }
          );

        setAmortizationData(
          response.data
        );

        setTimeout(() => {
          document
            .getElementById(
              "amortization-section"
            )
            ?.scrollIntoView({
              behavior: "smooth",
            });
        }, 100);
      } catch (err) {
        console.error(err);

        setAmortizationError(
          err.response?.data
            ?.message ||
            "Could not generate repayment analysis."
        );
      } finally {
        setAmortizationLoading(
          false
        );
      }
    };

  const getSelectedFloatingResult =
    () =>
      personalizedMap[
        floatingBankId
      ];

  const getSelectedFloatingBank =
    () =>
      selectedBanks.find(
        (bank) =>
          bank._id ===
          floatingBankId
      );

  const getFloatingOriginalRate =
    () => {
      const result =
        getSelectedFloatingResult();

      if (
        !result ||
        !result.calculationAvailable
      ) {
        return null;
      }

      if (
        floatingForm.rateScenario ===
        "max"
      ) {
        return result.rateRange.max;
      }

      if (
        floatingForm.rateScenario ===
        "custom"
      ) {
        return Number(
          floatingForm.customOriginalRate
        );
      }

      return result.rateRange.min;
    };

  const handleFloatingInputChange =
    (event) => {
      const {
        name,
        value,
      } = event.target;

      setFloatingForm(
        (previous) => ({
          ...previous,
          [name]: value,
        })
      );

      setFloatingData(null);
      setFloatingError("");
      setSimulationSaveMessage("");
    };

  const handleFloatingSimulation =
    async (event) => {
      event.preventDefault();

      setFloatingError("");
      setFloatingData(null);
      setSimulationSaveMessage("");

      const originalRate =
        getFloatingOriginalRate();

      const newRate =
        Number(
          floatingForm.newRate
        );

      const changeAfterYears =
        Number(
          floatingForm.changeAfterYears
        );

      const tenureYears =
        Number(
          formData.tenureYears
        );

      if (!floatingBankId) {
        setFloatingError(
          "Select a bank first."
        );

        return;
      }

      if (
        !originalRate ||
        originalRate <= 0
      ) {
        setFloatingError(
          "Enter a valid original interest rate."
        );

        return;
      }

      if (
        !newRate ||
        newRate <= 0
      ) {
        setFloatingError(
          "Enter a valid new interest rate."
        );

        return;
      }

      if (
        !changeAfterYears ||
        changeAfterYears <= 0 ||
        changeAfterYears >=
          tenureYears
      ) {
        setFloatingError(
          `Rate change must happen after more than 0 years and before the full ${tenureYears}-year tenure ends.`
        );

        return;
      }

      try {
        setFloatingLoading(true);

        const response =
          await api.post(
            "/calculations/floating-rate",
            {
              loanAmount:
                Number(
                  formData.loanAmount
                ),

              originalRate,

              newRate,

              tenureMonths:
                tenureYears * 12,

              changeAfterMonths:
                changeAfterYears *
                12,
            }
          );

        setFloatingData(
          response.data
        );

        setTimeout(() => {
          document
            .getElementById(
              "floating-results"
            )
            ?.scrollIntoView({
              behavior: "smooth",
            });
        }, 100);
      } catch (err) {
        console.error(err);

        setFloatingError(
          err.response?.data
            ?.error ||
            err.response?.data
              ?.message ||
            "Could not calculate floating-rate scenario."
        );
      } finally {
        setFloatingLoading(
          false
        );
      }
    };

  const handleSaveFloatingSimulation =
    async () => {
      setSimulationSaveMessage("");

      if (!user || !token) {
        navigate("/login");
        return;
      }

      if (!floatingData) {
        setSimulationSaveMessage(
          "Run the simulation first."
        );

        return;
      }

      const bank =
        getSelectedFloatingBank();

      try {
        setSaveSimulationLoading(
          true
        );

        await api.post(
          "/saved-simulations",
          {
            title:
              `${bank?.name || "Bank"} Floating Rate Simulation`,

            simulationType:
              "floating-rate",

            loanType: {
              name:
                selectedLoan.name,

              slug:
                selectedLoan.slug,
            },

            bank: {
              bankId:
                bank?._id ||
                null,

              name:
                bank?.name ||
                "",
            },

            inputs: {
              loanAmount:
                Number(
                  formData.loanAmount
                ),

              originalRate:
                floatingData.originalRate,

              newRate:
                floatingData.newRate,

              tenureMonths:
                Number(
                  formData.tenureYears
                ) * 12,

              changeAfterMonths:
                floatingData.changeAfterMonths,
            },

            results:
              floatingData,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setSimulationSaveMessage(
          "Floating-rate simulation saved successfully."
        );
      } catch (err) {
        console.error(err);

        setSimulationSaveMessage(
          err.response?.data
            ?.message ||
            "Could not save simulation."
        );
      } finally {
        setSaveSimulationLoading(
          false
        );
      }
    };

  const handleBankSelect = (
    bank
  ) => {
    navigate(
      "/documents",
      {
        state: {
          selectedLoan,
          selectedBank:
            bank,
        },
      }
    );
  };

  if (
    !selectedLoan ||
    selectedBanks.length === 0
  ) {
    return (
      <div className="comparison-page">
        <div className="comparison-container">
          <h1>
            No comparison selected
          </h1>

          <p>
            Choose a loan type and at
            least one bank first.
          </p>

          <button
            className="primary-button"
            onClick={() =>
              navigate("/")
            }
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="status-screen">
        <h2>
          Loading comparison...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-screen">
        <div>
          <h2>
            {error}
          </h2>

          <button
            className="primary-button"
            onClick={() =>
              navigate(-1)
            }
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="comparison-page">
      <div className="comparison-container">
        <button
          className="back-button"
          onClick={() =>
            navigate(-1)
          }
        >
          ← Back
        </button>

        <p className="eyebrow">
          Loan comparison
        </p>

        <h1>
          {selectedLoan.name}
        </h1>

        <p className="comparison-intro">
          Compare published bank
          information, calculate your
          personalized repayment range,
          inspect amortization and test
          what happens if a floating
          interest rate changes later.
        </p>

        <section className="personalized-comparison-card">
          <div className="personalized-heading">
            <p className="eyebrow">
              Personalized comparison
            </p>

            <h2>
              Enter your loan details
            </h2>

            <p>
              Where banks publish both
              minimum and maximum rates,
              LoanLens calculates both
              scenarios.
            </p>
          </div>

          <form
            className="personalized-form"
            onSubmit={
              handleCalculate
            }
          >
            <div className="form-field">
              <label htmlFor="loanAmount">
                Loan Amount
              </label>

              <input
                id="loanAmount"
                name="loanAmount"
                type="number"
                min="1"
                placeholder="e.g. 3000000"
                value={
                  formData.loanAmount
                }
                onChange={
                  handleInputChange
                }
              />
            </div>

            <div className="form-field">
              <label htmlFor="tenureYears">
                Tenure (Years)
              </label>

              <input
                id="tenureYears"
                name="tenureYears"
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 20"
                value={
                  formData.tenureYears
                }
                onChange={
                  handleInputChange
                }
              />
            </div>

            <div className="form-field">
              <label htmlFor="monthlyIncome">
                Monthly Income
              </label>

              <input
                id="monthlyIncome"
                name="monthlyIncome"
                type="number"
                min="1"
                placeholder="e.g. 100000"
                value={
                  formData.monthlyIncome
                }
                onChange={
                  handleInputChange
                }
              />
            </div>

            <div className="form-field">
              <label htmlFor="existingEMIs">
                Existing Monthly EMIs
              </label>

              <input
                id="existingEMIs"
                name="existingEMIs"
                type="number"
                min="0"
                placeholder="e.g. 10000"
                value={
                  formData.existingEMIs
                }
                onChange={
                  handleInputChange
                }
              />
            </div>

            <div className="form-field">
              <label htmlFor="age">
                Age
              </label>

              <input
                id="age"
                name="age"
                type="number"
                min="18"
                max="100"
                placeholder="e.g. 30"
                value={
                  formData.age
                }
                onChange={
                  handleInputChange
                }
              />
            </div>

            <div className="form-field">
              <label htmlFor="creditScore">
                Credit Score
              </label>

              <input
                id="creditScore"
                name="creditScore"
                type="number"
                min="300"
                max="900"
                placeholder="e.g. 780"
                value={
                  formData.creditScore
                }
                onChange={
                  handleInputChange
                }
              />
            </div>

            <button
              type="submit"
              className="calculate-comparison-button"
              disabled={
                calculationLoading
              }
            >
              {calculationLoading
                ? "Calculating..."
                : "Calculate My Comparison"}
            </button>
          </form>

          {calculationError && (
            <div className="calculation-error">
              {
                calculationError
              }
            </div>
          )}

          <div className="calculation-info">
            Indicative calculations only.
            Actual rates and approval are
            determined by the lender.
          </div>
        </section>

        {showPersonalizedResults && (
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginBottom: "22px",
              alignItems: "center",
            }}
          >
            <button
              type="button"
              className="primary-button"
              onClick={
                handleSaveComparison
              }
              disabled={
                saveComparisonLoading
              }
            >
              {saveComparisonLoading
                ? "Saving..."
                : user
                  ? "Save This Comparison"
                  : "Login to Save Comparison"}
            </button>

            {user && (
              <button
                type="button"
                className="change-loan-button"
                onClick={() =>
                  navigate("/saved")
                }
              >
                View My Saved
              </button>
            )}

            {comparisonSaveMessage && (
              <strong>
                {
                  comparisonSaveMessage
                }
              </strong>
            )}
          </div>
        )}

        <div className="comparison-toolbar">
          <div>
            <strong>
              {
                selectedBanks.length
              }
            </strong>{" "}
            banks selected
          </div>

          <div className="comparison-mode-buttons">
            <button
              className={
                !detailedMode
                  ? "mode-button active"
                  : "mode-button"
              }
              onClick={() =>
                setDetailedMode(
                  false
                )
              }
            >
              Quick Compare
            </button>

            <button
              className={
                detailedMode
                  ? "mode-button active"
                  : "mode-button"
              }
              onClick={() =>
                setDetailedMode(
                  true
                )
              }
            >
              Detailed Compare
            </button>
          </div>
        </div>

        <div className="spec-comparison-wrapper">
          <table className="spec-comparison-table">
            <thead>
              <tr>
                <th className="spec-label-column">
                  Compare
                </th>

                {selectedBanks.map(
                  (bank) => (
                    <th
                      key={
                        bank._id
                      }
                      className="bank-column-header"
                    >
                      <div className="comparison-bank-header">
                        {bank.logoUrl ? (
                          <img
                            src={
                              bank.logoUrl
                            }
                            alt={`${bank.name} logo`}
                            className="comparison-bank-logo"
                          />
                        ) : (
                          <div className="comparison-bank-logo-placeholder">
                            {bank.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}

                        <strong>
                          {
                            bank.name
                          }
                        </strong>

                        <span>
                          {
                            productMap[
                              bank._id
                            ]?.productName
                          }
                        </span>
                      </div>
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {showPersonalizedResults && (
                <>
                  <tr className="personalized-section-row">
                    <th
                      colSpan={
                        selectedBanks.length +
                        1
                      }
                    >
                      Your Personalized
                      Estimates
                    </th>
                  </tr>

                  {personalizedRows.map(
                    (row) => (
                      <tr
                        key={
                          row.key
                        }
                        className="personalized-result-row"
                      >
                        <th className="spec-row-label personalized-label">
                          {
                            row.label
                          }
                        </th>

                        {selectedBanks.map(
                          (bank) => (
                            <td
                              key={`${bank._id}-${row.key}`}
                            >
                              {getPersonalizedValue(
                                personalizedMap[
                                  bank._id
                                ],
                                row.key
                              )}
                            </td>
                          )
                        )}
                      </tr>
                    )
                  )}

                  <tr className="personalized-result-row">
                    <th className="spec-row-label personalized-label">
                      Repayment Analysis
                    </th>

                    {selectedBanks.map(
                      (bank) => {
                        const result =
                          personalizedMap[
                            bank._id
                          ];

                        const available =
                          result
                            ?.calculationAvailable;

                        return (
                          <td
                            key={`${bank._id}-amortization`}
                          >
                            <button
                              className="amortization-button"
                              disabled={
                                !available ||
                                amortizationLoading
                              }
                              onClick={() =>
                                handleGenerateAmortization(
                                  bank
                                )
                              }
                            >
                              {!available
                                ? "Unavailable"
                                : "View Repayment Chart"}
                            </button>
                          </td>
                        );
                      }
                    )}
                  </tr>
                </>
              )}

              <tr className="product-section-row">
                <th
                  colSpan={
                    selectedBanks.length +
                    1
                  }
                >
                  Published Bank Product
                  Details
                </th>
              </tr>

              {rows.map(
                (row) => (
                  <tr key={row.key}>
                    <th className="spec-row-label">
                      {row.label}
                    </th>

                    {selectedBanks.map(
                      (bank) => (
                        <td
                          key={`${bank._id}-${row.key}`}
                        >
                          {getProductValue(
                            productMap[
                              bank._id
                            ],
                            row.key
                          )}
                        </td>
                      )
                    )}
                  </tr>
                )
              )}

              <tr className="select-bank-row">
                <th className="spec-row-label">
                  Continue
                </th>

                {selectedBanks.map(
                  (bank) => (
                    <td
                      key={`${bank._id}-continue`}
                    >
                      <button
                        className="select-bank-button full-width"
                        onClick={() =>
                          handleBankSelect(
                            bank
                          )
                        }
                      >
                        Select Bank
                      </button>
                    </td>
                  )
                )}
              </tr>
            </tbody>
          </table>
        </div>

        {amortizationError && (
          <div className="calculation-error">
            {amortizationError}
          </div>
        )}

        {amortizationData &&
          selectedChartBank && (
            <section
              id="amortization-section"
              className="amortization-section"
            >
              <div className="amortization-heading">
                <div>
                  <p className="eyebrow">
                    Repayment analysis
                  </p>

                  <h2>
                    {
                      selectedChartBank.name
                    }{" "}
                    Repayment Range
                  </h2>
                </div>

                <button
                  className="close-chart-button"
                  onClick={() => {
                    setAmortizationData(
                      null
                    );

                    setSelectedChartBank(
                      null
                    );
                  }}
                >
                  Close
                </button>
              </div>

              <div className="amortization-summary-grid">
                <div className="amortization-stat">
                  <span>
                    Loan Amount
                  </span>

                  <strong>
                    {formatMoney(
                      amortizationData.loanAmount
                    )}
                  </strong>
                </div>

                <div className="amortization-stat">
                  <span>
                    Rate
                  </span>

                  <strong>
                    {amortizationData.hasRateRange
                      ? `${amortizationData.minRate}% – ${amortizationData.maxRate}%`
                      : `${amortizationData.minRate}%`}
                  </strong>
                </div>

                <div className="amortization-stat">
                  <span>
                    Monthly EMI
                  </span>

                  <strong>
                    {amortizationData.hasRateRange
                      ? `${formatMoney(
                          amortizationData.minScenario.emi
                        )} – ${formatMoney(
                          amortizationData.maxScenario.emi
                        )}`
                      : formatMoney(
                          amortizationData.minScenario.emi
                        )}
                  </strong>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-heading">
                  <h3>
                    Principal vs Interest
                  </h3>
                </div>

                <div className="chart-container">
                  <ResponsiveContainer
                    width="100%"
                    height={400}
                  >
                    <BarChart
                      data={
                        amortizationData.yearlySchedule
                      }
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                      />

                      <XAxis
                        dataKey="year"
                      />

                      <YAxis
                        tickFormatter={
                          formatCompactMoney
                        }
                      />

                      <Tooltip
                        formatter={(
                          value
                        ) =>
                          formatMoney(
                            value
                          )
                        }
                      />

                      <Legend />

                      <Bar
                        dataKey="minPrincipalPaid"
                        name="Min Rate Principal"
                      />

                      <Bar
                        dataKey="minInterestPaid"
                        name="Min Rate Interest"
                      />

                      {amortizationData.hasRateRange && (
                        <>
                          <Bar
                            dataKey="maxPrincipalPaid"
                            name="Max Rate Principal"
                          />

                          <Bar
                            dataKey="maxInterestPaid"
                            name="Max Rate Interest"
                          />
                        </>
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-heading">
                  <h3>
                    Remaining Balance
                  </h3>
                </div>

                <div className="chart-container">
                  <ResponsiveContainer
                    width="100%"
                    height={400}
                  >
                    <LineChart
                      data={
                        amortizationData.yearlySchedule
                      }
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                      />

                      <XAxis
                        dataKey="year"
                      />

                      <YAxis
                        tickFormatter={
                          formatCompactMoney
                        }
                      />

                      <Tooltip
                        formatter={(
                          value
                        ) =>
                          formatMoney(
                            value
                          )
                        }
                      />

                      <Legend />

                      <Line
                        type="monotone"
                        dataKey="minEndingBalance"
                        name="Min Rate Balance"
                        strokeWidth={3}
                      />

                      {amortizationData.hasRateRange && (
                        <Line
                          type="monotone"
                          dataKey="maxEndingBalance"
                          name="Max Rate Balance"
                          strokeWidth={3}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="yearly-table-wrapper">
                <table className="yearly-table">
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Rate Scenario</th>
                      <th>Principal</th>
                      <th>Interest</th>
                      <th>Total Paid</th>
                      <th>Balance</th>
                    </tr>
                  </thead>

                  <tbody>
                    {amortizationData.yearlySchedule.map(
                      (row) => (
                        <Fragment
                          key={
                            row.year
                          }
                        >
                          <tr>
                            <td>
                              {row.year}
                            </td>

                            <td>
                              Min{" "}
                              {
                                amortizationData.minRate
                              }
                              %
                            </td>

                            <td>
                              {formatMoney(
                                row.minPrincipalPaid
                              )}
                            </td>

                            <td>
                              {formatMoney(
                                row.minInterestPaid
                              )}
                            </td>

                            <td>
                              {formatMoney(
                                row.minTotalPayment
                              )}
                            </td>

                            <td>
                              {formatMoney(
                                row.minEndingBalance
                              )}
                            </td>
                          </tr>

                          {amortizationData.hasRateRange && (
                            <tr className="max-rate-table-row">
                              <td>
                                {row.year}
                              </td>

                              <td>
                                Max{" "}
                                {
                                  amortizationData.maxRate
                                }
                                %
                              </td>

                              <td>
                                {formatMoney(
                                  row.maxPrincipalPaid
                                )}
                              </td>

                              <td>
                                {formatMoney(
                                  row.maxInterestPaid
                                )}
                              </td>

                              <td>
                                {formatMoney(
                                  row.maxTotalPayment
                                )}
                              </td>

                              <td>
                                {formatMoney(
                                  row.maxEndingBalance
                                )}
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

        {showPersonalizedResults &&
          availableFloatingBanks.length >
            0 && (
            <section className="floating-rate-section">
              <div className="floating-rate-heading">
                <p className="eyebrow">
                  What-if simulator
                </p>

                <h2>
                  Floating-Rate Simulator
                </h2>

                <p>
                  See how your EMI and
                  lifetime loan cost could
                  change if the interest
                  rate changes during the
                  loan.
                </p>
              </div>

              <form
                className="floating-rate-form"
                onSubmit={
                  handleFloatingSimulation
                }
              >
                <div className="form-field">
                  <label>
                    Bank
                  </label>

                  <select
                    value={
                      floatingBankId
                    }
                    onChange={(
                      event
                    ) => {
                      setFloatingBankId(
                        event.target.value
                      );

                      setFloatingData(
                        null
                      );
                    }}
                  >
                    {availableFloatingBanks.map(
                      (bank) => (
                        <option
                          key={
                            bank._id
                          }
                          value={
                            bank._id
                          }
                        >
                          {bank.name}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="form-field">
                  <label>
                    Original Rate
                  </label>

                  <select
                    name="rateScenario"
                    value={
                      floatingForm.rateScenario
                    }
                    onChange={
                      handleFloatingInputChange
                    }
                  >
                    <option value="min">
                      Published Minimum
                    </option>

                    {getSelectedFloatingResult()
                      ?.hasRateRange && (
                      <option value="max">
                        Published Maximum
                      </option>
                    )}

                    <option value="custom">
                      Custom Rate
                    </option>
                  </select>
                </div>

                {floatingForm.rateScenario ===
                  "custom" && (
                  <div className="form-field">
                    <label>
                      Custom Original Rate
                    </label>

                    <input
                      name="customOriginalRate"
                      type="number"
                      step="0.01"
                      value={
                        floatingForm.customOriginalRate
                      }
                      onChange={
                        handleFloatingInputChange
                      }
                    />
                  </div>
                )}

                <div className="form-field">
                  <label>
                    New Rate (%)
                  </label>

                  <input
                    name="newRate"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 9.50"
                    value={
                      floatingForm.newRate
                    }
                    onChange={
                      handleFloatingInputChange
                    }
                  />
                </div>

                <div className="form-field">
                  <label>
                    Rate Changes After
                    (Years)
                  </label>

                  <input
                    name="changeAfterYears"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 2"
                    value={
                      floatingForm.changeAfterYears
                    }
                    onChange={
                      handleFloatingInputChange
                    }
                  />
                </div>

                <button
                  type="submit"
                  className="floating-simulate-button"
                  disabled={
                    floatingLoading
                  }
                >
                  {floatingLoading
                    ? "Simulating..."
                    : "Simulate Rate Change"}
                </button>
              </form>

              {floatingError && (
                <div className="calculation-error">
                  {floatingError}
                </div>
              )}

              {floatingData && (
                <div
                  id="floating-results"
                  className="floating-results"
                >
                  <div className="floating-result-heading">
                    <h3>
                      Rate Change Impact
                    </h3>

                    <p>
                      {floatingData.originalRate}%{" "}
                      →{" "}
                      {
                        floatingData.newRate
                      }
                      %
                    </p>
                  </div>

                  <div className="floating-summary-grid">
                    <div className="floating-stat">
                      <span>
                        Original EMI
                      </span>

                      <strong>
                        {formatMoney(
                          floatingData.originalScenario.emi
                        )}
                      </strong>
                    </div>

                    <div className="floating-stat">
                      <span>
                        New EMI
                      </span>

                      <strong>
                        {formatMoney(
                          floatingData.floatingScenario.newEMI
                        )}
                      </strong>
                    </div>

                    <div className="floating-stat">
                      <span>
                        EMI Difference
                      </span>

                      <strong>
                        {formatSignedMoney(
                          floatingData.floatingScenario.emiDifference
                        )}
                      </strong>
                    </div>

                    <div className="floating-stat">
                      <span>
                        Total Cost Difference
                      </span>

                      <strong>
                        {formatSignedMoney(
                          floatingData.floatingScenario.paymentDifference
                        )}
                      </strong>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                      marginTop: "22px",
                      alignItems: "center",
                    }}
                  >
                    <button
                      type="button"
                      className="primary-button"
                      onClick={
                        handleSaveFloatingSimulation
                      }
                      disabled={
                        saveSimulationLoading
                      }
                    >
                      {saveSimulationLoading
                        ? "Saving..."
                        : user
                          ? "Save Floating-Rate Simulation"
                          : "Login to Save Simulation"}
                    </button>

                    {user && (
                      <button
                        type="button"
                        className="change-loan-button"
                        onClick={() =>
                          navigate(
                            "/saved"
                          )
                        }
                      >
                        View My Saved
                      </button>
                    )}

                    {simulationSaveMessage && (
                      <strong>
                        {
                          simulationSaveMessage
                        }
                      </strong>
                    )}
                  </div>

                  <div className="chart-card">
                    <div className="chart-heading">
                      <h3>
                        Original vs
                        Floating-Rate Balance
                      </h3>
                    </div>

                    <div className="chart-container">
                      <ResponsiveContainer
                        width="100%"
                        height={400}
                      >
                        <LineChart
                          data={
                            floatingData.comparisonYearlySchedule
                          }
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                          />

                          <XAxis
                            dataKey="year"
                          />

                          <YAxis
                            tickFormatter={
                              formatCompactMoney
                            }
                          />

                          <Tooltip
                            formatter={(
                              value
                            ) =>
                              formatMoney(
                                value
                              )
                            }
                          />

                          <Legend />

                          <Line
                            type="monotone"
                            dataKey="originalEndingBalance"
                            name="Original Balance"
                            strokeWidth={3}
                          />

                          <Line
                            type="monotone"
                            dataKey="floatingEndingBalance"
                            name="Floating Balance"
                            strokeWidth={3}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="chart-card">
                    <div className="chart-heading">
                      <h3>
                        Interest Paid Each
                        Year
                      </h3>
                    </div>

                    <div className="chart-container">
                      <ResponsiveContainer
                        width="100%"
                        height={400}
                      >
                        <BarChart
                          data={
                            floatingData.comparisonYearlySchedule
                          }
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                          />

                          <XAxis
                            dataKey="year"
                          />

                          <YAxis
                            tickFormatter={
                              formatCompactMoney
                            }
                          />

                          <Tooltip
                            formatter={(
                              value
                            ) =>
                              formatMoney(
                                value
                              )
                            }
                          />

                          <Legend />

                          <Bar
                            dataKey="originalInterestPaid"
                            name="Original Interest"
                          />

                          <Bar
                            dataKey="floatingInterestPaid"
                            name="Floating Interest"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

        <div className="comparison-disclaimer">
          <strong>
            Important:
          </strong>{" "}
          LoanLens calculations are
          indicative. Actual rates,
          repayments and eligibility are
          determined by the lender.
        </div>
      </div>
    </div>
  );
}

export default ComparisonPage;