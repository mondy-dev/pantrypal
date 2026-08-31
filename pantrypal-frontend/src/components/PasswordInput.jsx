import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function PasswordInput({ id, value, onChange, placeholder, minLength }) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        border: "1px solid var(--color-border)",
        borderRadius: "6px",
        background: "var(--color-bg)",
      }}
    >
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        minLength={minLength}
        required
        style={{
          flex: 1,
          minWidth: 0,
          border: "none",
          outline: "none",
          background: "transparent",
          padding: "10px 0 10px 12px",
          fontFamily: "var(--font-body)",
          fontSize: "15px",
          color: "var(--color-ink)",
        }}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          background: "transparent",
          padding: "0 12px",
          margin: 0,
          lineHeight: 0,
          color: "var(--color-ink-soft)",
          cursor: "pointer",
        }}
      >
        {visible ? <Eye size={18} /> : <EyeOff size={18} />}
      </button>
    </div>
  );
}

export default PasswordInput;
