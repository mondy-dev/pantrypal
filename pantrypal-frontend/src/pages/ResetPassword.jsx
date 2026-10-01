import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import AuthBrandPanel from "../components/AuthBrandPanel";
import * as authService from "../services/authService";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("Missing reset token. Please use the link from your email.");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-page">
      <AuthBrandPanel />

      <div className="auth-form-panel">
        {success ? (
          <div className="auth-form" style={{ textAlign: "center" }}>
            <h1>Password reset</h1>
            <p style={{ color: "var(--color-ink-soft)" }}>
              Your password has been changed. You can now log in.
            </p>
            <button type="button" onClick={() => navigate("/login")}>
              Go to login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <h1
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "30px",
                fontWeight: 700,
                color: "var(--color-ink)",
                textAlign: "left",
                margin: 0,
              }}
            >
              Reset your password
            </h1>
            <h2
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "15px",
                fontWeight: 400,
                color: "var(--color-ink-soft)",
                textAlign: "left",
                marginTop: "6px",
                marginBottom: "28px",
              }}
            >
              Choose a new password for your account
            </h2>

            {error && <p className="error-message">{error}</p>}

            <label htmlFor="password">New password</label>
            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              minLength={8}
            />

            <label htmlFor="confirmPassword">Confirm new password</label>
            <PasswordInput
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your new password"
              minLength={8}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset password"}
            </button>

            <p>
              <Link to="/login">Back to login</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
