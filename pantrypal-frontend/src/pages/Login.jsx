import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { useAuth } from "../context/useAuth";
import PasswordInput from "../components/PasswordInput";
import IconInput from "../components/IconInput";
import AuthBrandPanel from "../components/AuthBrandPanel";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isReverse = location.state?.direction === "reverse";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
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
    <div className={`auth-split-page${isReverse ? " direction-reverse" : ""}`}>
      <AuthBrandPanel />

      <div className="auth-form-panel">
        <form onSubmit={handleSubmit} className="auth-form">
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
            Welcome back
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
            Sign in to your PantryPal account
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

          <label htmlFor="password">Password</label>
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Sign in"}
          </button>

          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
