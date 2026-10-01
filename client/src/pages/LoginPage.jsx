import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext.jsx";

function LoginPage() {
  const navigate =
    useNavigate();

  const { login } =
    useAuth();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [
    showPassword,
    setShowPassword,
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
        !formData.email ||
        !formData.password
      ) {
        setError(
          "Email and password are required."
        );

        return;
      }

      try {
        setLoading(true);

        await login({
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
            "Unable to login."
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
            Welcome Back
          </p>

          <h1>
            Login to LoanLens
          </h1>

          <p>
            Access your account
            and continue comparing,
            calculating, and
            exploring loan options.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={
            handleSubmit
          }
        >
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
                autoComplete="current-password"
                placeholder="Enter your password"
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
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword
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
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        <p className="auth-switch-text">
          Don&apos;t have an
          account?{" "}
          <Link to="/register">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;