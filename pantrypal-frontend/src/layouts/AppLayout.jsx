import { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  Package,
  Clock,
  ShoppingCart,
  History as HistoryIcon,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/useAuth";
import { useHousehold } from "../context/useHousehold";

const NAV_SECTIONS = [
  {
    label: "Main",
    items: [{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Manage",
    items: [
      { to: "/household", label: "Household", icon: Home },
      { to: "/inventory", label: "Inventory", icon: Package },
      { to: "/expiration", label: "Expiration", icon: Clock },
      { to: "/shopping-list", label: "Shopping List", icon: ShoppingCart },
      { to: "/history", label: "History", icon: HistoryIcon },
    ],
  },
  {
    label: "Reports",
    items: [{ to: "/reports", label: "Reports", icon: BarChart3 }],
  },
];

function AppLayout() {
  const { logout } = useAuth();
  const { clearHousehold } = useHousehold();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    clearHousehold();
    navigate("/login");
  };

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  return (
    <div className="app-layout">
      <button
        type="button"
        className="mobile-menu-toggle"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={"sidebar" + (mobileOpen ? " sidebar-open" : "")}>
        <div className="sidebar-top">
          <div className="sidebar-wordmark">PantryPal</div>
          <button
            type="button"
            className="sidebar-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="sidebar-section-label">{section.label}</p>
              {section.items.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    "sidebar-link" + (isActive ? " active" : "")
                  }
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <button type="button" className="sidebar-logout" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      <main className="main-content">
        <Outlet key={location.pathname} />
      </main>
    </div>
  );
}

export default AppLayout;
