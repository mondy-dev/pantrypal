import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHousehold } from "../context/useHousehold";

function CreateHousehold() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { createHousehold } = useHousehold();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createHousehold(name);
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
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-form">
        <h1>PantryPal</h1>
        <h2>Set up your household</h2>

        {error && <p className="error-message">{error}</p>}

        <label htmlFor="householdName">Household Name</label>
        <input
          id="householdName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Dela Cruz Household"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Household"}
        </button>
      </form>
    </div>
  );
}

export default CreateHousehold;
