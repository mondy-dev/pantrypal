import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";

function NotificationBell({ alerts, onSelect }) {
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

  const handleSelect = (alert) => {
    setOpen(false);
    onSelect?.(alert);
  };

  return (
    <div className="notif-wrap" ref={wrapRef}>
      <button
        type="button"
        className="icon-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications (${alerts.length} unread)`}
      >
        <Bell size={20} />
        {alerts.length > 0 && (
          <span className="notif-badge">
            {alerts.length > 9 ? "9+" : alerts.length}
          </span>
        )}
      </button>

      {open && (
        <div className="notif-dropdown">
          <p className="notif-dropdown-title">Notifications</p>

          {alerts.length === 0 ? (
            <p className="notif-empty">You&apos;re all caught up.</p>
          ) : (
            <div className="notif-list">
              {alerts.map((alert) => (
                <button
                  key={alert.id}
                  type="button"
                  className={`notif-item notif-item-${alert.type}`}
                  onClick={() => handleSelect(alert)}
                >
                  {alert.message}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
