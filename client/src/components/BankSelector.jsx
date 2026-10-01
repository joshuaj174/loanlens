import {
  useMemo,
  useState,
} from "react";

const BANK_DOMAINS = {
  "State Bank of India":
    "sbi.co.in",

  "HDFC Bank":
    "hdfcbank.com",

  "ICICI Bank":
    "icicibank.com",

  "Axis Bank":
    "axisbank.com",

  "Kotak Mahindra Bank":
    "kotak.com",

  "Bank of Baroda":
    "bankofbaroda.in",

  "Bank of India":
    "bankofindia.co.in",

  "Punjab National Bank":
    "pnbindia.in",

  "Canara Bank":
    "canarabank.com",

  "Union Bank of India":
    "unionbankofindia.co.in",

  "IDBI Bank":
    "idbibank.in",

  "IndusInd Bank":
    "indusind.com",

  "Yes Bank":
    "yesbank.in",

  "Federal Bank":
    "federalbank.co.in",
};

function BankLogo({
  bank,
}) {
  const [
    imageFailed,
    setImageFailed,
  ] = useState(false);

  const domain =
    BANK_DOMAINS[
      bank.name
    ];

  const fallbackLogo =
    domain
      ? `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
      : "";

  const logoSource =
    bank.logoUrl ||
    fallbackLogo;

  if (
    !logoSource ||
    imageFailed
  ) {
    return (
      <div className="bank-logo-fallback">
        {bank.name
          .charAt(0)
          .toUpperCase()}
      </div>
    );
  }

  return (
    <div className="bank-logo-wrapper">
      <img
        src={logoSource}
        alt={`${bank.name} logo`}
        className="bank-logo-image"
        onError={() =>
          setImageFailed(
            true
          )
        }
      />
    </div>
  );
}

function BankSelector({
  banks,
  selectedBanks,
  onToggleBank,
}) {
  const [
    search,
    setSearch,
  ] = useState("");

  const filteredBanks =
    useMemo(() => {
      return banks.filter(
        (bank) =>
          bank.name
            .toLowerCase()
            .includes(
              search
                .toLowerCase()
                .trim()
            )
      );
    }, [
      banks,
      search,
    ]);

  return (
    <section className="bank-selector">
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            Choose your banks
          </p>

          <h2>
            Select banks to compare
          </h2>

          <p>
            Choose from the banks
            supported by LoanLens.
            You can select multiple
            banks for comparison.
          </p>
        </div>
      </div>

      <div className="bank-search-area">
        <div className="bank-search-box">
          <span className="bank-search-icon">
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search from 14 banks..."
            value={search}
            onChange={(
              event
            ) =>
              setSearch(
                event.target
                  .value
              )
            }
          />

          {search && (
            <button
              type="button"
              className="clear-bank-search"
              onClick={() =>
                setSearch("")
              }
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="bank-selection-count">
          <strong>
            {
              selectedBanks.length
            }
          </strong>

          <span>
            selected
          </span>
        </div>
      </div>

      {filteredBanks.length ===
      0 ? (
        <div className="bank-empty-state">
          <div>
            ⌕
          </div>

          <h3>
            No bank found
          </h3>

          <p>
            Try another bank
            name.
          </p>
        </div>
      ) : (
        <div className="bank-grid">
          {filteredBanks.map(
            (bank) => {
              const isSelected =
                selectedBanks.some(
                  (
                    selectedBank
                  ) =>
                    selectedBank._id ===
                    bank._id
                );

              return (
                <button
                  type="button"
                  key={bank._id}
                  className={
                    `bank-card ${
                      isSelected
                        ? "selected"
                        : ""
                    }`
                  }
                  onClick={() =>
                    onToggleBank(
                      bank
                    )
                  }
                >
                  <div className="bank-card-top">
                    <BankLogo
                      bank={
                        bank
                      }
                    />

                    <span
                      className={
                        `bank-check ${
                          isSelected
                            ? "visible"
                            : ""
                        }`
                      }
                    >
                      ✓
                    </span>
                  </div>

                  <div className="bank-card-content">
                    <strong>
                      {
                        bank.name
                      }
                    </strong>

                    <span>
                      {isSelected
                        ? "Selected for comparison"
                        : "Click to add"}
                    </span>
                  </div>
                </button>
              );
            }
          )}
        </div>
      )}

      <div className="bank-selector-footer">
        <span>
          {
            filteredBanks.length
          }{" "}
          banks shown
        </span>

        {selectedBanks.length >
          0 && (
          <strong>
            {
              selectedBanks.length
            }{" "}
            ready to compare
          </strong>
        )}
      </div>
    </section>
  );
}

export default BankSelector;