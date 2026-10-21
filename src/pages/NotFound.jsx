import { useMemo, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Clock3,
  FileCheck2,
  Globe2,
  Heart,
  LockKeyhole,
  MessageCircle,
  Play,
  Search,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Upload,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import {
  Button,
  CategoryCard,
  CheckList,
  EmptyState,
  PageShell,
  SectionHeader,
  ServiceCard,
  StatusBadge,
  TrustStrip,
} from "../components/SharedComponents.jsx"
import {
  categories,
  freelancers,
  portfolios,
  services,
} from "../services/data.js"
import { useAuth } from "../context/AuthContext.jsx"
import { useStore } from "../context/StoreContext.jsx"

export function NotFoundPage() {
  return (
    <PageShell>
      <div className="not-found">
        <span>404</span>
        <h1>This page wandered off brief.</h1>
        <p>Let’s get you back to the marketplace.</p>
        <Link className="button button-primary" to="/">
          Return home
        </Link>
      </div>
    </PageShell>
  )
}

export function UnauthorizedPage() {
  const { user, switchRole } = useAuth()
  const [searchParams] = useSearchParams()
  const requiredRole = searchParams.get("required") === "seller" ? "seller" : "buyer"
  const requestedDestination = searchParams.get("from")
  const destination =
    requestedDestination?.startsWith("/") && !requestedDestination.startsWith("//")
      ? requestedDestination
      : ""
  const workspace =
    requiredRole === "seller" ? "/seller/dashboard" : "/dashboard"

  return (
    <PageShell>
      <div className="not-found">
        <span>
          <LockKeyhole />
        </span>
        <h1>{user ? "This demo account has the wrong role." : "Sign in to continue."}</h1>
        <p>
          This destination requires a {requiredRole} demo account. These
          frontend-only role checks are not production security.
        </p>
        {user ? (
          <div className="flex flex-wrap justify-center gap-3">
            <button
              className="button button-primary"
              onClick={() => {
                switchRole(requiredRole)
                window.location.replace(destination || workspace)
              }}
            >
              Switch to {requiredRole} demo mode
            </button>
            <Link className="button button-secondary" to={user.role === "seller" ? "/seller/dashboard" : "/dashboard"}>
              Go to my workspace
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              className="button button-primary"
              to={`/login?${new URLSearchParams({
                redirect: destination || workspace,
              })}`}
            >
              Sign in to demo
            </Link>
            <Link className="button button-secondary" to="/register">
              Create a demo account
            </Link>
          </div>
        )}
      </div>
    </PageShell>
  )
}
