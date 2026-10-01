import { useEffect, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import * as authService from "../services/authService";
import AuthBrandPanel from "../components/AuthBrandPanel";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const calledRef = useRef(false);

  const [status, setStatus] = useState(token ? "verifying" : "error");
  const [message, setMessage] = useState(
    token ? "" : "Missing verification token.",
  );

  useEffect(() => {
    if (!token) return;

    // React 18 StrictMode double-invokes effects in dev — guard so we only
    // ever call the (one-time-use) verification endpoint once.
    if (calledRef.current) return;
    calledRef.current = true;

    authService
      .verifyEmail(token)
      .then((data) => {
        setStatus("success");
        setMessage(data.message || "Your email has been verified.");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "This verification link is invalid or has expired.",
        );
      });
  }, [token]);

  return (
    <div className="auth-split-page">
      <AuthBrandPanel />

      <div className="auth-form-panel">
        <div className="auth-form" style={{ textAlign: "center" }}>
          {status === "verifying" && (
            <>
              <Loader2 size={40} style={{ color: "var(--color-ink-soft)" }} />
              <h1 style={{ marginTop: "16px" }}>Verifying your email...</h1>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle2 size={40} style={{ color: "#3fae7f" }} />
              <h1 style={{ marginTop: "16px" }}>Email verified</h1>
              <p style={{ color: "var(--color-ink-soft)" }}>{message}</p>
              <Link
                to="/login"
                style={{ display: "inline-block", marginTop: "8px" }}
              >
                <button type="button">Go to login</button>
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle size={40} style={{ color: "#c4472e" }} />
              <h1 style={{ marginTop: "16px" }}>Verification failed</h1>
              <p className="error-message">{message}</p>
              <Link
                to="/register"
                style={{ display: "inline-block", marginTop: "8px" }}
              >
                <button type="button">Back to register</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
