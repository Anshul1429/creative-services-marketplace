import { useEffect, useState } from "react"
import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Clock3,
  Code2,
  Globe2,
  Heart,
  HelpCircle,
  LayoutDashboard,
  Menu,
  MessageCircle,
  PanelsTopLeft,
  PenTool,
  Play,
  Search,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  UserRound,
  WalletCards,
  X,
  Layers,       // 👈 Naya Icon
  ShieldCheck,  // 👈 Naya Icon
} from "lucide-react"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { categories, freelancers } from "../services/data.js"
import { useStore } from "../context/StoreContext.jsx"
import { useAuth } from "../context/AuthContext.jsx"
import Navbar, { categoryIcons } from "./Navbar.jsx"
import Footer from "./Footer.jsx"

export { Button } from "./Navbar.jsx"

const fallbackImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'%3E%3Crect width='800' height='500' fill='%23eef6f1'/%3E%3Cpath d='M0 390 190 220l130 120 115-95 365 255H0z' fill='%23d8e9df'/%3E%3Ccircle cx='600' cy='140' r='52' fill='%23c3decf'/%3E%3Ctext x='400' y='455' text-anchor='middle' font-family='Arial,sans-serif' font-size='22' fill='%234b6355'%3EDemo image unavailable%3C/text%3E%3C/svg%3E"

export function MarketplaceImage({ src, alt, className = "", ...props }) {
  const [imageSrc, setImageSrc] = useState(src)
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    setImageSrc(src)
    setLoaded(false)
  }, [src])
  return (
    <img
      {...props}
      src={imageSrc}
      alt={alt}
      aria-busy={!loaded}
      className={`${className} ${loaded ? "" : "marketplace-image-loading"}`.trim()}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => {
        setLoaded(true)
        if (imageSrc !== fallbackImage) setImageSrc(fallbackImage)
      }}
    />
  )
}

export function PageShell({ children, compact = false }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      {!compact && <Footer />}
    </>
  )
}

export function SectionHeader({ eyebrow, title, detail, action }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {detail && <p>{detail}</p>}
      </div>
      {action && (
        <Link className="text-link" to={action.to}>
          {action.label}
          <ArrowRight size={17} />
        </Link>
      )}
    </div>
  )
}

export function ServiceCard({ service }) {
  const freelancer = freelancers.find(
    (item) => item.id === service.freelancerId,
  )
  const { favorites, toggleFavorite } = useStore()
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const favorite = favorites.includes(service.id)
  const toggleOrRequestLogin = () => {
    if (user) {
      toggleFavorite(service.id)
      return
    }
    const destination = `${location.pathname}${location.search}`
    navigate(`/login?redirect=${encodeURIComponent(destination)}`)
  }
  return (
    <article className="service-card">
      <div className="service-image-wrap">
        <Link to={`/service/${service.id}`}>
          <MarketplaceImage src={service.image} alt={service.title} className="service-image" />
        </Link>
        <button
          className={`favorite-button ${favorite ? "is-favorite" : ""}`}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          onClick={toggleOrRequestLogin}
          title={user ? "Save this service" : "Sign in to save this service"}
        >
          <Heart size={18} fill={favorite ? "currentColor" : "none"} />
        </button>
        <span className="service-tag">{service.subcategory}</span>
      </div>
      <div className="service-body">
        <Link to={`/freelancer/${freelancer.id}`} className="freelancer-mini">
          <MarketplaceImage src={freelancer.avatar} alt={freelancer.name} />
          <span>{freelancer.name}</span>
        </Link>
        <Link to={`/service/${service.id}`} className="service-title">
          {service.title}
        </Link>
        <span className={`service-availability ${service.available ? "available" : "unavailable"}`}>
          {service.available ? "Available in demo" : "Unavailable in demo"}
        </span>
        <div className="rating">
          <Star size={15} fill="currentColor" />
          <strong>Demo {service.rating}</strong>
          <span>({service.reviews} sample)</span>
          <span className="dot" /> <Clock3 size={14} />{" "}
          {service.packages[0].delivery} days
        </div>
        <div className="service-price">
          <span>Starting at</span>
          <strong>₹{service.packages[0].price.toLocaleString("en-IN")}</strong>
        </div>
      </div>
    </article>
  )
}

export function CategoryCard({ category }) {
  const Icon = categoryIcons[category.icon] || Sparkles
  return (
    <Link className="category-card" to={`/categories/${category.slug}`}>
      <div className="category-icon">
        <Icon />
      </div>
      <h3>{category.name}</h3>
      <p>{category.description}</p>
      <span>
        Explore category <ArrowRight size={16} />
      </span>
    </Link>
  )
}

export function EmptyState({ icon: Icon = Search, title, detail, action }) {
  return (
    <div className="empty-state">
      <span>
        <Icon />
      </span>
      <h3>{title}</h3>
      <p>{detail}</p>
      {action}
    </div>
  )
}

const clientLinks = [
  ["/dashboard", "Overview", LayoutDashboard],
  ["/dashboard/orders", "Orders", ShoppingBag],
  ["/dashboard/favorites", "Favorites", Heart],
  ["/dashboard/messages", "Messages", MessageCircle],
  ["/dashboard/notifications", "Notifications", Bell],
  ["/dashboard/briefs", "Briefs", BriefcaseBusiness],
  ["/dashboard/billing", "Billing", WalletCards],
  ["/dashboard/settings", "Settings", UserRound],
]

const sellerLinks = [
  ["/seller/dashboard", "Overview", LayoutDashboard],
  ["/seller/services", "My services", Sparkles],
  ["/seller/orders", "Orders", ShoppingBag],
  ["/seller/messages", "Messages", MessageCircle],
  ["/seller/portfolio", "Portfolio", PanelsTopLeft],
  ["/seller/analytics", "Analytics", Star],
  ["/seller/earnings", "Earnings", WalletCards],
  ["/seller/settings", "Settings", UserRound],
]

export function DashboardShell({
  children,
  seller = false,
  title,
  subtitle,
  action,
}) {
  const links = seller ? sellerLinks : clientLinks
  const location = useLocation()
  const navigate = useNavigate()
  const activePath = [...links]
    .sort((left, right) => right[0].length - left[0].length)
    .find(([path]) => location.pathname === path || location.pathname.startsWith(`${path}/`))?.[0] || links[0][0]
  return (
    <PageShell compact>
      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <span className="workspace-label">
            {seller ? "Freelancer workspace" : "Client workspace"}
          </span>
          <nav>
            {links.map(([path, label, Icon]) => (
              <NavLink
                key={path}
                to={path}
                end={path.endsWith("dashboard")}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <Icon size={18} /> {label}
              </NavLink>
            ))}
          </nav>
          <div className="sidebar-help">
            <HelpCircle />
            <strong>Need a hand?</strong>
            <span>Our demo support centre is ready.</span>
            <Link to="/help">Visit help center</Link>
          </div>
        </aside>
        <section className="dashboard-main">
          <div className="dashboard-mobile-nav">
            <select
              value={activePath}
              onChange={(e) => navigate(e.target.value)}
              aria-label="Dashboard section"
            >
              {links.map(([path, label]) => (
                <option value={path} key={path}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="dashboard-head">
            <div>
              <span className="eyebrow">
                {seller ? "Seller studio" : "My account"}
              </span>
              <h1>{title}</h1>
              {subtitle && <p>{subtitle}</p>}
            </div>
            {action}
          </div>
          {children}
        </section>
      </div>
    </PageShell>
  )
}

export function StatCard({ label, value, trend, icon: Icon }) {
  return (
    <div className="stat-card">
      <span>
        <Icon />
      </span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
        <em>{trend}</em>
      </div>
    </div>
  )
}

export function StatusBadge({ status }) {
  const slug = status.toLowerCase().replace(/ /g, "-")
  return (
    <span className={`status status-${slug}`}>
      <i />
      {status}
    </span>
  )
}

// 👇 NAYA ATTRACTIVE TRUST STRIP 👇
export function TrustStrip() {
  const stats = [
    { 
      value: "4.8/5", 
      label: "Average demo rating", 
      icon: <Star size={22} fill="#f59e0b" stroke="none" />,
      bgColor: "#fffbeb", 
      iconColor: "#d97706"
    },
    { 
      value: "18+", 
      label: "Curated services", 
      icon: <Sparkles size={22} />,
      bgColor: "var(--mint)", 
      iconColor: "var(--green-deep)"
    },
    { 
      value: "6", 
      label: "Creative disciplines", 
      icon: <Layers size={22} />,
      bgColor: "var(--blue-soft)", 
      iconColor: "var(--blue)"
    },
    { 
      value: "100%", 
      label: "Transparent packages", 
      icon: <ShieldCheck size={22} />,
      bgColor: "#f4f3ff", 
      iconColor: "#6d28d9"
    }
  ];

  return (
    <div className="trust-strip-premium">
      {stats.map((stat, index) => (
        <div className="trust-item" key={index}>
          <div 
            className="trust-icon-wrap" 
            style={{ backgroundColor: stat.bgColor, color: stat.iconColor }}
          >
            {stat.icon}
          </div>
          <div className="trust-text">
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CheckList({ items }) {
  return (
    <ul className="check-list">
      {items.map((item) => (
        <li key={item}>
          <Check size={16} />
          {item}
        </li>
      ))}
    </ul>
  )
}