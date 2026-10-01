import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext.jsx";

function Navbar() {
  const navigate =
    useNavigate();

  const {
    user,
    loading,
    logout,
  } = useAuth();

  const goHome = () => {
    navigate("/", {
      state: {
        resetLoanSelection: true,
      },
    });
  };

  const goToBanks = () => {
    navigate("/", {
      state: {
        scrollToBanks: true,
      },
    });
  };

  const goToAbout = () => {
    navigate("/");

    setTimeout(() => {
      document
        .getElementById(
          "about"
        )
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 100);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <button
        type="button"
        className="brand-button"
        onClick={goHome}
      >
        <span className="brand-logo">
          ₹
        </span>

        <span className="brand">
          LoanLens
        </span>
      </button>

      <div className="nav-links">
        <button
          type="button"
          onClick={goHome}
        >
          Loans
        </button>

        <button
          type="button"
          onClick={goToBanks}
        >
          Banks
        </button>

        <button
          type="button"
          onClick={goToAbout}
        >
          About
        </button>

        {!loading &&
          user && (
            <button
              type="button"
              className="nav-saved-button"
              onClick={() =>
                navigate(
                  "/saved"
                )
              }
            >
              My Saved
            </button>
          )}

        {!loading &&
          !user && (
            <div className="nav-auth-group">
              <button
                type="button"
                className="nav-login-button"
                onClick={() =>
                  navigate(
                    "/login"
                  )
                }
              >
                Login
              </button>

              <button
                type="button"
                className="nav-register-button"
                onClick={() =>
                  navigate(
                    "/register"
                  )
                }
              >
                Create Account
              </button>
            </div>
          )}

        {!loading &&
          user && (
            <div className="nav-auth-group">
              <div className="nav-user-chip">
                <span className="nav-user-avatar">
                  {user.name
                    ?.charAt(0)
                    .toUpperCase()}
                </span>

                <span>
                  Hi,{" "}
                  <strong>
                    {user.name}
                  </strong>
                </span>
              </div>

              <button
                type="button"
                className="nav-logout-button"
                onClick={
                  handleLogout
                }
              >
                Logout
              </button>
            </div>
          )}
      </div>
    </nav>
  );
}

export default Navbar;