import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { useAuth } from "../context/useAuth";
import PasswordInput from "../components/PasswordInput";
import IconInput from "../components/IconInput";
import AuthBrandPanel from "../components/AuthBrandPanel";

function getPasswordChecks(password) {
  return {
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
    length: password.length >= 8,
  };
}

const passwordRequirements = [
  { key: "uppercase", label: "At least one uppercase letter" },
  { key: "lowercase", label: "At least one lowercase letter" },
  { key: "number", label: "At least one number" },
  { key: "special", label: "At least one special character" },
  { key: "length", label: "At least 8 characters" },
];

function Register() {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register } = useAuth();

  const passwordChecks = getPasswordChecks(password);
  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isPasswordValid) {
      setError("Please meet all password requirements.");
      return;
    }

    setLoading(true);

    try {
      await register(firstName, middleName, lastName, email, password);
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
      {/* Right form panel (now on the left, swapped from Login) */}
      <div className="auth-form-panel">
        {success ? (
          <div
            className="auth-form auth-form-wide"
            style={{ textAlign: "center" }}
          >
            <h1
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "30px",
                fontWeight: 700,
                color: "var(--color-ink)",
                margin: 0,
              }}
            >
              Check your email
            </h1>
            <p style={{ color: "var(--color-ink-soft)", marginTop: "12px" }}>
              We sent a verification link to <strong>{email}</strong>. Click it
              to activate your account, then log in.
            </p>
            <p
              style={{
                color: "var(--color-ink-soft)",
                fontSize: "13px",
                marginTop: "8px",
              }}
            >
              Didn&apos;t get anything? Make sure you typed your email correctly
              — if it was wrong, go back and register again with the correct
              address.
            </p>
            <Link
              to="/login"
              style={{ marginTop: "16px", display: "inline-block" }}
            >
              <button type="button">Go to login</button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form auth-form-wide">
            <h1
              style={{
                fontFamily: "var(--font-body)",
                fontStyle: "normal",
                fontSize: "30px",
                fontWeight: 700,
                color: "var(--color-ink)",
                textAlign: "left",
                margin: 0,
              }}
            >
              Create an account
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
              Join PantryPal to start tracking your pantry
            </h2>

            {error && <p className="error-message">{error}</p>}

            <div className="name-row">
              <div>
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  style={{ width: "100%" }}
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  style={{ width: "100%" }}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <label htmlFor="middleName">Middle Name (optional)</label>
            <input
              id="middleName"
              type="text"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              placeholder="Enter your middle name"
            />

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

            <label htmlFor="password">Password</label>
            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              minLength={8}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "4px 10px",
                marginTop: "8px",
              }}
            >
              {passwordRequirements.map(({ key, label }) => (
                <span
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "11px",
                    lineHeight: "1.4",
                    color: passwordChecks[key]
                      ? "#3fae7f"
                      : "var(--color-ink-soft)",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      flexShrink: 0,
                      borderRadius: "50%",
                      background: passwordChecks[key]
                        ? "#3fae7f"
                        : "var(--color-border)",
                      transition: "background 0.15s ease",
                    }}
                  />
                  {label}
                </span>
              ))}
            </div>

            <button type="submit" disabled={loading || !isPasswordValid}>
              {loading ? "Creating account..." : "Register"}
            </button>

            <p>
              Already have an account?{" "}
              <Link to="/login" state={{ direction: "reverse" }}>
                Log In
              </Link>
            </p>
          </form>
        )}
      </div>

      {/* Brand panel now on the right */}
      <AuthBrandPanel />
    </div>
  );
}

export default Register;
