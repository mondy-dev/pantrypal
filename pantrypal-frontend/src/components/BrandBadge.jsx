// The green PantryPal jar badge. Shared by the auth brand panel and the
// compact mobile header so the mark only lives in one place.
function BrandBadge({ size = 44 }) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${Math.round(size * 0.27)}px`,
        background: "#3fae7f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg
        width={Math.round(size * 0.45)}
        height={Math.round(size * 0.45)}
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
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
  );
}

export default BrandBadge;
