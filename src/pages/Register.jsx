import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import AuthPageLayout from "../components/AuthPageLayout.jsx"
import { useAuth } from "../context/AuthContext.jsx"
import { useStore } from "../context/StoreContext.jsx"

function safeDestination(value) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : ""
}

export default function Register() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState("client")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { register, demoAccounts } = useAuth()
  const { startConversation } = useStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const destination = safeDestination(searchParams.get("redirect"))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    if (fullName.trim().length < 2) {
      setError("Enter a name with at least two characters.")
      return
    }
    if (password.length < 8) {
      setError("Use at least 8 characters for this demo password.")
      return
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match.")
      return
    }
    if (demoAccounts.some((account) => account.email === email.trim().toLowerCase())) {
      setError("That email belongs to a preset demo account. Sign in with its listed credentials instead.")
      return
    }

    setLoading(true)
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 250))
      const user = register({ name: fullName.trim(), email: email.trim(), role })
      const requestedPerson =
        destination.startsWith("/dashboard/messages?")
          ? new URLSearchParams(destination.split("?")[1]).get("person")
          : null
      if (user.role !== "seller" && requestedPerson) {
        startConversation(requestedPerson)
      }
      navigate(
        destination || (role === "freelancer" ? "/seller/dashboard" : "/dashboard"),
        { replace: true },
      )
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create a demo session.",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthPageLayout
      heading="Start your professional creative journey."
      subtitle="Choose a buyer or seller demo workspace. This form creates a browser demo session, not a production account."
    >
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-gray-900">Create a demo account</h2>
        <p className="text-sm text-gray-500 mt-1">
          No password is saved or sent to a server. Use the preset accounts for repeat sign-in.
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
        <label className="block text-sm font-semibold text-gray-700" htmlFor="register-name">
          Full name
          <input
            id="register-name"
            type="text"
            autoComplete="name"
            minLength={2}
            maxLength={80}
            required
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Your name"
            className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
          />
        </label>

        <label className="block text-sm font-semibold text-gray-700" htmlFor="register-email">
          Work email
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.com"
            className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
          />
        </label>

        <label className="block text-sm font-semibold text-gray-700" htmlFor="register-role">
          I want to
          <select
            id="register-role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm bg-white"
          >
            <option value="client">Hire for a project (Buyer)</option>
            <option value="freelancer">Work as a freelancer (Seller)</option>
          </select>
        </label>

        <div>
          <label className="block text-sm font-semibold text-gray-700" htmlFor="register-password">
            Demo password
          </label>
          <div className="relative mt-1">
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
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

        <label className="block text-sm font-semibold text-gray-700" htmlFor="register-confirm-password">
          Confirm demo password
          <input
            id="register-confirm-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-md transition-all text-sm disabled:cursor-wait disabled:opacity-60"
        >
          {loading ? "Creating demo session…" : "Create demo session"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-600">
        Already have a demo account?{" "}
        <Link
          to={`/login${destination ? `?redirect=${encodeURIComponent(destination)}` : ""}`}
          className="font-semibold text-green-600 hover:underline"
        >
          Sign in
        </Link>
      </p>
      <Link to="/" className="mt-4 text-center text-xs text-gray-500 hover:text-green-700">
        Back to marketplace
      </Link>
    </AuthPageLayout>
  )
}
