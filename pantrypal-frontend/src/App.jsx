import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateHousehold from "./pages/CreateHousehold";
import Household from "./pages/Household";
import Inventory from "./pages/Inventory";
import Expiration from "./pages/Expiration";
import ShoppingList from "./pages/ShoppingList";
import History from "./pages/History";
import Reports from "./pages/Reports";
import ProtectedRoute from "./components/ProtectedRoute";
import RequireHousehold from "./components/RequireHousehold";
import AppLayout from "./layouts/AppLayout";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/create-household"
        element={
          <ProtectedRoute>
            <CreateHousehold />
          </ProtectedRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <RequireHousehold>
              <AppLayout />
            </RequireHousehold>
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/household" element={<Household />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/expiration" element={<Expiration />} />
        <Route path="/shopping-list" element={<ShoppingList />} />
        <Route path="/history" element={<History />} />
        <Route path="/reports" element={<Reports />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
