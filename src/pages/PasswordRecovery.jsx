import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import AuthPageLayout from "../components/AuthPageLayout.jsx"
import { useAuth } from "../context/AuthContext.jsx"

function safeDestination(value) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : ""
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [requested, setRequested] = useState(false)
  const [loading, setLoading] = useState(false)
  const { requestPasswordReset } = useAuth()
  const [searchParams] = useSearchParams()
  const destination = safeDestination(searchParams.get("redirect"))

  const submit = async (event) => {
    event.preventDefault()
    setError("")
    setLoading(true)
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 200))
      if (!requestPasswordReset(email)) {
        throw new Error("Use one of the listed demo account email addresses.")
      }
      setRequested(true)
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to start the demo password reset.",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthPageLayout
      heading="A clear path back to your demo account."
      subtitle="Password recovery is simulated locally. No email is sent and no production identity service is connected."
    >
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-gray-900">Forgot password?</h2>
        <p className="text-sm text-gray-500 mt-1">
          Enter the email for a preset demo account to continue.
        </p>
      </div>
      {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
      {requested ? (
        <div className="space-y-4" role="status">
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            Demo reset request accepted for <strong>{email}</strong>. No email was sent. Continue to the local reset form in this active session.
          </p>
          <Link
            className="button button-primary full"
            to={`/reset-password?email=${encodeURIComponent(email.trim().toLowerCase())}${destination ? `&redirect=${encodeURIComponent(destination)}` : ""}`}
          >
            Continue to reset password
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700" htmlFor="recovery-email">
            Demo account email
            <input
              id="recovery-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="buyer@demo.com"
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500"
            />
          </label>
          <p className="text-xs text-gray-500">
            Preset emails: buyer@demo.com and seller@demo.com
          </p>
          <button
            className="w-full rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? "Checking demo account…" : "Continue"}
          </button>
        </form>
      )}
      <Link
        to={`/login${destination ? `?redirect=${encodeURIComponent(destination)}` : ""}`}
        className="mt-5 block text-center text-sm font-semibold text-green-700"
      >
        Back to sign in
      </Link>
    </AuthPageLayout>
  )
}

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState(searchParams.get("email") || "")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [complete, setComplete] = useState(false)
  const [loading, setLoading] = useState(false)
  const { resetDemoPassword, demoAccounts } = useAuth()
  const navigate = useNavigate()
  const destination = safeDestination(searchParams.get("redirect"))
  const matchingAccount = demoAccounts.some(
    (account) => account.email === email.trim().toLowerCase(),
  )

  const submit = async (event) => {
    event.preventDefault()
    setError("")
    if (password.length < 8) {
      setError("Use at least 8 characters.")
      return
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match.")
      return
    }
    setLoading(true)
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 200))
      resetDemoPassword(email, password)
      setComplete(true)
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to reset this demo password.",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthPageLayout
      heading="Reset a demo password for this session."
      subtitle="This local-only reset does not verify identity or send an email. The updated demo password is held in memory and resets when the app is refreshed."
    >
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-gray-900">Reset demo password</h2>
        <p className="text-sm text-gray-500 mt-1">
          Only the two preset demo accounts are supported.
        </p>
      </div>
      {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
      {complete ? (
        <div className="space-y-4" role="status">
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            Demo password changed for this active app session only. It is not stored securely and returns to the published demo credential after refresh.
          </p>
          <button
            type="button"
            className="button button-primary full"
            onClick={() =>
              navigate(
                `/login?email=${encodeURIComponent(email.trim().toLowerCase())}${destination ? `&redirect=${encodeURIComponent(destination)}` : ""}`,
                { replace: true },
              )
            }
          >
            Return to sign in
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700" htmlFor="reset-email">
            Demo account email
            <select
              id="reset-email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
            >
              <option value="">Select a demo account</option>
              {demoAccounts.map((account) => (
                <option value={account.email} key={account.email}>
                  {account.email}
                </option>
              ))}
            </select>
          </label>
          {matchingAccount && (
            <>
              <label className="block text-sm font-semibold text-gray-700" htmlFor="reset-password">
                New demo password
                <span className="relative mt-1 block">
                  <input
                    id="reset-password"
                    type={showPassword ? "text" : "password"}
                    minLength={8}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-sm"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </span>
              </label>
              <label className="block text-sm font-semibold text-gray-700" htmlFor="reset-confirm">
                Confirm new password
                <input
                  id="reset-confirm"
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                />
              </label>
            </>
          )}
          <button
            className="w-full rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
            type="submit"
            disabled={loading || !matchingAccount}
          >
            {loading ? "Updating demo password…" : "Reset demo password"}
          </button>
        </form>
      )}
      <Link
        to={`/login${destination ? `?redirect=${encodeURIComponent(destination)}` : ""}`}
        className="mt-5 block text-center text-sm font-semibold text-green-700"
      >
        Back to sign in
      </Link>
    </AuthPageLayout>
  )
}
