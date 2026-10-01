import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import IconInput from "../components/IconInput";
import AuthBrandPanel from "../components/AuthBrandPanel";
import * as authService from "../services/authService";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setSent(true);
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
        {sent ? (
          <div className="auth-form" style={{ textAlign: "center" }}>
            <h1>Check your email</h1>
            <p style={{ color: "var(--color-ink-soft)" }}>
              If an account exists for {email}, we&apos;ve sent a link to reset
              your password.
            </p>
            <Link
              to="/login"
              style={{ display: "inline-block", marginTop: "8px" }}
            >
              <button type="button">Back to login</button>
            </Link>
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
              Forgot your password?
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
              Enter your email and we&apos;ll send you a reset link
            </h2>

            {error && <p className="error-message">{error}</p>}

            <label htmlFor="email">Email address</label>
            <IconInput
              icon={<Mail size={18} />}
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send reset link"}
            </button>

            <p>
              Remembered your password? <Link to="/login">Log In</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
