import { useEffect, useState } from "react"
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext.jsx"
import { StoreProvider } from "./context/StoreContext.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import RouteErrorBoundary from "./components/RouteErrorBoundary.jsx"
import Home from "./pages/Home.jsx"
import { CategoryPage, ExplorePage } from "./pages/Explore.jsx"
import GigDetails from "./pages/GigDetails.jsx"
import { FreelancerPage, PortfolioPage } from "./pages/Profiles.jsx"
import { CheckoutPage } from "./pages/Checkout.jsx"
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import { ForgotPasswordPage, ResetPasswordPage } from "./pages/PasswordRecovery.jsx"
import { InfoPage } from "./pages/Info.jsx"
import { OnboardingPage } from "./pages/Onboarding.jsx"
import { NotFoundPage, UnauthorizedPage } from "./pages/NotFound.jsx"
import CreateGig from "./pages/CreateGig.jsx"
import PremiumSellers from "./pages/PremiumSellers.jsx";
import CreatePremiumProfile from "./pages/CreatePremiumProfile.jsx";
import {
  BuyerBillingPage,
  BuyerBriefFormPage,
  BuyerBriefsPage,
  BuyerOrderDetailPage,
  BuyerReviewsPage,
  BuyerSettingsPage,
  BuyerSupportPage,
} from "./pages/BuyerWorkflows.jsx"
import {
  AnalyticsPage,
  ClientDashboard,
  EarningsPage,
  FavoritesPage,
  GenericDashboardPage,
  MessagesPage,
  NotificationsPage,
  OrderDetailPage,
  OrdersPage,
  SellerDashboard,
  SellerPortfolioPage,
  SellerProfilePage,
  SellerReviewsPage,
  SellerServicesPage,
  SettingsPage,
} from "./pages/Dashboard.jsx"
import { categories, freelancers, portfolios } from "./services/data.js"
import { useStore } from "./context/StoreContext.jsx"

function RouteMetadata() {
  const location = useLocation()
  const { getService } = useStore()
  const serviceId = location.pathname.match(/^\/service\/([^/]+)/)?.[1]
  const service = serviceId ? getService(serviceId) : null

  useEffect(() => {
    const path = location.pathname
    const categorySlug = path.match(/^\/categories\/([^/]+)/)?.[1]
    const category = categories.find((item) => item.slug === categorySlug)
    const infoPages = {
      "/about": ["About the marketplace", "Learn about this creative services marketplace demo."],
      "/how-it-works": ["How it works", "Explore the illustrative project process in the creative services marketplace demo."],
      "/resources": ["Creative resources", "Practical guidance for planning a creative project."],
      "/contact": ["Contact", "Contact the marketplace demo support team."],
      "/help": ["Help center", "Find answers about using this frontend marketplace demo."],
      "/terms": ["Terms", "Terms for using this frontend-only marketplace demo."],
      "/privacy": ["Privacy", "Learn how this demo handles browser-local sample data."],
      "/become-a-freelancer": ["Become a freelancer", "Learn about the seller demo experience."],
    }
    let title = "Creative Services Marketplace | FreeLancerGraphic"
    let description = "Discover creative services and illustrative freelancer profiles in this frontend marketplace demo."
    let indexable = false

    if (path === "/") {
      title = "Find creative freelancers | FreeLancerGraphic"
      indexable = true
    } else if (path === "/explore" || path === "/search") {
      title = "Explore creative services | FreeLancerGraphic"
      indexable = true
    } else if (category) {
      title = `${category.name} services | FreeLancerGraphic`
      description = category.description
      indexable = true
    } else if (path.startsWith("/service/") && service) {
      title = `${service.title} | FreeLancerGraphic`
      description = service.description
      indexable = true
    } else if (path.startsWith("/freelancer/")) {
      const freelancerId = path.slice("/freelancer/".length)
      const freelancer = freelancers.find((item) => item.id === freelancerId)
      title = freelancer
        ? `${freelancer.name} | Freelancer profile`
        : "Page not found | FreeLancerGraphic"
      indexable = Boolean(freelancer)
    } else if (path.startsWith("/portfolio/")) {
      const portfolioId = path.slice("/portfolio/".length)
      const portfolio = portfolios.find((item) => item.id === portfolioId)
      title = portfolio
        ? `${portfolio.title} | Creative portfolio`
        : "Page not found | FreeLancerGraphic"
      indexable = Boolean(portfolio)
    } else if (infoPages[path]) {
      ;[title, description] = infoPages[path]
      indexable = true
    } else if (path === "/login" || path === "/register" || path === "/signup") {
      title = `${path === "/login" ? "Sign in" : "Join"} | FreeLancerGraphic demo`
    } else if (path === "/forgot-password") {
      title = "Forgot password | FreeLancerGraphic demo"
    } else if (path === "/reset-password") {
      title = "Reset password | FreeLancerGraphic demo"
    } else if (path.startsWith("/dashboard") || path.startsWith("/seller") || path.startsWith("/checkout")) {
      title = "Demo workspace | FreeLancerGraphic"
    } else if (path === "/unauthorized") {
      title = "Access unavailable | FreeLancerGraphic"
    } else {
      title = "Page not found | FreeLancerGraphic"
    }

    const setMeta = (selector, attributes, content) => {
      let element = document.head.querySelector(selector)
      if (!element) {
        element = document.createElement("meta")
        Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value))
        document.head.appendChild(element)
      }
      element.setAttribute("content", content)
    }
    document.title = title
    setMeta('meta[name="description"]', { name: "description" }, description)
    setMeta('meta[name="robots"]', { name: "robots" }, indexable ? "index, follow" : "noindex, nofollow")
    setMeta('meta[property="og:title"]', { property: "og:title" }, title)
    setMeta('meta[property="og:description"]', { property: "og:description" }, description)
  }, [location.pathname, service?.title, service?.description])

  return null
}

function SignupAlias() {
  const location = useLocation()
  return (
    <Navigate
      to={{ pathname: "/register", search: location.search }}
      replace
    />
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StoreProvider>
          <RouteErrorBoundary>
            <RouteMetadata />
            <Routes>
              
              {/* Home page par hi rahega. /register par bhi Home page dikhayenge taaki popup wahi khule */}
             <Route path="/" element={<Home />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/signup" element={<Navigate to="/register" replace />} />
              
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/search" element={<ExplorePage />} />
              <Route
                path="/categories/:categorySlug"
                element={<CategoryPage />}
              />
              <Route
                path="/categories/:categorySlug/:subcategorySlug"
                element={<CategoryPage />}
              />
              <Route path="/service/:serviceId" element={<GigDetails />} />
              <Route
                path="/freelancer/:freelancerId"
                element={<FreelancerPage />}
              />
              <Route path="/portfolio/:portfolioId" element={<PortfolioPage />} />
              <Route
                path="/checkout/:serviceId"
                element={
                  <ProtectedRoute requiredRole="buyer">
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              
              <Route path="/login" element={<Login />} />
              
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route
                path="/how-it-works"
                element={<InfoPage type="how-it-works" />}
              />
              <Route
                path="/become-a-freelancer"
                element={<InfoPage type="become-a-freelancer" />}
              />
              <Route path="/resources" element={<InfoPage type="resources" />} />
              <Route path="/about" element={<InfoPage type="about" />} />
              <Route path="/contact" element={<InfoPage type="contact" />} />
              <Route path="/help" element={<InfoPage type="help" />} />
              <Route path="/terms" element={<InfoPage type="terms" />} />
              <Route path="/privacy" element={<InfoPage type="privacy" />} />
              
              <Route
                path="/dashboard"
                element={<ProtectedRoute requiredRole="buyer"><ClientDashboard /></ProtectedRoute>}
              />
              <Route
                path="/dashboard/favorites"
                element={<ProtectedRoute requiredRole="buyer"><FavoritesPage /></ProtectedRoute>}
              />
              <Route
                path="/dashboard/orders"
                element={<ProtectedRoute requiredRole="buyer"><OrdersPage /></ProtectedRoute>}
              />
              <Route
                path="/dashboard/orders/:orderId"
                element={<ProtectedRoute requiredRole="buyer"><BuyerOrderDetailPage /></ProtectedRoute>}
              />
              <Route
                path="/dashboard/messages"
                element={<ProtectedRoute requiredRole="buyer"><MessagesPage /></ProtectedRoute>}
              />
              <Route
                path="/dashboard/messages/:conversationId"
                element={<ProtectedRoute requiredRole="buyer"><MessagesPage /></ProtectedRoute>}
              />
              <Route
                path="/dashboard/notifications"
                element={<ProtectedRoute requiredRole="buyer"><NotificationsPage /></ProtectedRoute>}
              />
              <Route
                path="/dashboard/settings"
                element={<ProtectedRoute requiredRole="buyer"><BuyerSettingsPage /></ProtectedRoute>}
              />
              <Route
                path="/dashboard/briefs"
                element={<ProtectedRoute requiredRole="buyer"><BuyerBriefsPage /></ProtectedRoute>}
              />
              <Route
                path="/dashboard/briefs/new"
                element={<ProtectedRoute requiredRole="buyer"><BuyerBriefFormPage /></ProtectedRoute>}
              />
              <Route
                path="/dashboard/billing"
                element={<ProtectedRoute requiredRole="buyer"><BuyerBillingPage /></ProtectedRoute>}
              />
              <Route
                path="/dashboard/support"
                element={<ProtectedRoute requiredRole="buyer"><BuyerSupportPage /></ProtectedRoute>}
              />
              <Route
                path="/dashboard/reviews"
                element={<ProtectedRoute requiredRole="buyer"><BuyerReviewsPage /></ProtectedRoute>}
              />
              <Route
                path="/seller/onboarding"
                element={<ProtectedRoute requiredRole="seller"><OnboardingPage /></ProtectedRoute>}
              />
              <Route
                path="/seller/dashboard"
                element={<ProtectedRoute requiredRole="seller"><SellerDashboard /></ProtectedRoute>}
              />
              <Route
                path="/seller/services"
                element={<ProtectedRoute requiredRole="seller"><SellerServicesPage /></ProtectedRoute>}
              />
              <Route
                path="/seller/services/new"
                element={<ProtectedRoute requiredRole="seller"><CreateGig /></ProtectedRoute>}
              />
              <Route
                path="/seller/services/:serviceId/edit"
                element={<ProtectedRoute requiredRole="seller"><CreateGig /></ProtectedRoute>}
              />
              <Route
                path="/seller/orders"
                element={<ProtectedRoute requiredRole="seller"><OrdersPage seller /></ProtectedRoute>}
              />
              <Route
                path="/seller/orders/:orderId"
                element={<ProtectedRoute requiredRole="seller"><OrderDetailPage seller /></ProtectedRoute>}
              />
              <Route
                path="/seller/messages"
                element={<ProtectedRoute requiredRole="seller"><MessagesPage seller /></ProtectedRoute>}
              />
              <Route
                path="/seller/messages/:conversationId"
                element={<ProtectedRoute requiredRole="seller"><MessagesPage seller /></ProtectedRoute>}
              />
              <Route
                path="/seller/portfolio"
                element={<ProtectedRoute requiredRole="seller"><SellerPortfolioPage /></ProtectedRoute>}
              />
              <Route
                path="/seller/analytics"
                element={<ProtectedRoute requiredRole="seller"><AnalyticsPage /></ProtectedRoute>}
              />
              <Route
                path="/seller/earnings"
                element={<ProtectedRoute requiredRole="seller"><EarningsPage /></ProtectedRoute>}
              />
              <Route
                path="/seller/settings"
                element={<ProtectedRoute requiredRole="seller"><SettingsPage seller /></ProtectedRoute>}
              />
              <Route
                path="/seller/reviews"
                element={<ProtectedRoute requiredRole="seller"><SellerReviewsPage /></ProtectedRoute>}
              />
              <Route
                path="/seller/profile"
                element={<ProtectedRoute requiredRole="seller"><SellerProfilePage /></ProtectedRoute>}
              />
              <Route path="/premium-sellers" element={<PremiumSellers />} />
              <Route path="/create-premium-profile" element={<CreatePremiumProfile />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </RouteErrorBoundary>
        </StoreProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}