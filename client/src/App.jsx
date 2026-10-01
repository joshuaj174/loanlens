import {
  useEffect,
  useState,
} from "react";

import {
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";

import api from "./lib/api.js";

import { AuthProvider } from "./context/AuthContext.jsx";

import Navbar from "./components/Navbar.jsx";
import LoanTypeCard from "./components/LoanTypeCard.jsx";
import BankSelector from "./components/BankSelector.jsx";
import MySavedPage from "./pages/MySavedPage.jsx";
import ComparisonPage from "./pages/ComparisonPage.jsx";
import DocumentsPage from "./pages/DocumentsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [banks, setBanks] =
    useState([]);

  const [loanTypes, setLoanTypes] =
    useState([]);

  const [
    selectedLoan,
    setSelectedLoan,
  ] = useState(null);

  const [
    selectedBanks,
    setSelectedBanks,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          banksResponse,
          loanTypesResponse,
        ] = await Promise.all([
          api.get("/banks"),
          api.get("/loan-types"),
        ]);

        setBanks(
          banksResponse.data.banks
        );

        setLoanTypes(
          loanTypesResponse.data
            .loanTypes
        );
      } catch (err) {
        console.error(err);

        setError(
          "Could not load LoanLens data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (
      location.state
        ?.resetLoanSelection
    ) {
      setSelectedLoan(null);
      setSelectedBanks([]);

      setTimeout(() => {
        document
          .getElementById(
            "compare-flow"
          )
          ?.scrollIntoView({
            behavior: "smooth",
          });
      }, 100);

      navigate("/", {
        replace: true,
        state: {},
      });
    }

    if (
      location.state?.scrollToBanks
    ) {
      setTimeout(() => {
        document
          .getElementById(
            "compare-flow"
          )
          ?.scrollIntoView({
            behavior: "smooth",
          });
      }, 100);

      navigate("/", {
        replace: true,
        state: {},
      });
    }
  }, [
    location.state,
    navigate,
  ]);

  const handleLoanSelect = (
    loan
  ) => {
    setSelectedLoan(loan);
    setSelectedBanks([]);
  };

  const handleToggleBank = (
    bank
  ) => {
    const alreadySelected =
      selectedBanks.some(
        (selectedBank) =>
          selectedBank._id ===
          bank._id
      );

    if (alreadySelected) {
      setSelectedBanks(
        selectedBanks.filter(
          (selectedBank) =>
            selectedBank._id !==
            bank._id
        )
      );
    } else {
      setSelectedBanks([
        ...selectedBanks,
        bank,
      ]);
    }
  };

  const handleCompare = () => {
    navigate("/compare", {
      state: {
        selectedLoan,
        selectedBanks,
      },
    });
  };

  if (loading) {
    return (
      <div className="status-screen">
        <h2>
          Loading LoanLens...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-screen">
        <h2>
          {error}
        </h2>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar />

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              Smarter loan decisions
            </p>

            <h1>
              Compare loans before
              you commit.
            </h1>

            <p className="hero-description">
              Compare banks,
              estimate eligibility,
              calculate EMI,
              understand repayment,
              and explore loan
              options in one place.
            </p>

            <a
              className="primary-button"
              href="#compare-flow"
            >
              Start Comparing
            </a>
          </div>
        </section>

        <section
          id="compare-flow"
          className="section"
        >
          {!selectedLoan ? (
            <>
              <div className="section-heading">
                <p className="eyebrow">
                  Step 1
                </p>

                <h2>
                  Choose your loan
                  type
                </h2>

                <p>
                  Select the type
                  of loan you want
                  to explore.
                </p>
              </div>

              <div className="loan-grid">
                {loanTypes.map(
                  (loan) => (
                    <LoanTypeCard
                      key={loan._id}
                      loan={loan}
                      selected={false}
                      onSelect={
                        handleLoanSelect
                      }
                    />
                  )
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flow-header">
                <div>
                  <p className="eyebrow">
                    Step 2
                  </p>

                  <h2>
                    Choose banks for{" "}
                    {
                      selectedLoan.name
                    }
                  </h2>

                  <p>
                    Select the banks
                    you want to
                    compare.
                  </p>
                </div>

                <button
                  type="button"
                  className="change-loan-button"
                  onClick={() => {
                    setSelectedLoan(
                      null
                    );

                    setSelectedBanks(
                      []
                    );
                  }}
                >
                  Change Loan Type
                </button>
              </div>

              <BankSelector
                banks={banks}
                selectedBanks={
                  selectedBanks
                }
                onToggleBank={
                  handleToggleBank
                }
              />

              <div className="selection-summary">
                <div className="summary-card">
                  <p className="eyebrow">
                    Your selection
                  </p>

                  <h2>
                    Ready to compare
                  </h2>

                  <div className="summary-row">
                    <span>
                      Loan Type
                    </span>

                    <strong>
                      {
                        selectedLoan.name
                      }
                    </strong>
                  </div>

                  <div className="summary-row">
                    <span>
                      Banks Selected
                    </span>

                    <strong>
                      {
                        selectedBanks.length
                      }
                    </strong>
                  </div>

                  {selectedBanks.length >
                    0 && (
                    <div className="selected-bank-list">
                      {selectedBanks.map(
                        (bank) => (
                          <span
                            key={
                              bank._id
                            }
                            className="selected-bank-chip"
                          >
                            {
                              bank.name
                            }
                          </span>
                        )
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    className="compare-button"
                    disabled={
                      selectedBanks.length ===
                      0
                    }
                    onClick={
                      handleCompare
                    }
                  >
                    Compare Selected
                    Banks
                  </button>
                </div>
              </div>
            </>
          )}
        </section>

        <section
          id="about"
          className="section about-section"
        >
          <div>
            <p className="eyebrow">
              About LoanLens
            </p>

            <h2>
              Understand the loan,
              not just the rate.
            </h2>

            <p>
              LoanLens helps users
              compare loan products,
              estimate eligibility,
              calculate EMI,
              understand repayment,
              simulate prepayments,
              and explore long-term
              borrowing costs.
            </p>
          </div>
        </section>
      </main>

      <footer>
        <p>
          LoanLens — Loan
          comparison and financial
          simulation platform
        </p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/compare"
          element={
            <ComparisonPage />
          }
        />

        <Route
          path="/documents"
          element={
            <DocumentsPage />
          }
        />

        <Route
          path="/login"
          element={
            <LoginPage />
          }
        />
        <Route
          path="/saved"
          element={<MySavedPage />}
        />
        <Route
          path="/register"
          element={
            <RegisterPage />
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;