import { useEffect, useRef, useState } from "react";
import { LogOut } from "lucide-react";

function initials(firstName, lastName) {
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
}

function UserMenu({ user, householdName, onLogout }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="user-menu-wrap" ref={wrapRef}>
      <button
        type="button"
        className="avatar-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
      >
        {initials(user?.firstName, user?.lastName)}
      </button>

      {open && (
        <div className="user-menu-dropdown">
          <div className="user-menu-header">
            <div className="avatar-btn avatar-btn-static" aria-hidden="true">
              {initials(user?.firstName, user?.lastName)}
            </div>
            <div className="user-menu-identity">
              <p className="user-menu-name">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="user-menu-email">{user?.email}</p>
            </div>
          </div>

          {householdName && (
            <p className="user-menu-household">{householdName}</p>
          )}

          <button
            type="button"
            className="user-menu-logout"
            onClick={onLogout}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
