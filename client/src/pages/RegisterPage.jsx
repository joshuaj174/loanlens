import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext.jsx";

function RegisterPage() {
  const navigate =
    useNavigate();

  const { register } =
    useAuth();

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleChange = (
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

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");

      if (
        !formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        setError(
          "Please complete all fields."
        );

        return;
      }

      if (
        formData.password
          .length < 6
      ) {
        setError(
          "Password must contain at least 6 characters."
        );

        return;
      }

      if (
        formData.password !==
        formData.confirmPassword
      ) {
        setError(
          "Passwords do not match."
        );

        return;
      }

      try {
        setLoading(true);

        await register({
          name:
            formData.name,

          email:
            formData.email,

          password:
            formData.password,
        });

        navigate("/");
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data
            ?.message ||
            "Unable to create account."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link
          to="/"
          className="auth-brand"
        >
          <div className="auth-brand-logo">
            ₹
          </div>

          <span>
            LoanLens
          </span>
        </Link>

        <div className="auth-heading">
          <p className="eyebrow">
            Create Account
          </p>

          <h1>
            Join LoanLens
          </h1>

          <p>
            Create an account so
            your comparisons and
            simulations can be
            saved for later use.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={
            handleSubmit
          }
        >
          <div className="form-field">
            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              value={
                formData.name
              }
              onChange={
                handleChange
              }
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">
              Password
            </label>

            <div className="password-input-wrapper">
              <input
                id="password"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                autoComplete="new-password"
                placeholder="Minimum 6 characters"
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
              />

              <button
                type="button"
                className="password-toggle-button"
                onClick={() =>
                  setShowPassword(
                    (previous) =>
                      !previous
                  )
                }
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <div className="password-input-wrapper">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                autoComplete="new-password"
                placeholder="Re-enter password"
                value={
                  formData.confirmPassword
                }
                onChange={
                  handleChange
                }
              />

              <button
                type="button"
                className="password-toggle-button"
                onClick={() =>
                  setShowConfirmPassword(
                    (previous) =>
                      !previous
                  )
                }
              >
                {showConfirmPassword
                  ? "Hide"
                  : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit-button"
            disabled={
              loading
            }
          >
            {loading
              ? "Creating account..."
              : "Create Account"}
          </button>
        </form>

        <p className="auth-switch-text">
          Already have an
          account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;