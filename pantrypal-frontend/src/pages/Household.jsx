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
    return (
      <div className="page">
        <p>Loading household...</p>
      </div>
    );
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

  const initials = (firstName, lastName) =>
    `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="page">
      <div className="page-header">
        <h1>{household.name}</h1>
      </div>

      {error && <p className="error-message">{error}</p>}

      <h2 className="section-heading">Members</h2>

      <div className="member-list">
        {household.members.map((member) => (
          <div key={member.userId} className="member-row">
            <div className="member-avatar">
              {initials(member.firstName, member.lastName)}
            </div>

            <div className="member-info">
              <span className="member-name">
                {member.firstName} {member.lastName}
              </span>
              <span className="member-email">{member.email}</span>
            </div>

            <span
              className={
                "role-badge" + (member.role === "OWNER" ? " role-owner" : "")
              }
            >
              {member.role}
            </span>

            {isOwner && member.role !== "OWNER" && (
              <button
                type="button"
                className="btn-danger btn-small"
                onClick={() => handleRemove(member.userId)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {isOwner && (
        <div className="invite-section">
          <h2 className="section-heading">Invite a Member</h2>
          <form onSubmit={handleInvite} className="invite-form">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="member@example.com"
              required
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Inviting..." : "Invite"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Household;
