import { useEffect, useRef, useState } from "react"
import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  Code2,
  CreditCard,
  Globe2,
  Heart,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  PanelsTopLeft,
  PenTool,
  Play,
  Search,
  Settings,
  ShoppingBag,
  Smartphone,
  Sparkles,
  UserRound,
  WalletCards,
  X,
  Zap, // 👈 Naya Icon add kiya
} from "lucide-react"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { categories } from "../services/data.js"
import { useStore } from "../context/StoreContext.jsx"
import { useAuth } from "../context/AuthContext.jsx"

export const categoryIcons = {
  PenTool,
  Play,
  Sparkles,
  Code2,
  Smartphone,
  PanelsTopLeft,
  Clapperboard: Play,
}

export function Logo() {
  return (
    <Link to="/" className="logo logo-bold" aria-label="FreeLancerGraphic home">
      <span>FreeLancer</span>
      <strong>Graphic</strong>
    </Link>
  )
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  return (
    <button className={`button button-${variant} ${className}`} {...props}>
      {children}
    </button>
  )
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [focusFirstAccountItem, setFocusFirstAccountItem] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const headerRef = useRef(null)
  const mobileDrawerRef = useRef(null)
  const accountMenuRef = useRef(null)
  const accountTriggerRef = useRef(null)
  const searchTriggerRef = useRef(null)
  const categoriesTriggerRef = useRef(null)
  const menuTriggerRef = useRef(null)

  const { notifications, conversations } = useStore()
  const { user, signOut, switchRole } = useAuth()

  const isSeller = user?.role === "seller" || user?.role === "freelancer"
  const unread = notifications.filter((item) => item.unread).length
  const unreadMessages = conversations.reduce(
    (total, conversation) => total + conversation.unread,
    0,
  )

  const identity = user?.name || user?.email || "Marketplace member"
  const userEmail = user?.email || "No email"
  const firstInitial = identity.trim().charAt(0).toUpperCase()

  // ✅ FIX: Sirf tab active hoga jab category page par ho AUR dropdown band ho
  const isCategoryPage = location.pathname.startsWith("/categories") && !categoriesOpen

  const closeMenus = () => {
    setMenuOpen(false)
    setCategoriesOpen(false)
    setSearchOpen(false)
    setAccountOpen(false)
  }

  useEffect(() => {
    closeMenus()
  }, [location.pathname, location.search])

  useEffect(() => {
    const handlePointerDown = (event) => {
      const target = event.target

      if (!headerRef.current?.contains(target)) {
        closeMenus()
        return
      }

      if (accountOpen && !accountMenuRef.current?.contains(target)) {
        setAccountOpen(false)
      }

      if (
        categoriesOpen &&
        target instanceof Element &&
        !target.closest(".desktop-nav, .mega-menu")
      ) {
        setCategoriesOpen(false)
      }

      if (
        searchOpen &&
        target instanceof Element &&
        !target.closest(".header-popover-anchor")
      ) {
        setSearchOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        const restoreFocus = accountOpen
          ? accountTriggerRef.current
          : menuOpen
            ? menuTriggerRef.current
            : categoriesOpen
              ? categoriesTriggerRef.current
              : searchTriggerRef.current

        closeMenus()
        restoreFocus?.focus()
        return
      }

      if (menuOpen && event.key === "Tab" && mobileDrawerRef.current) {
        const focusable = mobileDrawerRef.current.querySelectorAll(
          'a[href], button:not([disabled])',
        )

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [accountOpen, categoriesOpen, menuOpen, searchOpen])

  useEffect(() => {
    if (menuOpen) {
      mobileDrawerRef.current
        ?.querySelector("a[href], button:not([disabled])")
        ?.focus()
    }
  }, [menuOpen])

  useEffect(() => {
    if (accountOpen && focusFirstAccountItem) {
      accountMenuRef.current
        ?.querySelector('[role="menuitem"]')
        ?.focus()

      setFocusFirstAccountItem(false)
    }
  }, [accountOpen, focusFirstAccountItem])

  const submitSearch = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const query = String(form.get("q") || "").trim()

    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`)
      setSearchOpen(false)
    }
  }

  const signOutAndReturnHome = () => {
    signOut()
    closeMenus()
    window.location.replace("/")
  }

  const accountLinks = isSeller
    ? [
        ["/seller/dashboard", "Seller dashboard", LayoutDashboard],
        ["/seller/services", "Manage services", Sparkles],
        ["/seller/orders", "Orders", ShoppingBag],
        ["/seller/messages", "Inbox", MessageCircle],
        ["/seller/portfolio", "Portfolio", PanelsTopLeft],
        ["/seller/analytics", "Analytics", BriefcaseBusiness],
        ["/seller/earnings", "Earnings", WalletCards],
        ["/seller/reviews", "Reviews", Heart],
        ["/seller/settings", "Settings", Settings],
      ]
    : [
        ["/dashboard", "Dashboard", LayoutDashboard],
        ["/dashboard/favorites", "Favorites", Heart],
        ["/dashboard/orders", "Orders", ShoppingBag],
        ["/dashboard/messages", "Inbox", MessageCircle],
        ["/dashboard/notifications", "Notifications", Bell],
      ]

  const mobileLinks = [
    ["/", "Home"],
    ["/explore", "Explore services"],
    ["/how-it-works", "How it works"],
    ["/resources", "Resources"],
    ...(isSeller
      ? [
          ["/seller/dashboard", "Seller dashboard"],
          ["/seller/services", "Manage services"],
          ["/seller/orders", "Seller orders"],
          ["/seller/messages", "Seller inbox"],
          ["/seller/portfolio", "Portfolio"],
          ["/seller/analytics", "Analytics"],
          ["/seller/earnings", "Earnings"],
          ["/seller/reviews", "Reviews"],
          ["/seller/settings", "Seller settings"],
        ]
      : user
        ? [
            ["/dashboard", "Buyer dashboard"],
            ["/dashboard/favorites", "Favorites"],
            ["/dashboard/orders", "Orders"],
            ["/dashboard/messages", "Inbox"],
            ["/dashboard/notifications", "Notifications"],
            ["/dashboard/settings", "Account settings"],
            ["/dashboard/briefs", "Briefs"],
            ["/dashboard/billing", "Billing & payments"],
            ["/dashboard/support", "Support"],
          ]
        : [
            ["/become-a-freelancer", "Become a freelancer"],
            ["/help", "Help center"],
          ]),
  ]

  return (
    <header className="site-header" ref={headerRef}>
      <div className="header-inner">
        <Logo />

        <nav className="desktop-nav" aria-label="Public navigation">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/explore">Explore</NavLink>

          <button
            ref={categoriesTriggerRef}
            type="button"
            className={`nav-trigger ${isCategoryPage ? "active" : ""}`}
            aria-expanded={categoriesOpen}
            aria-haspopup="true"
            onClick={() => {
              setCategoriesOpen((value) => !value)
              setAccountOpen(false)
            }}
          >
            Categories <ChevronDown size={16} />
          </button>

          <NavLink to="/resources">Resources</NavLink>
          <NavLink to="/how-it-works">How it works</NavLink>

          {!user && (
            <NavLink to="/become-a-freelancer">
              Become a freelancer
            </NavLink>
          )}
        </nav>

        <div className="header-actions">
          
          {/* 👇 SABSE LAST ME ADD KIYA GAYA RUSH BUTTON 👇 */}
          <Link
            to="/premium-sellers"
            className="button button-primary rush-nav-btn"
            style={{
              background: "#d97706",
              border: "none",
              padding: "0 14px",
              minHeight: "38px",
              fontSize: "13px",
              marginRight: "12px",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Zap size={16} fill="currentColor" /> Rush
          </Link>

          <div className="header-popover-anchor">
            <button
              ref={searchTriggerRef}
              type="button"
              className="icon-button"
              aria-label={searchOpen ? "Close search" : "Search"}
              aria-expanded={searchOpen}
              onClick={() => {
                setSearchOpen((value) => !value)
                setAccountOpen(false)
              }}
            >
              {searchOpen ? <X size={21} /> : <Search size={21} />}
            </button>

            {searchOpen && (
              <div className="header-search">
                <form onSubmit={submitSearch} className="container search-shell">
                  <Search size={21} />
                  <input
                    name="q"
                    autoFocus
                    aria-label="Search services"
                    placeholder="Try “brand identity” or “Flutter app”"
                  />
                  <button type="submit">Search</button>
                </form>
              </div>
            )}
          </div>

          {user && (
            <>
              <Link
                className="icon-button has-badge account-shortcut"
                to={isSeller ? "/seller/messages" : "/dashboard/messages"}
                aria-label={`Inbox${unreadMessages ? `, ${unreadMessages} unread messages` : ""}`}
              >
                <MessageCircle size={21} />
                {unreadMessages > 0 && <span>{unreadMessages}</span>}
              </Link>

              {!isSeller && (
                <>
                  <Link
                    className="icon-button has-badge account-shortcut"
                    to="/dashboard/notifications"
                    aria-label={`${unread} unread notifications`}
                  >
                    <Bell size={21} />
                    {unread > 0 && <span>{unread}</span>}
                  </Link>

                  <Link
                    className="icon-button account-shortcut"
                    to="/dashboard/favorites"
                    aria-label="Favorites"
                  >
                    <Heart size={21} />
                  </Link>

                  <Link
                    className="icon-button account-shortcut"
                    to="/dashboard/orders"
                    aria-label="Orders"
                  >
                    <ShoppingBag size={21} />
                  </Link>
                </>
              )}

              <div className="account-menu-anchor" ref={accountMenuRef}>
                <button
                  ref={accountTriggerRef}
                  type="button"
                  className="account-trigger"
                  aria-label={`${identity} account menu`}
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  aria-controls="account-navigation-menu"
                  onClick={() => {
                    setAccountOpen((value) => !value)
                    setCategoriesOpen(false)
                    setSearchOpen(false)
                  }}
                  onKeyDown={(event) => {
                    if (event.key !== "ArrowDown" || accountOpen) return

                    event.preventDefault()
                    setFocusFirstAccountItem(true)
                    setAccountOpen(true)
                  }}
                >
                  <span className="account-avatar" aria-hidden="true">
                    {firstInitial || <UserRound size={18} />}
                  </span>

                  <ChevronDown size={16} />
                </button>

                {accountOpen && (
                  <div
                    className="account-menu"
                    id="account-navigation-menu"
                    role="menu"
                    aria-label="Account navigation"
                    onKeyDown={(event) => {
                      if (
                        !["ArrowDown", "ArrowUp", "Home", "End"].includes(
                          event.key,
                        )
                      ) {
                        return
                      }

                      const items = Array.from(
                        event.currentTarget.querySelectorAll(
                          '[role="menuitem"]:not([aria-disabled="true"])',
                        ),
                      )

                      const index = items.indexOf(document.activeElement)

                      const nextIndex =
                        event.key === "Home"
                          ? 0
                          : event.key === "End"
                            ? items.length - 1
                            : (index +
                                (event.key === "ArrowDown" ? 1 : -1) +
                                items.length) %
                              items.length

                      event.preventDefault()
                      items[nextIndex]?.focus()
                    }}
                  >
                    <div className="account-menu-identity">
                      <span
                        className="account-avatar account-avatar-large"
                        aria-hidden="true"
                      >
                        {firstInitial || <UserRound size={20} />}
                      </span>

                      <span>
                        <strong>{identity}</strong>
                        <small>{userEmail}</small>
                      </span>
                    </div>

                    <div className="demo-auth-note">
                      Demo authentication · session is not securely stored
                    </div>

                    <nav className="account-menu-links" aria-label="Account">
                      {accountLinks.map(([path, label, Icon]) => (
                        <Link
                          key={path}
                          to={path}
                          role="menuitem"
                          onClick={closeMenus}
                        >
                          <Icon size={18} />
                          {label}
                        </Link>
                      ))}
                    </nav>

                    {!isSeller && (
                      <div className="account-menu-section">
                        <span className="account-menu-heading">
                          Your account
                        </span>

                        <Link
                          to="/dashboard/briefs"
                          role="menuitem"
                          onClick={closeMenus}
                        >
                          <BriefcaseBusiness size={18} />
                          Briefs
                        </Link>

                        <Link
                          to="/dashboard/briefs/new?format=job-description"
                          role="menuitem"
                          onClick={closeMenus}
                        >
                          <PenTool size={18} />
                          Post a job description
                        </Link>

                        <Link
                          to="/dashboard/settings"
                          role="menuitem"
                          onClick={closeMenus}
                        >
                          <UserRound size={18} />
                          Profile
                        </Link>

                        <Link
                          to="/dashboard/settings"
                          role="menuitem"
                          onClick={closeMenus}
                        >
                          <Settings size={18} />
                          Account settings
                        </Link>

                        <Link
                          to="/dashboard/billing"
                          role="menuitem"
                          onClick={closeMenus}
                        >
                          <CreditCard size={18} />
                          Billing &amp; payments
                        </Link>

                        <Link
                          to="/dashboard/support"
                          role="menuitem"
                          onClick={closeMenus}
                        >
                          <HelpCircle size={18} />
                          Support
                        </Link>

                        <Link
                          to="/become-a-freelancer"
                          role="menuitem"
                          onClick={closeMenus}
                        >
                          <Sparkles size={18} />
                          Become a seller
                        </Link>
                      </div>
                    )}

                    <div className="account-menu-section account-preferences">
                      <span className="account-menu-heading">
                        Marketplace preferences
                      </span>

                      <div className="account-menu-item preference-item">
                        <Globe2 size={18} />
                        <span>Language</span>
                        <small>English · demo</small>
                      </div>

                      <div className="account-menu-item preference-item">
                        <WalletCards size={18} />
                        <span>Currency</span>
                        <small>INR ₹ · demo</small>
                      </div>
                    </div>

                    <div className="account-menu-footer">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          const destination = isSeller
                            ? "/dashboard"
                            : "/seller/dashboard"

                          closeMenus()
                          switchRole(isSeller ? "client" : "seller")
                          window.location.replace(destination)
                        }}
                      >
                        <ArrowRight size={18} />
                        {isSeller
                          ? "Switch to buyer mode"
                          : "Switch to seller mode"}
                      </button>

                      <button
                        type="button"
                        role="menuitem"
                        className="sign-out-item"
                        onClick={signOutAndReturnHome}
                      >
                        <LogOut size={18} />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {!user && (
            <div className="logged-out-actions">
              <span className="demo-auth-label">Demo auth</span>

              <Link
                className="button button-secondary login-link"
                to="/login"
              >
                Sign In
              </Link>

              <Link
                className="button button-primary join-link"
                to="/register"
              >
                Join
              </Link>
            </div>
          )}

          <button
            ref={menuTriggerRef}
            type="button"
            className="icon-button mobile-only"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => {
              setMenuOpen((value) => !value)
              setAccountOpen(false)
            }}
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>

      {categoriesOpen && (
        <div className="mega-menu">
          <div className="container mega-grid">
            <div className="mega-intro">
              <span className="eyebrow">Creative expertise</span>
              <h3>Find the right specialist</h3>
              <p>Explore curated creative and development services.</p>

              <Link to="/explore" onClick={closeMenus}>
                Browse all services <ArrowRight size={17} />
              </Link>
            </div>

            {categories.map((category) => {
              const Icon = categoryIcons[category.icon] || Sparkles

              return (
                <Link
                  className="mega-item"
                  to={`/categories/${category.slug}`}
                  key={category.slug}
                  onClick={closeMenus}
                >
                  <span>
                    <Icon size={21} />
                  </span>

                  <div>
                    <strong>{category.name}</strong>
                    <small>
                      {category.subcategories.slice(0, 2).join(" · ")}
                    </small>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {menuOpen && (
        <div
          className="mobile-drawer-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setMenuOpen(false)
            }
          }}
        >
          <aside
            ref={mobileDrawerRef}
            className="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
          >
            <div className="drawer-head">
              <Logo />

              <button
                className="icon-button"
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            {user && (
              <div className="mobile-account-identity">
                <span className="account-avatar" aria-hidden="true">
                  {firstInitial}
                </span>

                <span>
                  <strong>{identity}</strong>
                  <small>
                    {isSeller ? "Seller workspace" : "Buyer workspace"} · Demo
                    authentication
                  </small>
                </span>
              </div>
            )}

            <nav aria-label="Mobile navigation">
              {mobileLinks.map(([path, label]) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                  <ArrowRight size={18} />
                </Link>
              ))}
            </nav>

            {user ? (
              <>
                <button
                  type="button"
                  className="button button-secondary full mobile-mode-switch"
                  onClick={() => {
                    switchRole(isSeller ? "client" : "seller")
                    setMenuOpen(false)
                    navigate(isSeller ? "/dashboard" : "/seller/dashboard")
                  }}
                >
                  {isSeller ? "Switch to buyer mode" : "Switch to seller mode"}
                </button>

                <button
                  type="button"
                  className="button button-secondary full mobile-sign-out"
                  onClick={signOutAndReturnHome}
                >
                  <LogOut size={17} /> Sign out
                </button>
              </>
            ) : (
              <div className="mobile-auth-actions">
                <small>Demo authentication · no secure sign-in</small>

                <Link
                  className="button button-secondary full"
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </Link>

                <Link
                  className="button button-primary full"
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                >
                  Join
                </Link>
              </div>
            )}
          </aside>
        </div>
      )}
    </header>
  )
}

export { Header as default, Header as Navbar }