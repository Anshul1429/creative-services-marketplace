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
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
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
import { useStore } from "../context/StoreContext.jsx"

export function InfoPage({ type }) {
  const [helpTerm, setHelpTerm] = useState("")
  const { submitSupportRequest } = useStore()
  const content = {
    "how-it-works": [
      "How it works",
      "A clear path from brief to brilliant.",
      "Explore curated services, choose a transparent package, align with your freelancer, and track delivery from one workspace.",
    ],
    "become-a-freelancer": [
      "For independent talent",
      "Build the creative business you want.",
      "Package your expertise, present your strongest work, and manage every client relationship in one focused workspace.",
    ],
    resources: [
      "Resources",
      "Practical guidance for better creative projects.",
      "Learn how to write clearer briefs, compare packages, give useful feedback, and build stronger independent careers.",
    ],
    about: [
      "About us",
      "Better creative work starts with better connection.",
      "FreeLancerGraphic is an original demo marketplace concept built for India’s creative and digital economy.",
    ],
    contact: [
      "Contact",
      "We’re here to help.",
      "Send a demo support request and our local interface will confirm receipt. No request is transmitted.",
    ],
    help: [
      "Help center",
      "Answers for every stage of your project.",
      "Search common topics about choosing services, orders, delivery, revisions, and accounts.",
    ],
    terms: [
      "Terms of use",
      "Clear terms for a demo marketplace.",
      "This frontend is an illustrative product experience. It does not create binding commercial agreements or process payments.",
    ],
    privacy: [
      "Privacy",
      "Your demo data stays local.",
      "This prototype uses local and session state for selected interactions. Do not enter sensitive personal or payment data.",
    ],
  }
  const copy = content[type] || content.about
  const [sent, setSent] = useState(false)
  const helpTopics = [
    ["Choosing a service", "Compare package scope, inclusions, delivery time, and sample portfolio work before choosing."],
    ["Starting a project", "The demo checkout creates a local sample order. It does not collect payment or contact a freelancer."],
    ["Favorites", "Sign in to a demo buyer account to save services and freelancer profiles in this browser session."],
    ["Messages", "Contact buttons open a simulated conversation. Messages are not delivered outside this frontend."],
    ["Demo accounts", "Use buyer@demo.com / buyer123 or seller@demo.com / seller123 to explore the sample workspaces."],
  ]
  const matchingTopics = helpTopics.filter(([title, detail]) =>
    `${title} ${detail}`.toLowerCase().includes(helpTerm.trim().toLowerCase()),
  )
  const steps = [
    ["Discover", "Search services, browse categories, and open a service or freelancer profile."],
    ["Align", "Choose a package and use the demo inbox to explore how a project discussion could work."],
    ["Review", "The demo checkout shows the selected package and optional extra; no payment is processed."],
  ]
  return (
    <PageShell>
      <section className="info-hero">
        <div className="container">
          <span className="eyebrow">{copy[0]}</span>
          <h1>{copy[1]}</h1>
          <p>{copy[2]}</p>
          {type === "become-a-freelancer" && (
            <Link className="button button-primary" to="/seller/onboarding">
              Start onboarding <ArrowRight size={17} />
            </Link>
          )}
        </div>
      </section>
      <section className="section">
        <div className="container info-content">
          {type === "help" && (
            <>
              <label className="help-search">
                <Search aria-hidden="true" />
                <input
                  value={helpTerm}
                  onChange={(event) => setHelpTerm(event.target.value)}
                  placeholder="Search the help center"
                  aria-label="Search help topics"
                />
              </label>
              <div className="help-topics" aria-live="polite">
                {matchingTopics.length ? matchingTopics.map(([title, detail]) => (
                  <article className="info-topic" key={title}>
                    <h2>{title}</h2>
                    <p>{detail}</p>
                  </article>
                )) : (
                  <div className="empty-state">
                    <h3>No help topics found</h3>
                    <p>Try searching for orders, messages, favorites, or demo accounts.</p>
                  </div>
                )}
              </div>
            </>
          )}
          {["how-it-works", "become-a-freelancer"].includes(type) && (
            <div className="info-cards">
              {steps.map(([title, detail], index) => (
                <article key={title}>
                  <span>0{index + 1}</span>
                  <h3>{type === "become-a-freelancer" && index === 0 ? "Create your demo profile" : title}</h3>
                  <p>{type === "become-a-freelancer" ? [
                    "Choose the seller demo workspace and explore the sample setup.",
                    "Review illustrative service and portfolio screens.",
                    "Preview the local seller dashboard. Nothing is published to a real marketplace.",
                  ][index] : detail}</p>
                </article>
              ))}
            </div>
          )}
          {type === "resources" && (
            <div className="info-cards">
              {[
                ["Write a useful brief", "Describe the outcome, audience, constraints, and references before comparing service packages.", "/help"],
                ["Compare service scope", "Review package inclusions and delivery times on service detail pages.", "/explore"],
                ["Plan a clear handoff", "Keep feedback specific, consolidated, and connected to the agreed deliverables.", "/how-it-works"],
              ].map(([title, detail, to], index) => (
                <article key={title}>
                  <span>0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{detail}</p>
                  <Link className="text-link" to={to}>Read guidance <ArrowRight size={16} /></Link>
                </article>
              ))}
            </div>
          )}
          {type === "about" && (
            <div className="info-topic">
              <h2>An illustrative marketplace prototype</h2>
              <p>Profiles, service listings, ratings, portfolio work, and workflow screens on this site use mock data. They do not represent real people, verified credentials, completed transactions, or marketplace performance.</p>
            </div>
          )}
          {type === "terms" && (
            <div className="info-topic">
              <h2>Demo use only</h2>
              <p>This frontend is a non-production prototype. It does not create an enforceable service agreement, publish real offers, verify participants, or process payments.</p>
              <h2>Sample information</h2>
              <p>Names, images, ratings, reviews, prices, portfolio examples, messages, and order activity are illustrative mock content. Do not rely on them for a purchase decision.</p>
              <h2>Accounts and availability</h2>
              <p>Demo sign-in and role checks are stored in the browser and are not secure authentication or authorization.</p>
            </div>
          )}
          {type === "privacy" && (
            <div className="info-topic">
              <h2>Do not enter sensitive information</h2>
              <p>This demo has no connected server or external identity provider. Do not submit real passwords, payment details, confidential briefs, or personal information.</p>
              <h2>Browser demo state</h2>
              <p>Some interactions use browser storage for demo session and favorite state. Clearing site data removes that local state. Support requests and messages are not transmitted.</p>
            </div>
          )}
          {["contact", "help"].includes(type) && (
            <form
              className="support-form"
              onSubmit={(e) => {
                e.preventDefault()
                const data = new FormData(e.currentTarget)
                const name = String(data.get("name") || "").trim()
                const email = String(data.get("email") || "").trim()
                const message = String(data.get("message") || "").trim()
                if (name.length < 2 || message.length < 15) return
                submitSupportRequest({
                  name,
                  email,
                  topic: type === "contact" ? "Contact enquiry" : "Help request",
                  message,
                })
                setSent(true)
              }}
            >
              {sent ? (
                <div role="status" className="demo-submit-status">
                  Your demo request was recorded on this screen only. No message was sent.
                </div>
              ) : <h2>
                {type === "contact"
                  ? "Send a demo enquiry"
                  : "Still need help?"}
              </h2>}
              {!sent && (
                <>
              <div className="two-fields">
                <label className="field">
                  Name
                  <input name="name" autoComplete="name" minLength={2} maxLength={80} required />
                </label>
                <label className="field">
                  Email
                  <input name="email" type="email" autoComplete="email" required />
                </label>
              </div>
              <label className="field">
                How can we help?
                <textarea name="message" rows={5} minLength={15} maxLength={1000} required />
              </label>
              <Button>
                Submit demo request
              </Button>
                </>
              )}
            </form>
          )}
        </div>
      </section>
    </PageShell>
  )
}
