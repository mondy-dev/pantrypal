import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import RequireHousehold from "./components/RequireHousehold";
import CreateHousehold from "./pages/CreateHousehold";
import Household from "./pages/Household";
import Inventory from "./pages/Inventory";
import Expiration from "./pages/Expiration";
import History from "./pages/History";
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <RequireHousehold>
              <Dashboard />
            </RequireHousehold>
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-household"
        element={
          <ProtectedRoute>
            <CreateHousehold />
          </ProtectedRoute>
        }
      />
      <Route
        path="/household"
        element={
          <ProtectedRoute>
            <RequireHousehold>
              <Household />
            </RequireHousehold>
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <RequireHousehold>
              <Inventory />
            </RequireHousehold>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expiration"
        element={
          <ProtectedRoute>
            <RequireHousehold>
              <Expiration />
            </RequireHousehold>
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <RequireHousehold>
              <History />
            </RequireHousehold>
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
