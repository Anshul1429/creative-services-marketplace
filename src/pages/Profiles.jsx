import { useMemo, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
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
import { useAuth } from "../context/AuthContext.jsx"
import { NotFoundPage } from "./NotFound.jsx"

export function FreelancerPage() {
  const { freelancerId } = useParams()
  const { favorites, toggleFavorite, startConversation, publishedServices, sellerProfileForFreelancerId, sellerPortfolioFor, servicesForSeller } = useStore()
  const basePerson = freelancers.find((item) => item.id === freelancerId)
  const sellerProfile = sellerProfileForFreelancerId(freelancerId)
  const person = basePerson && sellerProfile
    ? { ...basePerson, name: sellerProfile.name, role: sellerProfile.headline, location: sellerProfile.city }
    : basePerson
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [shareStatus, setShareStatus] = useState("")
  const [actionError, setActionError] = useState("")
  if (!person) return <NotFoundPage />
  const work = [
    ...portfolios.filter((item) => item.freelancerId === person.id),
    ...(sellerProfile ? sellerPortfolioFor(sellerProfile.email) : []),
  ]
  const offers = sellerProfile
    ? servicesForSeller(sellerProfile.email, person.id).filter((item) => item.status === "Published")
    : publishedServices.filter((item) => item.freelancerId === person.id)
  const favorite = favorites.includes(person.id)
  const saveProfile = () => {
    if (user) {
      toggleFavorite(person.id)
      return
    }
    navigate(
      `/login?redirect=${encodeURIComponent(`${location.pathname}${location.search}`)}`,
    )
  }
  const contactProfile = () => {
    const destination = `/dashboard/messages?person=${person.id}`
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(destination)}`)
      return
    }
    const conversation = startConversation(person.id)
    if (!conversation) {
      setActionError("Unable to open this demo conversation. Please try again.")
      return
    }
    navigate(`/dashboard/messages/${conversation.id}`)
  }
  const shareProfile = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: person.name, url: window.location.href })
        setShareStatus("Profile shared.")
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href)
        setShareStatus("Profile link copied.")
      } else {
        setShareStatus("Copy the profile URL from your browser address bar.")
      }
    } catch (error) {
      setShareStatus(
        error instanceof Error && error.name === "AbortError"
          ? "Share cancelled."
          : "Sharing is unavailable. Copy the profile URL from your browser address bar.",
      )
    }
  }
  return (
    <PageShell>
      <section className="profile-hero">
        <div className="container profile-head">
          <MarketplaceImage src={person.avatar} alt={person.name} />
          <div className="profile-copy">
            <div>
              <span className="eyebrow">Demo freelancer profile</span>
              <h1>
                {person.name}
              </h1>
              <p>{person.role}</p>
            </div>
            <div className="profile-facts">
              <span>
              <Star fill="currentColor" /> Demo rating {person.rating} ({person.reviews} illustrative ratings)
              </span>
              <span>
                <Globe2 /> {person.location}
              </span>
              <span>
                <Clock3 /> Responds {person.response.toLowerCase()}
              </span>
            </div>
            <div className="skill-row">
              {person.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </div>
          <div className="profile-actions">
            <Button onClick={contactProfile}>
              <MessageCircle size={17} /> Contact me
            </Button>
            <Button
            variant="secondary"
            onClick={saveProfile}
            title={user ? "Save this profile" : "Sign in to save this profile"}
            >
            <Heart
              size={17}
              fill={favorite ? "currentColor" : "none"}
            />{" "}
            {favorite ? "Saved" : "Save"}
            </Button>
            <Button variant="ghost" aria-label="Share profile" onClick={shareProfile}>
            <Share2 />
            </Button>
            {shareStatus && <span role="status">{shareStatus}</span>}
            {actionError && <span role="alert">{actionError}</span>}
          </div>
        </div>
      </section>
      <div className="container profile-layout">
        <main>
          <section>
            <SectionHeader title="About" />
            <p className="large-copy">{person.bio}</p>
            <div className="profile-metrics">
              <div>
                <strong>{person.projects}</strong>
                <span>Illustrative demo projects</span>
              </div>
              <div>
                <strong>{person.rating}</strong>
                <span>Demo rating</span>
              </div>
              <div>
                <strong>{person.response}</strong>
                <span>Typical response</span>
              </div>
            </div>
          </section>
          <section>
            <SectionHeader title="Selected work" />
            <div className="profile-portfolio">
              {work.length ? work.map((project) => (
                <Link to={`/portfolio/${project.id}`} key={project.id}>
                  <MarketplaceImage src={project.image} alt={project.title} />
                  <h3>{project.title}</h3>
                  <span>{project.tools.join(" · ")}</span>
                </Link>
              )) : (
                <EmptyState title="No sample portfolio items yet" detail="This demo profile has no linked portfolio projects." />
              )}
            </div>
          </section>
          <section>
            <SectionHeader title="Available services" />
            {offers.length ? (
              <div className="service-grid">
                {offers.map((service) => (
                  <ServiceCard service={service} key={service.id} />
                ))}
              </div>
            ) : (
              <EmptyState title="No demo services listed" detail="Explore services from other sample profiles." action={<Link className="button button-secondary" to="/explore">Explore services</Link>} />
            )}
          </section>
        </main>
        <aside className="profile-side">
          <div>
            <h3>Working together</h3>
            <p>
              Structured briefs, regular progress updates, and organized final
              files.
            </p>
            <CheckList
              items={[
                "Clear project scope",
                "Regular communication",
                "Production-ready delivery",
              ]}
            />
          </div>
          <div>
            <h3>Languages</h3>
            <p>{person.languages.join(", ")}</p>
            <h3>Based in</h3>
            <p>{person.location}</p>
          </div>
        </aside>
      </div>
    </PageShell>
  )
}

export function PortfolioPage() {
  const { portfolioId } = useParams()
  const project = portfolios.find((item) => item.id === portfolioId)
  const person = project && freelancers.find((item) => item.id === project.freelancerId)
  if (!project || !person) return <NotFoundPage />
  return (
    <PageShell>
      <div className="container portfolio-detail">
        <div className="breadcrumbs">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to={`/freelancer/${person.id}`}>{person.name}</Link>
          <span>/</span>
          <strong>{project.title}</strong>
        </div>
        <div className="portfolio-title">
          <div>
            <span className="eyebrow">Illustrative portfolio project</span>
            <h1>{project.title}</h1>
            <p>{project.overview}</p>
          </div>
          <Link
            className="button button-secondary"
            to={`/freelancer/${person.id}`}
          >
            <MarketplaceImage src={person.avatar} alt="" /> Created by {person.name}
          </Link>
        </div>
        <MarketplaceImage
          className="portfolio-cover"
          src={project.image}
          alt={project.title}
        />
        <div className="portfolio-info">
          <div>
            <span>Role</span>
            <strong>Creative direction & execution</strong>
          </div>
          <div>
            <span>Tools</span>
            <strong>{project.tools.join(", ")}</strong>
          </div>
          <div>
            <span>Category</span>
            <strong>
              {categories.find((item) => item.slug === project.category)?.name}
            </strong>
          </div>
        </div>
        <section className="section">
          <SectionHeader title="More from this creative" />
          <div className="portfolio-grid">
            {portfolios
              .filter((item) => item.id !== project.id)
              .slice(0, 3)
              .map((item) => (
                <Link
                  className="portfolio-card"
                  to={`/portfolio/${item.id}`}
                  key={item.id}
                >
                  <MarketplaceImage src={item.image} alt={item.title} />
                  <div>
                    <h3>{item.title}</h3>
                    <ArrowRight />
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </PageShell>
  )
}
