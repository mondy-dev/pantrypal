function IconInput({
  icon,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}) {
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
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 0 0 12px",
          color: "var(--color-ink-soft)",
        }}
      >
        {icon}
      </span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          flex: 1,
          minWidth: 0,
          border: "none",
          outline: "none",
          background: "transparent",
          padding: "10px 12px",
          fontFamily: "var(--font-body)",
          fontSize: "15px",
          color: "var(--color-ink)",
        }}
      />
    </div>
  );
}

export default IconInput;
