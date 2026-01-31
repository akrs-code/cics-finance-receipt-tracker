import { AuthProvider } from '../context/AuthContext.jsx';
import { useAuth } from '../hooks/useAuth.js';
import Dashboard from "../pages/Dashboard.jsx"
import Login from "../pages/Login.jsx"
import ReceiptDetails from '../pages/ReceiptDetails.jsx';
import Receipts from '../pages/Receipts.jsx';
import { Routes, Route, Navigate, Outlet } from "react-router-dom"

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/receipt" element={<Receipts />} />
          <Route path="/receipt/:id" element={<ReceiptDetails />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

function PrivateRoute() {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" replace />
  }
  return <Outlet />;
}

export default App