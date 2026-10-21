import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

function roleMatches(userRole, requiredRole) {
  if (!requiredRole) return true
  if (requiredRole === "seller") {
    return userRole === "seller" || userRole === "freelancer"
  }
  return userRole === "client" || userRole === "buyer"
}

export default function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth()
  const location = useLocation()
  const destination = `${location.pathname}${location.search}${location.hash}`

  if (!user) {
    const query = new URLSearchParams({ redirect: destination })
    return <Navigate to={`/login?${query}`} replace />
  }

  if (!roleMatches(user.role, requiredRole)) {
    const query = new URLSearchParams({
      required: requiredRole,
      from: destination,
    })
    return <Navigate to={`/unauthorized?${query}`} replace />
  }

  return children || <Outlet />
}
