import { Clock, Users, ShoppingCart } from "lucide-react";

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

function AuthBrandPanel() {
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
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "#3fae7f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 11 C8 2, 24 2, 24 11"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <path
                d="M5 11 L27 11 L24.5 28 C24.3 29.5 23 30.5 21.5 30.5 L10.5 30.5 C9 30.5 7.7 29.5 7.5 28 Z"
                fill="#ffffff"
              />
              <rect
                x="7"
                y="16"
                width="18"
                height="3"
                rx="1.2"
                fill="#3fae7f"
                opacity="0.9"
              />
              <rect
                x="8.5"
                y="22"
                width="15"
                height="3"
                rx="1.2"
                fill="#3fae7f"
                opacity="0.9"
              />
            </svg>
          </div>
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
          Pantry management made{" "}
          <span style={{ color: "#7be3b3" }}>effortless</span>
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
          A centralized platform to track what's in your pantry, plan smarter
          shopping, and cut down on food waste.
        </p>

        {/* Feature list */}
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
