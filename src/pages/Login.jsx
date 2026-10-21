import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom"
import AuthPageLayout from "../components/AuthPageLayout.jsx"
import { useAuth } from "../context/AuthContext.jsx"
import { useStore } from "../context/StoreContext.jsx"

function safeDestination(value) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : ""
}

export default function Login() {
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState(searchParams.get("email") || "")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { authenticate, demoAccounts } = useAuth()
  const { startConversation } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const redirect = safeDestination(searchParams.get("redirect"))
  const stateDestination = safeDestination(
    location.state?.from
      ? `${location.state.from.pathname || ""}${location.state.from.search || ""}${location.state.from.hash || ""}`
      : "",
  )
  const destination = redirect || stateDestination

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    setLoading(true)
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 250))
      const user = authenticate(email, password)
      const requestedPerson =
        destination.startsWith("/dashboard/messages?")
          ? new URLSearchParams(destination.split("?")[1]).get("person")
          : null
      if (user.role !== "seller" && requestedPerson) {
        startConversation(requestedPerson)
      }
      navigate(
        destination || (user.role === "seller" ? "/seller/dashboard" : "/dashboard"),
        { replace: true },
      )
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to sign in to this demo account.",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthPageLayout
      heading="Every great journey starts with a single step."
      subtitle="Connect with creative talent and explore the marketplace using a clearly identified demo account."
    >
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
        <p className="text-sm text-gray-500 mt-1">
          Demo sign-in only. No secure authentication service is connected.
        </p>
      </div>

      <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <strong className="block text-sm text-emerald-900">Demo credentials</strong>
        <p className="mt-1 text-xs text-emerald-800">
          Buyer: buyer@demo.com / buyer123
        </p>
        <p className="text-xs text-emerald-800">
          Seller: seller@demo.com / seller123
        </p>
      </div>

      {error && (
        <div
          className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 text-sm text-red-700 rounded-md"
          role="alert"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-semibold text-gray-700" htmlFor="login-email">
          Work email
          <input
            id="login-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.com"
            className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
          />
        </label>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-700" htmlFor="login-password">
              Password
            </label>
            <Link
              to={`/forgot-password${destination ? `?redirect=${encodeURIComponent(destination)}` : ""}`}
              className="text-xs font-semibold text-green-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your demo password"
              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-md transition-all text-sm disabled:cursor-wait disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in to demo"}
        </button>
      </form>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {demoAccounts.map((account) => (
          <button
            key={account.email}
            type="button"
            onClick={() => {
              setEmail(account.email)
              setPassword(account.role === "seller" ? "seller123" : "buyer123")
              setError("")
            }}
            className="rounded-lg border border-gray-200 px-3 py-2 text-left text-xs text-gray-700 hover:border-green-500"
          >
            Use {account.role === "seller" ? "seller" : "buyer"} demo
          </button>
        ))}
      </div>

      <p className="mt-5 text-center text-sm text-gray-600">
        New here?{" "}
        <Link
          to={`/register${destination ? `?redirect=${encodeURIComponent(destination)}` : ""}`}
          className="font-semibold text-green-600 hover:underline"
        >
          Create a demo account
        </Link>
      </p>
      <Link to="/" className="mt-4 text-center text-xs text-gray-500 hover:text-green-700">
        Back to marketplace
      </Link>
    </AuthPageLayout>
  )
}
