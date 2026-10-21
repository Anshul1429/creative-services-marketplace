import { useEffect, useMemo, useState } from "react"
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
  MarketplaceImage,
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
} from "../services/data.js"
import { useStore } from "../context/StoreContext.jsx"
import { NotFoundPage } from "./NotFound.jsx"

export function ExplorePage() {
  const { publishedServices } = useStore()
  const [params, setParams] = useSearchParams()
  const query = params.get("q") || ""
  const [searchTerm, setSearchTerm] = useState(query)
  const subcategory = params.get("subcategory") || ""
  const category = params.get("category") || "all"
  const sort = params.get("sort") || "recommended"
  const parsedMax = Number(params.get("max") || 25000)
  const max = Number.isFinite(parsedMax)
    ? Math.min(25000, Math.max(2500, parsedMax))
    : 25000
  const parsedRating = Number(params.get("rating") || 0)
  const rating = [0, 4.7, 4.8, 4.9].includes(parsedRating)
    ? parsedRating
    : 0
  const parsedDelivery = Number(params.get("delivery") || 0)
  const delivery = [0, 3, 7, 14].includes(parsedDelivery)
    ? parsedDelivery
    : 0
  const levels = (params.get("level") || "")
    .split(",")
    .filter((level) => ["Top Rated", "Level 2", "Rising Talent"].includes(level))
  const [filterOpen, setFilterOpen] = useState(false)
  useEffect(() => setSearchTerm(query), [query])
  useEffect(() => {
    if (!filterOpen) return undefined
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setFilterOpen(false)
    }
    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [filterOpen])
  const results = useMemo(() => {
    const words = query.toLowerCase().split(" ").filter(Boolean)
    const filtered = publishedServices.filter((service) => {
      const provider = freelancers.find((item) => item.id === service.freelancerId)
      const categoryName =
        categories.find((item) => item.slug === service.category)?.name || ""
      const haystack = [
        service.title,
        service.subcategory,
        service.tags.join(" "),
        service.description,
        categoryName,
        provider?.name,
        provider?.role,
      ].join(" ").toLowerCase()
      return (
        (category === "all" || service.category === category) &&
        (!subcategory ||
          service.subcategory.toLowerCase() === subcategory.toLowerCase()) &&
        Math.min(...service.packages.map((pack) => pack.price)) <= max &&
        service.rating >= rating &&
        (!delivery ||
          service.packages.some((pack) => pack.delivery <= delivery)) &&
        (!levels.length || levels.includes(service.level)) &&
        words.every((word) => haystack.includes(word))
      )
    })
    return [...filtered].sort((a, b) =>
      sort === "rating"
        ? b.rating - a.rating
        : sort === "price-low"
          ? a.packages[0].price - b.packages[0].price
          : sort === "price-high"
            ? b.packages[0].price - a.packages[0].price
            : b.reviews - a.reviews,
    )
  }, [publishedServices, query, subcategory, category, max, rating, delivery, levels.join(","), sort])
  const update = (key, value) => {
    const next = new URLSearchParams(params)
    value ? next.set(key, value) : next.delete(key)
    setParams(next)
  }
  const toggleLevel = (level) => {
    const nextLevels = levels.includes(level)
      ? levels.filter((item) => item !== level)
      : [...levels, level]
    update("level", nextLevels.join(","))
  }
  const clearFilters = () => setParams(query ? { q: query } : {})
  const selectCategory = (value) => {
    const next = new URLSearchParams(params)
    value && value !== "all"
      ? next.set("category", value)
      : next.delete("category")
    next.delete("subcategory")
    setParams(next)
  }
  const submitSearch = (event) => {
    event.preventDefault()
    const next = new URLSearchParams(params)
    const normalized = searchTerm.trim()
    normalized ? next.set("q", normalized) : next.delete("q")
    setParams(next)
  }
  return (
    <PageShell>
      <section className="page-hero compact-hero">
        <div className="container">
          <span className="eyebrow">Explore the marketplace</span>
          <h1>Find a specialist for your next big idea.</h1>
          <form className="results-search" onSubmit={submitSearch}>
            <Search />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search services, skills, or outcomes"
              placeholder="Search services, skills, or outcomes"
            />
            <Button type="submit">Search</Button>
          </form>
        </div>
      </section>
      <section className="section results-section">
        <div className="container">
          <div className="results-toolbar">
            <div>
              <strong aria-live="polite">{results.length} services</strong>
              <span>
                {query ? ` matching “${query}”` : " from curated demo talent"}
              </span>
            </div>
            <div>
              <Button
                variant="secondary"
                className="filter-toggle"
                aria-expanded={filterOpen}
                aria-controls="search-filters"
                onClick={() => setFilterOpen(true)}
              >
                <SlidersHorizontal size={17} /> Filters
              </Button>
              <select
                value={sort}
                onChange={(e) => update("sort", e.target.value)}
                aria-label="Sort results"
              >
                <option value="recommended">Recommended</option>
                <option value="rating">Highest rated</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </div>
          </div>
          <div className="results-layout">
            {filterOpen && (
              <button
                type="button"
                className="filter-backdrop"
                aria-label="Dismiss search filters"
                onClick={() => setFilterOpen(false)}
              />
            )}
            <aside
              id="search-filters"
              className={`filters ${filterOpen ? "filters-open" : ""}`}
              aria-label="Search filters"
            >
              <div className="mobile-filter-head">
                <strong>Filters</strong>
                <button
                  type="button"
                  aria-label="Close filters"
                  onClick={() => setFilterOpen(false)}
                >
                  <X />
                </button>
              </div>
              <label>
                Category
                <select
                  value={category}
                  onChange={(e) => selectCategory(e.target.value)}
                >
                  <option value="all">All categories</option>
                  {categories.map((item) => (
                    <option value={item.slug} key={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Maximum budget <strong>₹{max.toLocaleString("en-IN")}</strong>
                <input
                  type="range"
                  min="2500"
                  max="25000"
                  step="1000"
                  value={max}
                  onChange={(e) => update("max", e.target.value)}
                />
              </label>
              <fieldset>
                <legend>Minimum rating</legend>
                {[0, 4.7, 4.8, 4.9].map((value) => (
                  <label className="radio-row" key={value}>
                    <input
                      type="radio"
                      checked={rating === value}
                      onChange={() => update("rating", String(value))}
                    />
                    {value ? (
                      <>
                        <Star size={14} fill="currentColor" /> {value} & up
                      </>
                    ) : (
                      "Any rating"
                    )}
                  </label>
                ))}
              </fieldset>
              <fieldset>
                <legend>Delivery</legend>
              {[
                [3, "Up to 3 days"],
                [7, "Up to 7 days"],
                [14, "Up to 14 days"],
              ].map(
                ([value, label]) => (
                  <label className="check-row" key={value}>
                    <input
                      type="radio"
                      name="delivery"
                      checked={delivery === value}
                      onChange={() => update("delivery", String(value))}
                    />
                    {label}
                  </label>
                ),
              )}
              <label className="check-row">
                <input
                  type="radio"
                  name="delivery"
                  checked={!delivery}
                  onChange={() => update("delivery", "")}
                />
                Any delivery
              </label>
              </fieldset>
              <fieldset>
              <legend>Freelancer level</legend>
              {["Top Rated", "Level 2", "Rising Talent"].map((item) => (
                <label className="check-row" key={item}>
                  <input
                    type="checkbox"
                    checked={levels.includes(item)}
                    onChange={() => toggleLevel(item)}
                  />
                  {item}
                </label>
              ))}
              </fieldset>
              <Button variant="secondary" onClick={clearFilters}>
              Clear all
              </Button>
              <Button
                className="mobile-only full"
                onClick={() => setFilterOpen(false)}
              >
                Show {results.length} services
              </Button>
            </aside>
            <div>
              {(query ||
                subcategory ||
                category !== "all" ||
                rating > 0 ||
                delivery ||
                levels.length > 0 ||
                max < 25000) && (
                <div className="active-filters">
                  {query && (
                    <button onClick={() => update("q", "")}>
                      {query}
                      <X size={13} />
                    </button>
                  )}
                  {category !== "all" && (
                    <button onClick={() => update("category", "all")}>
                      {categories.find((c) => c.slug === category)?.name || category}
                      <X size={13} />
                    </button>
                  )}
                  {subcategory && (
                    <button onClick={() => update("subcategory", "")}>
                      {subcategory}
                      <X size={13} />
                    </button>
                  )}
                  {rating > 0 && (
                    <button onClick={() => update("rating", "")}>
                      {rating}+ rating <X size={13} />
                    </button>
                  )}
                  {delivery > 0 && (
                    <button onClick={() => update("delivery", "")}>
                      Up to {delivery} days <X size={13} />
                    </button>
                  )}
                  {levels.map((level) => (
                    <button key={level} onClick={() => toggleLevel(level)}>
                      {level} <X size={13} />
                    </button>
                  ))}
                  {max < 25000 && (
                    <button onClick={() => update("max", "")}>
                      Up to ₹{max.toLocaleString("en-IN")} <X size={13} />
                    </button>
                  )}
                </div>
              )}
              {results.length ? (
                <div className="service-grid results-grid">
                  {results.map((service) => (
                    <ServiceCard service={service} key={service.id} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No perfect match—yet"
                  detail="Try a broader keyword, category, or budget."
                  action={
                    <Button variant="secondary" onClick={clearFilters}>
                      Reset filters
                    </Button>
                  }
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  )
}

export function CategoryPage() {
  const { categorySlug, subcategorySlug } = useParams()
  const { publishedServices } = useStore()
  const category = categories.find((item) => item.slug === categorySlug)
  if (!category) return <NotFoundPage />
  const selectedSubcategory = subcategorySlug
    ? category.subcategories.find(
        (item) => item.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") === subcategorySlug,
      )
    : ""
  if (subcategorySlug && !selectedSubcategory) return <NotFoundPage />
  const filtered = publishedServices.filter(
    (service) =>
      service.category === category.slug &&
      (!selectedSubcategory || service.subcategory === selectedSubcategory),
  )
  const refinePath = `/search?category=${category.slug}${
    selectedSubcategory
      ? `&subcategory=${encodeURIComponent(selectedSubcategory)}`
      : ""
  }`
  return (
    <PageShell>
      <section className="category-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/explore">Explore</Link>
            <span>/</span>
            <strong>{category.name}</strong>
          </div>
          <span className="eyebrow">Creative category</span>
          <h1>
            {selectedSubcategory || category.name} that moves your idea forward.
          </h1>
          <p>
            {category.description} Compare scope, approach, and packages from
            independent professionals.
          </p>
          <div className="subcategory-pills">
            {category.subcategories.map((item) => (
              <Link
                key={item}
                to={`/categories/${category.slug}/${item.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}
              >
                {item}
                <ArrowRight size={14} />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeader
            title={`${selectedSubcategory || `Popular ${category.name}`} services`}
            detail={`${filtered.length} illustrative demo services with clear packages and INR pricing.`}
            action={{
              label: "Refine results",
              to: refinePath,
            }}
          />
          {filtered.length ? (
            <div className="service-grid">
              {filtered.map((service) => (
                <ServiceCard service={service} key={service.id} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No demo services in this specialty yet"
              detail="Browse the full category or explore other specialties."
              action={
                <Link className="button button-secondary" to={`/categories/${category.slug}`}>
                  View all {category.name}
                </Link>
              }
            />
          )}
        </div>
      </section>
      <section className="section tinted">
        <div className="container">
          <SectionHeader
            eyebrow="Featured specialists"
            title={`Talent working in ${category.name.toLowerCase()}`}
          />
          <div className="profile-list">
            {[...new Set(filtered.map((service) => service.freelancerId))]
              .slice(0, 3)
              .map((freelancerId) => {
              const person = freelancers.find(
                (item) => item.id === freelancerId,
              )
              if (!person) return null
              return (
                <Link to={`/freelancer/${person.id}`} key={person.id}>
                  <MarketplaceImage src={person.avatar} alt={person.name} />
                  <div>
                    <h3>{person.name}</h3>
                    <p>{person.role}</p>
                    <span>
                      <Star size={14} fill="currentColor" /> Demo rating {person.rating} ·{" "}
                      {person.projects} illustrative projects
                    </span>
                  </div>
                  <ArrowRight />
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </PageShell>
  )
}
