import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Mail, RefreshCw } from "lucide-react";
import { useAuth } from "../context/useAuth";
import { useHousehold } from "../context/useHousehold";
import IconInput from "../components/IconInput";
import AuthBrandPanel from "../components/AuthBrandPanel";
import BrandBadge from "../components/BrandBadge";

const MAX_NAME_LENGTH = 50;

function CreateHousehold() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [inviteNotice, setInviteNotice] = useState("");

  const { user, logout } = useAuth();
  const { createHousehold, refreshHousehold, clearHousehold } = useHousehold();
  const navigate = useNavigate();

  const trimmedName = name.trim();

  const suggestions = [
    user?.lastName && `${user.lastName} Household`,
    user?.firstName && `${user.firstName}'s Kitchen`,
  ]
    .filter(Boolean)
    .map((s) => s.slice(0, MAX_NAME_LENGTH));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!trimmedName) return;

    setError("");
    setLoading(true);

    try {
      await createHousehold(trimmedName);
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

  // The owner can add an existing account to their household by email, so a
  // person who registered to join someone else's household can land here and
  // then get added while this page is open. This re-checks for that.
  const handleCheckInvite = async () => {
    setInviteNotice("");
    setChecking(true);

    try {
      await refreshHousehold();
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.status === 404) {
        setInviteNotice(
          "No invitation yet. Once the owner sends it, tap the button again.",
        );
      } else {
        setInviteNotice("Couldn't check right now. Please try again.");
      }
    } finally {
      setChecking(false);
    }
  };

  const handleSignOut = () => {
    logout();
    clearHousehold();
    navigate("/login");
  };

  return (
    <div className="auth-split-page create-household-page">
      <AuthBrandPanel variant="onboarding" />

      <div className="auth-form-panel">
        <div className="auth-form">
          {/* The brand panel is hidden on small screens, so keep a compact logo */}
          <div className="auth-mobile-brand">
            <BrandBadge size={36} />
            <span className="auth-mobile-wordmark">PantryPal</span>
          </div>

          <p className="onboarding-eyebrow">Step 2 of 2 · Household</p>
          <h1 className="onboarding-title">
            Welcome{user?.firstName ? `, ${user.firstName}` : ""}
          </h1>
          <h2 className="onboarding-subtitle">
            Let&apos;s set up your household, a shared pantry for everyone you
            cook and shop with.
          </h2>

          <form onSubmit={handleSubmit} className="onboarding-form">
            {error && (
              <p className="error-message" role="alert">
                {error}
              </p>
            )}

            <label htmlFor="householdName">Household name</label>
            <IconInput
              icon={<Home size={18} />}
              id="householdName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dela Cruz Household"
              maxLength={MAX_NAME_LENGTH}
              autoComplete="off"
              autoFocus
              required
              aria-describedby="householdHint"
            />
            <p className="onboarding-hint" id="householdHint">
              You&apos;ll be the owner. You can rename it or invite people
              anytime.
            </p>

            {suggestions.length > 0 && (
              <div
                className="name-chips"
                role="group"
                aria-label="Name suggestions"
              >
                <span className="name-chips-label">Try:</span>
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="name-chip"
                    aria-pressed={name === suggestion}
                    onClick={() => setName(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            <button type="submit" disabled={loading || !trimmedName}>
              {loading ? "Creating..." : "Create household"}
            </button>
          </form>

          <p className="onboarding-or">
            <span>or</span>
          </p>

          <div className="invite-box">
            <p className="invite-title">
              <Mail size={16} />
              Joining an existing household?
            </p>
            <p className="invite-text">
              Ask the household owner to invite <strong>{user?.email}</strong>.
              Once they have, check below.
            </p>
            <button
              type="button"
              className="btn-outline-full"
              onClick={handleCheckInvite}
              disabled={checking}
            >
              <RefreshCw size={16} className={checking ? "spin" : ""} />
              {checking ? "Checking..." : "Check for invitation"}
            </button>
            {inviteNotice && (
              <p className="invite-status" role="status">
                {inviteNotice}
              </p>
            )}
          </div>

          <p className="onboarding-footer">
            Wrong account?{" "}
            <button
              type="button"
              className="link-button"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreateHousehold;
