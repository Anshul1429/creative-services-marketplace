import { useEffect, useState } from "react"
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
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"
import {
  Button,
  CategoryCard,
  CheckList,
  EmptyState,
  PageShell,
  MarketplaceImage,
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
import { useStore } from "../context/StoreContext.jsx"
import { useAuth } from "../context/AuthContext.jsx"

import { NotFoundPage } from "./NotFound.jsx"

export function ServicePage() {
  const { serviceId } = useParams()
  const { favorites, toggleFavorite, startConversation, getService, getSellerProfile, sellerPortfolioFor } = useStore()
  const service = getService(serviceId)
  const [searchParams] = useSearchParams()
  const requestedPackage = searchParams.get("package")
  const initialPackage = service?.packages.findIndex(
    (item) => item.name.toLowerCase() === requestedPackage?.toLowerCase(),
  )
  const [packageIndex, setPackageIndex] = useState(
    initialPackage >= 0 ? initialPackage : 1,
  )
  const [addon, setAddon] = useState(searchParams.get("addon") === "priority")
  const [faq, setFaq] = useState(0)
  const [selectedImage, setSelectedImage] = useState("")
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [shareStatus, setShareStatus] = useState("")
  const [contactError, setContactError] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  useEffect(() => {
    const matchingPackage = service?.packages.findIndex(
      (item) => item.name.toLowerCase() === requestedPackage?.toLowerCase(),
    )
    setPackageIndex(matchingPackage >= 0 ? matchingPackage : 1)
    setAddon(searchParams.get("addon") === "priority")
  }, [requestedPackage, searchParams, service?.id])
  useEffect(() => setSelectedImage(service?.image || ""), [service?.image])
  useEffect(() => {
    if (!galleryOpen) return undefined
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setGalleryOpen(false)
    }
    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [galleryOpen])
  if (!service) return <NotFoundPage />
  const basePerson = freelancers.find((item) => item.id === service.freelancerId)
  const sellerProfile = service.sellerEmail ? getSellerProfile(service.sellerEmail) : null
  const person = basePerson && sellerProfile
    ? { ...basePerson, name: sellerProfile.name, role: sellerProfile.headline, location: sellerProfile.city }
    : basePerson
  if (!person) return <NotFoundPage />
  const galleryImages = [
    service.image,
    ...(service.gallery || []),
    ...sellerPortfolioFor(service.sellerEmail || "")
      .map((item) => item.image)
      .filter(Boolean),
    ...portfolios
      .filter((item) => item.freelancerId === person.id)
      .map((item) => item.image),
  ].slice(0, 3)
  const selected = service.packages[packageIndex]
  const checkoutUrl = () =>
    `/checkout/${service.id}?package=${encodeURIComponent(selected.name)}&addon=${addon ? "priority" : ""}`
  const toggleOrRequestLogin = () => {
    if (user) {
      toggleFavorite(service.id)
      return
    }
    navigate(
      `/login?redirect=${encodeURIComponent(`${location.pathname}${location.search}`)}`,
    )
  }
  const contactFreelancer = () => {
    const destination = `/dashboard/messages?person=${person.id}`
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(destination)}`)
      return
    }
    const conversation = startConversation(person.id)
    if (!conversation) {
      setContactError("Unable to open this demo conversation. Please try again.")
      return
    }
    navigate(`/dashboard/messages/${conversation.id}`)
  }
  const shareService = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: service.title, url: window.location.href })
        setShareStatus("Service link shared.")
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href)
        setShareStatus("Service link copied.")
      } else {
        setShareStatus("Copy the service URL from your browser address bar.")
      }
    } catch (error) {
      setShareStatus(
        error instanceof Error && error.name === "AbortError"
          ? "Share cancelled."
          : "Sharing is unavailable. Copy the service URL from your browser address bar.",
      )
    }
  }
  return (
    <PageShell>
      <div className="container service-page">
        <div className="breadcrumbs">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to={`/categories/${service.category}`}>
            {categories.find((item) => item.slug === service.category)?.name}
          </Link>
          <span>/</span>
          <strong>{service.subcategory}</strong>
        </div>
        <div className="service-detail-grid">
          <div className="service-content">
            <div className="service-kicker">
              <span>{service.subcategory}</span>
              <StatusBadge status={service.available ? "Available in demo" : "Unavailable in demo"} />
            </div>
            <h1>{service.title}</h1>
            <div className="service-author">
              <Link to={`/freelancer/${person.id}`}>
                <img src={person.avatar} alt={person.name} />
                <div>
                  <strong>
                    {person.name}
                  </strong>
                  <span>{person.role}</span>
                </div>
              </Link>
              <span className="rating">
                <Star size={15} fill="currentColor" />
                <strong>{service.rating}</strong> ({service.reviews} illustrative demo ratings)
              </span>
            </div>
            <div className="detail-gallery">
              <button
                className="gallery-main"
                type="button"
                aria-label="Open larger demo portfolio image"
                onClick={() => setGalleryOpen(true)}
              >
                <MarketplaceImage
                  src={selectedImage || service.image}
                  alt={`${service.subcategory} illustrative demo work`}
                />
                <span>
                  <Play fill="currentColor" /> View larger image
                </span>
              </button>
              {galleryImages.slice(1).map((image, index) => (
                <button
                  type="button"
                  className={`gallery-thumb ${galleryImages.length === 2 ? "single-gallery-thumb" : ""} ${selectedImage === image ? "selected" : ""}`}
                  key={`${image}-${index}`}
                  onClick={() => setSelectedImage(image)}
                  aria-label={`Show demo gallery image ${index + 2}`}
                  aria-pressed={selectedImage === image}
                >
                  <MarketplaceImage src={image} alt={`${person.name}'s illustrative portfolio work`} />
                </button>
              ))}
            </div>
            <div className="mobile-purchase">
              <strong>From ₹{selected.price.toLocaleString("en-IN")}</strong>
              <Button
                disabled={!service.available}
                onClick={() => navigate(checkoutUrl())}
              >
                {service.available ? "Continue" : "Unavailable"}
              </Button>
            </div>
            <section className="detail-section">
              <h2>About this service</h2>
              <p>{service.description}</p>
              {service.requirements && <div className="service-requirements"><strong>To get started</strong><p>{service.requirements}</p></div>}
              <div className="fact-grid">
                <div>
                  <Clock3 />
                  <span>Delivery</span>
                  <strong>{selected.delivery} days</strong>
                </div>
                <div>
                  <Sparkles />
                  <span>Revisions</span>
                  <strong>{selected.revisions} rounds</strong>
                </div>
                <div>
                  <Globe2 />
                  <span>Language</span>
                  <strong>English, Hindi</strong>
                </div>
              </div>
            </section>
            <section className="detail-section">
              <h2>Compare packages</h2>
              <div className="package-table">
                {service.packages.map((pack, index) => (
                  <button
                    className={packageIndex === index ? "selected" : ""}
                    onClick={() => setPackageIndex(index)}
                    key={pack.name}
                  >
                    <span>{pack.name}</span>
                    <strong>₹{pack.price.toLocaleString("en-IN")}</strong>
                    <p>{pack.description}</p>
                    <small>
                      {pack.delivery} days · {pack.revisions} revisions
                    </small>
                    <CheckList items={pack.includes} />
                  </button>
                ))}
              </div>
            </section>
            <section className="detail-section">
              <h2>Meet your freelancer</h2>
              <div className="freelancer-intro">
                <MarketplaceImage src={person.avatar} alt={person.name} />
                <div>
                  <h3>
                    {person.name}
                  </h3>
                  <p>{person.bio}</p>
                  <div className="skill-row">
                    {person.skills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                  <Link
                    className="button button-secondary"
                    to={`/freelancer/${person.id}`}
                  >
                    View profile
                  </Link>
                </div>
              </div>
            </section>
            <section className="detail-section">
              <h2>Illustrative sample reviews</h2>
              <p className="demo-content-note">
                These short examples and ratings are mock demo content, not real client reviews.
              </p>
              {[
                "A sample comment about clear scope and an organized handoff.",
                "A sample comment about a collaborative project process.",
              ].map((text, index) => (
                <div className="review" key={text}>
                  <div>
                    <div>
                      <strong>Sample demo review {index + 1}</strong>
                      <span>Illustrative content · not a verified buyer review</span>
                    </div>
                  </div>
                  <p>“{text}”</p>
                </div>
              ))}
            </section>
            <section className="detail-section">
              <h2>Common questions</h2>
              <div className="faq-list">
                {[
                  ...(service.faqs || []).map((item) => [item.question, item.answer]),
                  [
                    "What do you need to begin?",
                    "A short brief, your goals, examples you like, and any existing brand files.",
                  ],
                  [
                    "Can I request a custom scope?",
                    "Yes. Contact the freelancer before checkout to discuss a tailored project.",
                  ],
                  [
                    "Are source files included?",
                    "Source files are included in every package shown in this demo.",
                  ],
                ].map(([q, a], index) => (
                  <div
                    className={`faq-item ${faq === index ? "open" : ""}`}
                    key={q}
                  >
                    <button onClick={() => setFaq(faq === index ? -1 : index)}>
                      {q}
                      <ChevronDown />
                    </button>
                    {faq === index && <p>{a}</p>}
                  </div>
                ))}
              </div>
            </section>
          </div>
          <aside className="purchase-card">
            <div className="package-tabs">
              {service.packages.map((pack, index) => (
                <button
                  key={pack.name}
                  className={packageIndex === index ? "active" : ""}
                  onClick={() => setPackageIndex(index)}
                >
                  {pack.name}
                </button>
              ))}
            </div>
            <div className="purchase-body">
              <div className="purchase-price">
                <span>{selected.name} package</span>
                <strong>₹{selected.price.toLocaleString("en-IN")}</strong>
              </div>
              <p>{selected.description}</p>
              <div className="purchase-meta">
                <span>
                  <Clock3 /> {selected.delivery}-day delivery
                </span>
                <span>
                  <Sparkles /> {selected.revisions} revisions
                </span>
              </div>
              <CheckList items={selected.includes} />
              <label className="addon-row">
                <input
                  type="checkbox"
                  checked={addon}
                  onChange={(e) => setAddon(e.target.checked)}
                />
                <span>
                  <strong>48-hour priority start</strong>
                  <small>Add ₹1,499</small>
                </span>
              </label>
              <div className="purchase-total">
                <span>Total</span>
                <strong>
                  ₹
                  {(selected.price + (addon ? 1499 : 0)).toLocaleString(
                    "en-IN",
                  )}
                </strong>
              </div>
              <Button
                className="full"
                disabled={!service.available}
                onClick={() =>
                  navigate(checkoutUrl())
                }
              >
                {service.available ? "Continue to checkout" : "Unavailable in demo"} <ArrowRight size={17} />
              </Button>
              <Button
                variant="secondary"
                className="full"
                onClick={contactFreelancer}
              >
                <MessageCircle size={17} /> Contact freelancer
              </Button>
              <div className="purchase-actions">
                <button onClick={toggleOrRequestLogin} title={user ? "Save this service" : "Sign in to save this service"}>
                  <Heart
                    size={16}
                    fill={
                      favorites.includes(service.id) ? "currentColor" : "none"
                    }
                  />{" "}
                  {favorites.includes(service.id) ? "Saved" : "Save"}
                </button>
                <button onClick={shareService}>
                  <Share2 size={16} /> Share
                </button>
              </div>
              {shareStatus && <p role="status" className="demo-content-note">{shareStatus}</p>}
              {contactError && <p role="alert" className="demo-content-note">{contactError}</p>}
              <small className="safe-note">
                <LockKeyhole size={14} /> Mock checkout. No real payment is
                collected.
              </small>
            </div>
          </aside>
        </div>
      </div>
      {galleryOpen && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Demo portfolio image preview"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setGalleryOpen(false)
          }}
        >
          <button
            type="button"
            className="gallery-lightbox-close"
            onClick={() => setGalleryOpen(false)}
            aria-label="Close image preview"
          >
            <X />
          </button>
          <MarketplaceImage
            src={selectedImage || service.image}
            alt={`${service.subcategory} illustrative demo work`}
          />
        </div>
      )}
      <section className="section tinted">
        <div className="container">
          <SectionHeader title="You might also like" />
          <div className="service-grid">
            {services
              .filter(
                (item) =>
                  item.category === service.category && item.id !== service.id,
              )
              .slice(0, 4)
              .map((item) => (
                <ServiceCard service={item} key={item.id} />
              ))}
          </div>
        </div>
      </section>
    </PageShell>
  )
}

export default ServicePage
