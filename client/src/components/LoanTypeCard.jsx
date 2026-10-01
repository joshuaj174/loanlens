function LoanTypeCard({ loan, selected, onSelect }) {
  return (
    <button
      className={`loan-card ${selected ? "selected" : ""}`}
      onClick={() => onSelect(loan)}
    >
      <h3>{loan.name}</h3>

      <p>
        {loan.description || "Explore loan options and compare banks."}
      </p>

      <span>
        {selected ? "Selected" : "Choose Loan"}
      </span>
    </button>
  );
}

export default LoanTypeCard;