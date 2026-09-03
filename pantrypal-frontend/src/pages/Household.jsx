import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useHousehold } from "../context/useHousehold";

function Household() {
  const { user } = useAuth();
  const { household, inviteMember, removeMember } = useHousehold();

  const [inviteEmail, setInviteEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!household) {
    return <p>Loading household...</p>;
  }

  const currentMember = household.members.find(
    (m) => m.userId === user?.userId,
  );
  const isOwner = currentMember?.role === "OWNER";

  const handleInvite = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await inviteMember(inviteEmail);
      setInviteEmail("");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userId) => {
    if (!window.confirm("Remove this member from the household?")) return;

    try {
      await removeMember(userId);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(message);
    }
  };

  return (
    <div style={{ padding: "32px", maxWidth: "600px" }}>
      <h1>{household.name}</h1>
      <h2>Members</h2>

      {error && <p className="error-message">{error}</p>}

      <ul>
        {household.members.map((member) => (
          <li key={member.userId} style={{ marginBottom: "8px" }}>
            {member.firstName} {member.lastName} ({member.email}) —{" "}
            {member.role}
            {isOwner && member.role !== "OWNER" && (
              <button
                type="button"
                onClick={() => handleRemove(member.userId)}
                style={{ marginLeft: "12px" }}
              >
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>

      {isOwner && (
        <form onSubmit={handleInvite} style={{ marginTop: "24px" }}>
          <h3>Invite a Member</h3>
          <label htmlFor="inviteEmail">Email</label>
          <input
            id="inviteEmail"
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="member@example.com"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Inviting..." : "Invite"}
          </button>
        </form>
      )}
    </div>
  );
}

export default Household;
