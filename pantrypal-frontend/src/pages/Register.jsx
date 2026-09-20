import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { useAuth } from "../context/useAuth";
import PasswordInput from "../components/PasswordInput";
import IconInput from "../components/IconInput";
import AuthBrandPanel from "../components/AuthBrandPanel";

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "", color: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: "Weak", color: "#c4472e" },
    { label: "Weak", color: "#c4472e" },
    { label: "Fair", color: "#d9a441" },
    { label: "Good", color: "#5fa876" },
    { label: "Strong", color: "#2f4b3c" },
  ];

  return { score, ...levels[score] };
}

function Register() {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(firstName, middleName, lastName, email, password);
      navigate("/dashboard");
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
                placeholder="Juan"
                required
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Dela Cruz"
                required
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <label htmlFor="middleName">Middle Name (optional)</label>
          <input
            id="middleName"
            type="text"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
            placeholder="Reyes"
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

          {password && (
            <div style={{ marginTop: "8px" }}>
              <div style={{ display: "flex", gap: "4px" }}>
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: "4px",
                      borderRadius: "2px",
                      background:
                        i < strength.score
                          ? strength.color
                          : "var(--color-border)",
                      transition: "background 0.2s ease",
                    }}
                  />
                ))}
              </div>
              <span
                style={{
                  fontSize: "12px",
                  color: strength.color,
                  fontWeight: 600,
                  marginTop: "4px",
                  display: "inline-block",
                }}
              >
                {strength.label}
              </span>
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>

          <p>
            Already have an account?{" "}
            <Link to="/login" state={{ direction: "reverse" }}>
              Log In
            </Link>
          </p>
        </form>
      </div>

      {/* Brand panel now on the right */}
      <AuthBrandPanel />
    </div>
  );
}

export default Register;
