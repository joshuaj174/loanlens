import {
  useLocation,
  useNavigate,
} from "react-router-dom";

function DocumentsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedLoan =
    location.state?.selectedLoan;

  const selectedBank =
    location.state?.selectedBank;

  if (!selectedLoan || !selectedBank) {
    return (
      <div className="documents-page">
        <div className="documents-container">
          <h1>No bank selected</h1>

          <p>
            Please choose a loan and bank first.
          </p>

          <button
            className="primary-button"
            onClick={() => navigate("/")}
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const commonDocuments = [
    "PAN card",
    "Aadhaar card / valid identity proof",
    "Address proof",
    "Recent passport-size photograph",
    "Recent bank statements",
    "Income proof",
  ];

  const loanSpecificDocuments = {
    home: [
      "Salary slips or income proof",
      "Form 16 / ITR",
      "Property-related documents",
      "Agreement or property papers where applicable",
    ],

    personal: [
      "Salary slips or income proof",
      "Form 16 / ITR",
      "Employment proof where required",
    ],

    car: [
      "Salary slips or income proof",
      "Form 16 / ITR",
      "Vehicle quotation / proforma invoice",
    ],

    education: [
      "Admission letter",
      "Course fee structure",
      "Academic records",
      "Co-applicant income documents where required",
    ],
  };

  const extraDocuments =
    loanSpecificDocuments[
      selectedLoan.slug
    ] || [];

  const handleContinue = () => {
    if (!selectedBank.websiteUrl) {
      alert(
        "Official bank website is not available yet."
      );
      return;
    }

    window.open(
      selectedBank.websiteUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="documents-page">
      <div className="documents-container">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Back to Comparison
        </button>

        <p className="eyebrow">
          Step 3
        </p>

        <h1>
          Documents Required
        </h1>

        <p className="documents-intro">
          You selected{" "}
          <strong>{selectedBank.name}</strong>{" "}
          for a{" "}
          <strong>{selectedLoan.name}</strong>.
        </p>

        <div className="documents-card">
          <div className="selected-bank-header">
            <div className="bank-logo-placeholder large">
              {selectedBank.name
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <h2>
                {selectedBank.name}
              </h2>

              <p>
                {selectedLoan.name}
              </p>
            </div>
          </div>

          <div className="documents-section">
            <h3>
              Common Documents
            </h3>

            <ul>
              {commonDocuments.map(
                (document) => (
                  <li key={document}>
                    {document}
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="documents-section">
            <h3>
              Additional Documents for{" "}
              {selectedLoan.name}
            </h3>

            <ul>
              {extraDocuments.map(
                (document) => (
                  <li key={document}>
                    {document}
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="documents-warning">
            Exact documents may vary by bank,
            employment type, loan amount,
            location, and applicant profile.
            LoanLens will later show
            verified bank-specific
            requirements.
          </div>

          <button
            className="official-bank-button"
            onClick={handleContinue}
          >
            Continue to {selectedBank.name}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DocumentsPage;