const LABELS = {
  FRESH: "Fresh",
  EXPIRING_SOON: "Expiring Soon",
  CRITICAL: "Critical",
  EXPIRED: "Expired",
};

function StampBadge({ status }) {
  const className = "stamp stamp-" + status.toLowerCase().replace("_", "-");

  return <span className={className}>{LABELS[status] || status}</span>;
}

export default StampBadge;
