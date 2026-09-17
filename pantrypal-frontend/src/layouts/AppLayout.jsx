import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  Package,
  Clock,
  ShoppingCart,
  History as HistoryIcon,
  BarChart3,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/useAuth";
import { useHousehold } from "../context/useHousehold";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/household", label: "Household", icon: Home },
  { to: "/inventory", label: "Inventory", icon: Package },
  { to: "/expiration", label: "Expiration", icon: Clock },
  { to: "/shopping-list", label: "Shopping List", icon: ShoppingCart },
  { to: "/history", label: "History", icon: HistoryIcon },
  { to: "/reports", label: "Reports", icon: BarChart3 },
];

function AppLayout() {
  const { logout } = useAuth();
  const { clearHousehold } = useHousehold();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    clearHousehold();
    navigate("/login");
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-wordmark">PantryPal</div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                "sidebar-link" + (isActive ? " active" : "")
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button type="button" className="sidebar-logout" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
