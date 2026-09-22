import { Clock, Users, ShoppingCart, Check } from "lucide-react";
import BrandBadge from "./BrandBadge";

function FeatureRow({ icon, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "8px",
          background: "rgba(255, 255, 255, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#7be3b3",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <span style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.9)" }}>
        {text}
      </span>
    </div>
  );
}

function StepRow({ state, number, text }) {
  const done = state === "done";
  const active = state === "active";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: "13px",
          fontWeight: 700,
          background: done ? "#3fae7f" : "transparent",
          border: done
            ? "none"
            : active
              ? "2px solid #7be3b3"
              : "2px solid rgba(255, 255, 255, 0.25)",
          color: done
            ? "white"
            : active
              ? "#7be3b3"
              : "rgba(255, 255, 255, 0.5)",
        }}
      >
        {done ? <Check size={16} strokeWidth={3} /> : number}
      </div>
      <span
        style={{
          fontSize: "14px",
          fontWeight: active ? 600 : 400,
          color: active
            ? "white"
            : done
              ? "rgba(255, 255, 255, 0.9)"
              : "rgba(255, 255, 255, 0.55)",
        }}
      >
        {text}
      </span>
    </div>
  );
}

function StepConnector() {
  return (
    <div
      style={{
        width: "2px",
        height: "16px",
        marginLeft: "13px",
        background: "rgba(255, 255, 255, 0.2)",
      }}
    />
  );
}

function AuthBrandPanel({ variant = "default" }) {
  const isOnboarding = variant === "onboarding";

  return (
    <div
      className="auth-brand-panel"
      style={{ alignItems: "flex-start", justifyContent: "flex-start" }}
    >
      <svg
        className="auth-brand-watermark"
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 11 C8 2, 24 2, 24 11"
          fill="none"
          stroke="#f5f1e8"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M5 11 L27 11 L24.5 28 C24.3 29.5 23 30.5 21.5 30.5 L10.5 30.5 C9 30.5 7.7 29.5 7.5 28 Z"
          fill="#f5f1e8"
        />
        <rect
          x="7"
          y="16"
          width="18"
          height="3"
          rx="1.2"
          fill="#2f4b3c"
          opacity="0.4"
        />
        <rect
          x="8.5"
          y="22"
          width="15"
          height="3"
          rx="1.2"
          fill="#2f4b3c"
          opacity="0.4"
        />
      </svg>

      <div
        className="auth-brand-content"
        style={{
          alignItems: "flex-start",
          gap: "28px",
          zIndex: 1,
          position: "relative",
        }}
      >
        {/* Badge + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <BrandBadge size={44} />
          <span style={{ fontSize: "20px", fontWeight: 700, color: "white" }}>
            PantryPal
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "36px",
            fontWeight: 700,
            lineHeight: 1.2,
            color: "white",
            margin: 0,
          }}
        >
          {isOnboarding ? (
            <>
              Let&apos;s set up your{" "}
              <span style={{ color: "#7be3b3" }}>household</span>
            </>
          ) : (
            <>
              Pantry management made{" "}
              <span style={{ color: "#7be3b3" }}>effortless</span>
            </>
          )}
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: "15px",
            color: "rgba(255, 255, 255, 0.75)",
            lineHeight: 1.6,
            maxWidth: "320px",
            margin: 0,
          }}
        >
          {isOnboarding
            ? "Your household is the shared space where your pantry, shopping list and reports live. It only takes a moment."
            : "A centralized platform to track what's in your pantry, plan smarter shopping, and cut down on food waste."}
        </p>

        {isOnboarding ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "4px",
            }}
          >
            <StepRow state="done" text="Create your account" />
            <StepConnector />
            <StepRow state="active" number={2} text="Set up your household" />
            <StepConnector />
            <StepRow
              state="upcoming"
              number={3}
              text="Start tracking your pantry"
            />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              marginTop: "4px",
            }}
          >
            <FeatureRow
              icon={<Clock size={16} />}
              text="Track expiration dates automatically"
            />
            <FeatureRow
              icon={<Users size={16} />}
              text="Share your inventory with the household"
            />
            <FeatureRow
              icon={<ShoppingCart size={16} />}
              text="Never run out of the essentials"
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <p
        style={{
          position: "absolute",
          bottom: "24px",
          left: "56px",
          zIndex: 1,
          fontSize: "12px",
          color: "rgba(255, 255, 255, 0.5)",
          margin: 0,
        }}
      >
        © 2026 PantryPal Pantry Management System
      </p>
    </div>
  );
}

export default AuthBrandPanel;
