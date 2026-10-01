import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import api from "../lib/api.js";

import {
  useAuth,
} from "../context/AuthContext.jsx";

import "./MySavedPage.css";

function MySavedPage() {
  const navigate =
    useNavigate();

  const {
    user,
    token,
    loading:
      authLoading,
  } = useAuth();

  const [
    comparisons,
    setComparisons,
  ] = useState([]);

  const [
    simulations,
    setSimulations,
  ] = useState([]);

  const [
    activeTab,
    setActiveTab,
  ] = useState(
    "comparisons"
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    const loadSavedData =
      async () => {
        try {
          setLoading(true);
          setError("");

          const headers = {
            Authorization:
              `Bearer ${token}`,
          };

          const [
            comparisonResponse,
            simulationResponse,
          ] = await Promise.all([
            api.get(
              "/saved-comparisons",
              {
                headers,
              }
            ),

            api.get(
              "/saved-simulations",
              {
                headers,
              }
            ),
          ]);

          setComparisons(
            comparisonResponse
              .data
              .comparisons ||
              []
          );

          setSimulations(
            simulationResponse
              .data
              .simulations ||
              []
          );
        } catch (err) {
          console.error(err);

          setError(
            err.response?.data
              ?.message ||
              "Could not load saved items."
          );
        } finally {
          setLoading(false);
        }
      };

    loadSavedData();
  }, [
    user,
    token,
    authLoading,
    navigate,
  ]);

  const formatMoney = (
    value
  ) => {
    if (
      value === null ||
      value === undefined
    ) {
      return "—";
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

  const formatDate = (
    value
  ) => {
    if (!value) {
      return "";
    }

    return new Date(
      value
    ).toLocaleString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  const formatTenure = (
    months
  ) => {
    if (!months) {
      return "—";
    }

    const years =
      months / 12;

    return `${years} ${
      years === 1
        ? "year"
        : "years"
    }`;
  };

  const deleteComparison =
    async (id) => {
      const confirmed =
        window.confirm(
          "Delete this saved comparison?"
        );

      if (!confirmed) {
        return;
      }

      try {
        await api.delete(
          `/saved-comparisons/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setComparisons(
          (previous) =>
            previous.filter(
              (item) =>
                item._id !==
                id
            )
        );
      } catch (err) {
        console.error(err);

        alert(
          "Could not delete comparison."
        );
      }
    };

  const deleteSimulation =
    async (id) => {
      const confirmed =
        window.confirm(
          "Delete this saved simulation?"
        );

      if (!confirmed) {
        return;
      }

      try {
        await api.delete(
          `/saved-simulations/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setSimulations(
          (previous) =>
            previous.filter(
              (item) =>
                item._id !==
                id
            )
        );
      } catch (err) {
        console.error(err);

        alert(
          "Could not delete simulation."
        );
      }
    };

  if (authLoading) {
    return (
      <div className="saved-status-page">
        <div className="saved-status-card">
          <div className="saved-loader" />

          <h2>
            Checking account...
          </h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="saved-status-page">
        <div className="saved-status-card">
          <div className="saved-loader" />

          <h2>
            Loading your saved
            items...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-page-modern">
      <div className="saved-modern-container">

        <header className="saved-hero-card">
          <div className="saved-hero-content">
            <div className="saved-title-area">
              <div className="saved-page-icon">
                ★
              </div>

              <div>
                <p className="saved-eyebrow">
                  Your LoanLens Account
                </p>

                <h1>
                  My Saved Items
                </h1>

                <p className="saved-subtitle">
                  Review your saved
                  comparisons and loan
                  simulations anytime.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="saved-home-button"
              onClick={() =>
                navigate("/")
              }
            >
              ← Back Home
            </button>
          </div>

          <div className="saved-overview-grid">
            <div className="saved-overview-card">
              <span>
                Comparisons
              </span>

              <strong>
                {comparisons.length}
              </strong>
            </div>

            <div className="saved-overview-card">
              <span>
                Simulations
              </span>

              <strong>
                {simulations.length}
              </strong>
            </div>

            <div className="saved-overview-card">
              <span>
                Total Saved
              </span>

              <strong>
                {comparisons.length +
                  simulations.length}
              </strong>
            </div>
          </div>
        </header>

        {error && (
          <div className="saved-error-box">
            {error}
          </div>
        )}

        <div className="saved-tabs">
          <button
            type="button"
            className={
              activeTab ===
              "comparisons"
                ? "saved-tab active"
                : "saved-tab"
            }
            onClick={() =>
              setActiveTab(
                "comparisons"
              )
            }
          >
            Saved Comparisons

            <span>
              {comparisons.length}
            </span>
          </button>

          <button
            type="button"
            className={
              activeTab ===
              "simulations"
                ? "saved-tab active"
                : "saved-tab"
            }
            onClick={() =>
              setActiveTab(
                "simulations"
              )
            }
          >
            Saved Simulations

            <span>
              {simulations.length}
            </span>
          </button>
        </div>

        {activeTab ===
          "comparisons" && (
          <section className="saved-content-section">
            <div className="saved-section-title">
              <div>
                <p className="saved-eyebrow">
                  Comparisons
                </p>

                <h2>
                  Saved Loan
                  Comparisons
                </h2>

                <p>
                  Your personalized
                  comparisons between
                  selected banks.
                </p>
              </div>

              <span className="saved-count-pill">
                {comparisons.length}{" "}
                saved
              </span>
            </div>

            {comparisons.length ===
            0 ? (
              <div className="saved-empty-modern">
                <div className="saved-empty-icon">
                  ⇄
                </div>

                <h3>
                  No comparisons
                  saved yet
                </h3>

                <p>
                  Compare banks and
                  save the result to
                  view it here later.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/")
                  }
                >
                  Start Comparing
                </button>
              </div>
            ) : (
              <div className="saved-card-grid">
                {comparisons.map(
                  (
                    comparison
                  ) => (
                    <article
                      className="saved-modern-card"
                      key={
                        comparison._id
                      }
                    >
                      <div className="saved-card-header">
                        <div>
                          <span className="saved-card-badge">
                            Comparison
                          </span>

                          <h3>
                            {
                              comparison.title
                            }
                          </h3>

                          <p>
                            Saved{" "}
                            {formatDate(
                              comparison.createdAt
                            )}
                          </p>
                        </div>

                        <button
                          type="button"
                          className="saved-delete-modern"
                          onClick={() =>
                            deleteComparison(
                              comparison._id
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>

                      <div className="saved-card-divider" />

                      <div className="saved-info-grid">
                        <div className="saved-info-item">
                          <span>
                            Loan Type
                          </span>

                          <strong>
                            {
                              comparison
                                .loanType
                                ?.name ||
                              "—"
                            }
                          </strong>
                        </div>

                        <div className="saved-info-item">
                          <span>
                            Loan Amount
                          </span>

                          <strong>
                            {formatMoney(
                              comparison
                                .inputs
                                ?.loanAmount
                            )}
                          </strong>
                        </div>

                        <div className="saved-info-item">
                          <span>
                            Tenure
                          </span>

                          <strong>
                            {formatTenure(
                              comparison
                                .inputs
                                ?.tenureMonths
                            )}
                          </strong>
                        </div>

                        <div className="saved-info-item">
                          <span>
                            Banks
                          </span>

                          <strong>
                            {
                              comparison
                                .banks
                                ?.length ||
                              0
                            }
                          </strong>
                        </div>
                      </div>

                      <div className="saved-bank-area">
                        <span className="saved-small-label">
                          Compared Banks
                        </span>

                        <div className="saved-bank-chips">
                          {comparison.banks?.map(
                            (
                              bank,
                              index
                            ) => (
                              <span
                                key={`${comparison._id}-${bank.bankId || index}`}
                              >
                                {
                                  bank.name
                                }
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </article>
                  )
                )}
              </div>
            )}
          </section>
        )}

        {activeTab ===
          "simulations" && (
          <section className="saved-content-section">
            <div className="saved-section-title">
              <div>
                <p className="saved-eyebrow">
                  Simulations
                </p>

                <h2>
                  Saved Loan
                  Simulations
                </h2>

                <p>
                  Your saved
                  floating-rate and
                  prepayment scenarios.
                </p>
              </div>

              <span className="saved-count-pill">
                {simulations.length}{" "}
                saved
              </span>
            </div>

            {simulations.length ===
            0 ? (
              <div className="saved-empty-modern">
                <div className="saved-empty-icon">
                  %
                </div>

                <h3>
                  No simulations
                  saved yet
                </h3>

                <p>
                  Run a loan
                  simulation and save
                  it to access it
                  here later.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/")
                  }
                >
                  Explore Loans
                </button>
              </div>
            ) : (
              <div className="saved-card-grid">
                {simulations.map(
                  (
                    simulation
                  ) => (
                    <article
                      className="saved-modern-card"
                      key={
                        simulation._id
                      }
                    >
                      <div className="saved-card-header">
                        <div>
                          <span className="saved-card-badge simulation">
                            {simulation.simulationType ===
                            "floating-rate"
                              ? "Floating Rate"
                              : "Prepayment"}
                          </span>

                          <h3>
                            {
                              simulation.title
                            }
                          </h3>

                          <p>
                            Saved{" "}
                            {formatDate(
                              simulation.createdAt
                            )}
                          </p>
                        </div>

                        <button
                          type="button"
                          className="saved-delete-modern"
                          onClick={() =>
                            deleteSimulation(
                              simulation._id
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>

                      <div className="saved-card-divider" />

                      <div className="saved-info-grid">
                        <div className="saved-info-item">
                          <span>
                            Loan Type
                          </span>

                          <strong>
                            {simulation
                              .loanType
                              ?.name ||
                              "—"}
                          </strong>
                        </div>

                        <div className="saved-info-item">
                          <span>
                            Bank
                          </span>

                          <strong>
                            {simulation
                              .bank
                              ?.name ||
                              "—"}
                          </strong>
                        </div>

                        {simulation.simulationType ===
                          "floating-rate" && (
                          <>
                            <div className="saved-info-item">
                              <span>
                                Original
                                Rate
                              </span>

                              <strong>
                                {simulation
                                  .inputs
                                  ?.originalRate ??
                                  "—"}
                                %
                              </strong>
                            </div>

                            <div className="saved-info-item">
                              <span>
                                New Rate
                              </span>

                              <strong>
                                {simulation
                                  .inputs
                                  ?.newRate ??
                                  "—"}
                                %
                              </strong>
                            </div>
                          </>
                        )}
                      </div>
                    </article>
                  )
                )}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default MySavedPage;