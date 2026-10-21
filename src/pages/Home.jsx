import { useEffect, useState } from "react"
import {
  ArrowRight,
  ChevronDown,
  Code2,
  FileCheck2,
  MessageCircle,
  PanelsTopLeft,
  PenTool,
  Play,
  Search,
  Smartphone,
  Sparkles,
  Star,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import {
  Button,
  PageShell,
  MarketplaceImage,
  SectionHeader,
  ServiceCard,
  TrustStrip,
} from "../components/SharedComponents.jsx"
import {
  categories,
  freelancers,
  portfolios,
  services,
} from "../services/data.js"
import { useStore } from "../context/StoreContext.jsx"

// ✅ categoryIcons yahan locally define
const categoryIcons = {
  PenTool,
  Play,
  Sparkles,
  Code2,
  Smartphone,
  PanelsTopLeft,
  Clapperboard: Play,
}

export function HomePage() {
  const { publishedServices } = useStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [portfolioFilter, setPortfolioFilter] = useState("all")
  const [openFaq, setOpenFaq] = useState(0)
  const navigate = useNavigate()

  const [activeSlide, setActiveSlide] = useState(0)

  const slides = [
    {
      id: "graphic",
      category: "Graphic Design",
      title: "Logo & Brand Systems",
      detail: "Custom brand identities, typography & vector design",
      image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1000&auto=format&fit=crop",
      badge: "Design"
    },
    {
      id: "video",
      category: "Video Editing",
      title: "Reels & Cinematic Editing",
      detail: "Color grading, sound design & viral content cuts",
      image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1000&auto=format&fit=crop",
      badge: "Video"
    },
    {
      id: "web",
      category: "Web & App Development",
      title: "Full-Stack Applications",
      detail: "React, Flutter & scalable backend architecture",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop",
      badge: "Development"
    },
    {
      id: "animation",
      category: "2D / 3D Animation",
      title: "Motion Graphics & VFX",
      detail: "Blender 3D modeling, cel-shading & visual effects",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&auto=format&fit=crop",
      badge: "Animation"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [slides.length])

  // 🎨 HAR CATEGORY KE LIYE ALAG FALLBACK IMAGES
  const fallbackImages = {
    "graphic-design": [
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop"
    ],
    "video-editing": [
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585951237318-9ea5e175b891?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop"
    ],
    "animation": [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=800&auto=format&fit=crop"
    ],
    "web-development": [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&auto=format&fit=crop"
    ],
    "app-development": [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop"
    ],
    "ui-ux-design": [
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop"
    ]
  }

  let selectedPortfolios = []

  if (portfolioFilter === "all") {
    selectedPortfolios = portfolios.slice(0, 9)
  } else {
    const categoryImages = portfolios.filter((item) => item.category === portfolioFilter)
    
    if (categoryImages.length < 8) {
      const needed = 8 - categoryImages.length;
      const specificFallbacks = fallbackImages[portfolioFilter] || fallbackImages["web-development"]; 

      for (let i = 0; i < needed; i++) {
        categoryImages.push({
          id: `fallback-${portfolioFilter}-${i}`,
          title: `${portfolioFilter.split('-').join(' ')} Concept`,
          category: portfolioFilter,
          image: specificFallbacks[i % specificFallbacks.length]
        })
      }
    }
    
    selectedPortfolios = categoryImages.slice(0, 8)
  }

  const categoryThemes = {
    "graphic-design": { bg: "#8b5cf6", iconBg: "#ede9fe", text: "#6d28d9" },
    "video-editing":  { bg: "#f43f5e", iconBg: "#ffe4e6", text: "#be123c" },
    "animation":      { bg: "#f59e0b", iconBg: "#fef3c7", text: "#b45309" },
    "web-development":{ bg: "#3b82f6", iconBg: "#dbeafe", text: "#1d4ed8" },
    "app-development":{ bg: "#10b981", iconBg: "#d1fae5", text: "#047857" },
    "ui-ux-design":   { bg: "#6366f1", iconBg: "#e0e7ff", text: "#4338ca" },
  };

  return (
    <PageShell>
      {/* HERO */}
      <section className="home-hero">
        <div className="container">
          <div className="home-hero-grid">
            <div>
              <div className="home-hero-badge">
                <Sparkles size={14} />
                <span>Active Showcase: {slides[activeSlide].category}</span>
              </div>

              <h1>
                Scale your brand with <br />
                <span className="accent">Visual Excellence.</span>
              </h1>

              <p>
                Explore demo listings for graphic design, video, and
                development. Compare packages and browse sample portfolio work
                before starting a project.
              </p>

              <div className="home-hero-actions">
                <Link to="/explore" className="button btn-primary">
                  Start a Project
                </Link>
                <Link to="/explore" className="button btn-outline">
                  Explore Services
                </Link>
              </div>

              <form
                className="home-search"
                onSubmit={(event) => {
                  event.preventDefault()
                  const query = searchTerm.trim()
                  navigate(
                    query ? `/search?q=${encodeURIComponent(query)}` : "/explore",
                  )
                }}
              >
                <Search size={19} aria-hidden="true" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  aria-label="Search demo services"
                  placeholder="Search services, skills, or outcomes"
                />
                <Button type="submit">Search</Button>
              </form>
            </div>

            <div className="home-hero-image-wrap">
              <div className="home-hero-slideshow">
                {slides.map((slide, idx) => {
                  const isActive = idx === activeSlide
                  return (
                    <div
                      key={slide.id}
                      className="home-hero-slide"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? "scale(1)" : "scale(1.05)",
                      }}
                    >
                      <MarketplaceImage
                        src={slide.image}
                        alt={slide.title}
                        className="home-hero-slide-image"
                      />
                      <div className="home-hero-slide-overlay">
                        <span className="home-hero-slide-badge">
                          ✦ {slide.badge} Category
                        </span>
                        <h3>{slide.title}</h3>
                        <p>{slide.detail}</p>
                      </div>
                    </div>
                  )
                })}

                <div className="home-hero-dots">
                  {slides.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => setActiveSlide(dotIdx)}
                      className={`home-hero-dot ${dotIdx === activeSlide ? "active" : ""}`}
                      aria-label={`Show slide ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <TrustStrip />
      </div>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Explore by craft"
            title="Bring any idea to life"
            detail="Specialists for every stage, from first sketch to final launch."
            action={{ label: "Explore all", to: "/explore" }}
          />
          <div className="category-grid">
            {categories.map((category) => {
              const theme = categoryThemes[category.slug] || { 
                bg: "var(--green)", 
                iconBg: "var(--mint)", 
                text: "var(--green-deep)" 
              };
              const Icon = categoryIcons[category.icon] || Sparkles;

              return (
                <Link
                  to={`/categories/${category.slug}`}
                  key={category.slug}
                  className="category-card"
                  style={{
                    "--theme-bg": theme.bg,
                    "--theme-icon-bg": theme.iconBg,
                    "--theme-text": theme.text,
                  }}
                >
                  <div className="category-icon">
                    <Icon size={24} />
                  </div>
                  <h3>{category.name}</h3>
                  <p>{category.description || "Explore top services in this category."}</p>
                  <span>
                    Explore category <ArrowRight size={16} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section tinted">
        <div className="container">
          <SectionHeader
            eyebrow="Popular right now"
            title="Services clients are shortlisting"
            detail="Transparent scope, thoughtful work, and talent you can get to know."
            action={{ label: "View all services", to: "/explore" }}
          />
          <div className="service-grid">
            {publishedServices.slice(0, 8).map((service) => (
              <ServiceCard service={service} key={service.id} />
            ))}
          </div>
        </div>
      </section>

      {/* Talent */}
      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Meet the talent"
            title="Experienced creatives, human collaboration"
            detail="Every profile below is illustrative demo content built around consistent marketplace data."
            action={{ label: "Browse talent", to: "/explore" }}
          />
          <div className="talent-grid">
            {freelancers.slice(0, 4).map((person) => (
              <Link
                to={`/freelancer/${person.id}`}
                className="talent-card"
                key={person.id}
              >
                <div className="talent-portrait">
                  <MarketplaceImage src={person.avatar} alt={person.name} />
                  <span>Illustrative demo profile</span>
                </div>
                <div className="talent-body">
                  <h3>{person.name}</h3>
                  <p>{person.role}</p>
                  <div className="skill-row">
                    {person.skills.slice(0, 2).map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                  <div className="talent-meta">
                    <span>
                      <Star size={14} fill="currentColor" />
                      Demo {person.rating}
                    </span>
                    <span>{person.projects} projects</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="section portfolio-section">
        <div className="container">
          <SectionHeader
            eyebrow="Portfolio inspiration"
            title="See what’s possible"
            detail="Explore recent illustrative projects across every creative discipline."
          />
          <div className="filter-tabs">
            <button
              className={portfolioFilter === "all" ? "active" : ""}
              onClick={() => setPortfolioFilter("all")}
            >
              All work
            </button>
            {categories.map((item) => (
              <button
                key={item.slug}
                className={portfolioFilter === item.slug ? "active" : ""}
                onClick={() => setPortfolioFilter(item.slug)}
              >
                {item.name}
              </button>
            ))}
          </div>
          <div className="portfolio-grid">
            {selectedPortfolios.map((project, index) => (
              <Link
                className={`portfolio-card portfolio-${index % 5}`}
                to={`/portfolio/${project.id}`}
                key={project.id}
              >
                {/* 👇 DIRECT <img> TAG WITH ERROR HANDLER 👇 */}
                <img
                  src={project.image}
                  alt={project.title}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop";
                    e.target.onerror = null; 
                  }}
                />
                
                <div>
                  <span>
                    {
                      categories.find((item) => item.slug === project.category)
                        ?.name
                    }
                  </span>
                  <h3>{project.title}</h3>
                  <ArrowRight />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section">
        <div className="container process-grid">
          <div className="process-copy">
            <span className="eyebrow">A clearer way to create</span>
            <h2>From “what if?” to work you’re proud of.</h2>
            <p>
              Choose with confidence, collaborate in one place, and always know
              what happens next.
            </p>
            <Link className="button button-dark" to="/how-it-works">
              How it works <ArrowRight size={17} />
            </Link>
          </div>
          <div className="steps">
            {[
              [
                Search,
                "01",
                "Discover the right fit",
                "Compare illustrative portfolios, packages, demo ratings, and availability.",
              ],
              [
                MessageCircle,
                "02",
                "Align before you begin",
                "Share context and ask questions in a focused project thread.",
              ],
              [
                FileCheck2,
                "03",
                "Collaborate with clarity",
                "Track delivery, files, feedback, and revisions from one workspace.",
              ],
              [
                Star,
                "04",
                "Review the outcome",
                "Approve the work and share structured feedback.",
              ],
            ].map(([Icon, number, title, detail]) => {
              const StepIcon = Icon
              return (
                <div className="step-card" key={String(number)}>
                  <span>
                    <StepIcon />
                  </span>
                  <small>{String(number)}</small>
                  <div>
                    <h3>{String(title)}</h3>
                    <p>{String(detail)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Freelancer CTA */}
      <section className="section freelancer-cta-section">
        <div className="container freelancer-cta">
          <div>
            <span className="eyebrow light">For independent professionals</span>
            <h2>Build a creative business that feels like yours.</h2>
            <p>
              Show your best work, package your expertise, and manage client
              projects with less admin.
            </p>
            <div className="cta-actions">
              <Link className="button button-primary" to="/seller/onboarding">
                Start your profile
              </Link>
              <Link
                className="button button-ghost light-button"
                to="/seller/dashboard"
              >
                Preview workspace
              </Link>
            </div>
          </div>
          <div className="dashboard-preview">
            <div className="preview-top">
              <span>Weekly overview</span>
              <small>Demo workspace</small>
            </div>
            <div className="preview-stats">
              <div>
                <small>Active projects</small>
                <strong>7</strong>
                <em>+2 this week</em>
              </div>
              <div>
                <small>Profile views</small>
                <strong>1,248</strong>
                <em>+18.4%</em>
              </div>
            </div>
            <div className="preview-chart">
              {[45, 62, 48, 80, 68, 90, 76].map((height, index) => (
                <i key={index} style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq-section">
        <div className="container faq-grid">
          <div>
            <span className="eyebrow">Frequently asked</span>
            <h2>Questions, answered clearly.</h2>
            <p>
              Still deciding? Visit our help center for practical guidance about
              demo orders and account flows.
            </p>
            <Link className="text-link" to="/help">
              Visit help center <ArrowRight size={17} />
            </Link>
          </div>
          <div className="faq-list">
            {[
              [
                "How do I choose the right service?",
                "Start with sample portfolios, then compare package scope, delivery time, illustrative ratings, and communication style.",
              ],
              [
                "Can I discuss my project before ordering?",
                "Yes. Use Contact Freelancer on any service or profile to open a demo conversation.",
              ],
              [
                "How do revisions work?",
                "Every package lists its included revision rounds. Keep feedback consolidated for a smoother project.",
              ],
              [
                "Is checkout real?",
                "No. This experience uses a mock checkout and never collects or stores real card credentials.",
              ],
            ].map(([question, answer], index) => (
              <div
                className={`faq-item ${openFaq === index ? "open" : ""}`}
                key={question}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  aria-expanded={openFaq === index}
                >
                  {question}
                  <ChevronDown />
                </button>
                {openFaq === index && <p>{answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  )
}

export default HomePage