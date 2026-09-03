import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useHousehold } from "../context/useHousehold";

function RequireHousehold({ children }) {
  const { hasHousehold, checked, refreshHousehold } = useHousehold();
  const [loading, setLoading] = useState(!checked);

  useEffect(() => {
    if (!checked) {
      refreshHousehold()
        .catch(() => {
          // No household yet — this is an expected case, not a real error.
        })
        .finally(() => setLoading(false));
    }
  }, [checked, refreshHousehold]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!hasHousehold) {
    return <Navigate to="/create-household" replace />;
  }

  return children;
}

export default RequireHousehold;
