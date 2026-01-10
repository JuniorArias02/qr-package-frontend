import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './views/Login'
import Register from './views/Register'
import CreateUser from './views/CreateUser'
import Dashboard from './views/Dashboard'
import Scan from './views/Scan'
import History from './views/History'
import Profile from './views/Profile'
import ForgotPassword from './views/ForgotPassword'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Public Register - hidden from UI but accessible */}
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/users/create" element={<CreateUser />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
