import { useState } from "react"
import { ArrowRight, Check } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Button, PageShell } from "../components/SharedComponents.jsx"
import { useAuth } from "../context/AuthContext.jsx"
import { useStore } from "../context/StoreContext.jsx"
import { categories } from "../services/data.js"

const stepNames = ["Your profile", "Expertise", "Portfolio", "First service", "Preview"]

export function OnboardingPage() {
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const { getSellerProfile, saveSellerProfile, addSellerPortfolio, saveSellerService } = useStore()
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState(() => getSellerProfile(user?.email))
  const [project, setProject] = useState({ title: "", tools: "", image: "" })
  const [service, setService] = useState({ title: "", price: 2499, delivery: 5 })
  const [error, setError] = useState("")
  const [complete, setComplete] = useState(false)
  const update = (key, value) => setProfile((current) => ({ ...current, [key]: value }))
  const saveStep = () => {
    setError("")
    if (step === 1 && (profile.name.trim().length < 2 || profile.headline.trim().length < 8 || profile.bio.trim().length < 30)) {
      setError("Add your name, a headline of at least 8 characters, and a short bio of at least 30 characters.")
      return
    }
    if (step === 2 && (!profile.category || !profile.skills.length)) {
      setError("Select an expertise category and add at least one skill.")
      return
    }
    if (step === 3 && project.title.trim()) {
      addSellerPortfolio(user.email, {
        title: project.title.trim(),
        tools: project.tools.split(",").map((item) => item.trim()).filter(Boolean),
        image: project.image.trim() || "https://images.unsplash.com/photo-1622960668894-75d014c9bf83?auto=format&fit=crop&w=1200&q=85",
      })
      setProject({ title: "", tools: "", image: "" })
    }
    if (step === 4 && (service.title.trim().length < 10 || Number(service.price) < 1 || Number(service.delivery) < 1)) {
      setError("Add a service title of at least 10 characters, a positive price, and a delivery time.")
      return
    }
    saveSellerProfile(user?.email, { ...profile, onboardingComplete: false })
    if (step < stepNames.length) {
      setStep((current) => current + 1)
      return
    }
    const published = saveSellerService(user.email, {
      title: service.title.trim(),
      freelancerId: profile.freelancerId || "freelancer-1",
      category: profile.category,
      subcategory: categories.find((item) => item.slug === profile.category)?.subcategories[0] || "Creative services",
      description: `${profile.bio.trim()} This sample service is published only in the local marketplace demo.`,
      tags: profile.skills,
      image: "https://images.unsplash.com/photo-1622960668894-75d014c9bf83?auto=format&fit=crop&w=1200&q=85",
      gallery: [],
      requirements: "Share your project goals, audience, and relevant references.",
      faqs: [],
      packages: [
        { name: "Basic", price: Number(service.price), delivery: Number(service.delivery), revisions: 2, description: "A focused starter package", includes: ["One core concept", "Source files"] },
        { name: "Standard", price: Number(service.price) + 3500, delivery: Number(service.delivery) + 3, revisions: 4, description: "A complete creative solution", includes: ["Three concepts", "Source files"] },
        { name: "Premium", price: Number(service.price) + 7500, delivery: Number(service.delivery) + 7, revisions: 6, description: "A comprehensive creative partnership", includes: ["Full creative direction", "Source files"] },
      ],
      status: "Published",
    })
    if (!published.ok) {
      setError(published.error)
      return
    }
    saveSellerProfile(user.email, { ...profile, onboardingComplete: true })
    signIn({ ...user, name: profile.name.trim() })
    setComplete(true)
  }

  if (complete) return (
    <PageShell>
      <div className="confirmation-page">
        <span><Check /></span>
        <small>Demo seller profile ready</small>
        <h1>Your freelance studio is ready.</h1>
        <p>Your profile, portfolio, and first service are stored only in this browser. No real publication occurred.</p>
        <Button onClick={() => navigate("/seller/dashboard")}>Open seller workspace</Button>
      </div>
    </PageShell>
  )

  return (
    <PageShell compact>
      <div className="onboarding">
        <aside>
          <span className="eyebrow light">Freelancer onboarding</span>
          <h2>Build a profile clients can understand quickly.</h2>
          <nav>{stepNames.map((label, index) => (
            <button type="button" className={step === index + 1 ? "active" : step > index + 1 ? "done" : ""} onClick={() => step > index + 1 && setStep(index + 1)} key={label}>
              <span>{step > index + 1 ? <Check /> : index + 1}</span>{label}
            </button>
          ))}</nav>
          <small>Your onboarding progress is saved in this browser demo.</small>
        </aside>
        <main>
          <div className="onboarding-head"><span>Step {step} of {stepNames.length}</span><strong>{Math.round((step / stepNames.length) * 100)}% complete</strong></div>
          {step === 1 && <div className="step-form">
            <h1>Tell clients who you are.</h1><p>Use your professional identity and a concise headline.</p>
            <label className="field">Full name<input required value={profile.name} onChange={(event) => update("name", event.target.value)} /></label>
            <label className="field">City<input value={profile.city} onChange={(event) => update("city", event.target.value)} /></label>
            <label className="field">Professional headline<input required value={profile.headline} onChange={(event) => update("headline", event.target.value)} /></label>
            <label className="field">Bio<textarea required rows={5} value={profile.bio} onChange={(event) => update("bio", event.target.value)} /></label>
          </div>}
          {step === 2 && <div className="step-form">
            <h1>Choose your expertise.</h1><p>Set a primary category, skills, and languages.</p>
            <label className="field">Primary category<select value={profile.category} onChange={(event) => update("category", event.target.value)}>{categories.map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}</select></label>
            <label className="field">Skills<input value={profile.skills.join(", ")} onChange={(event) => update("skills", event.target.value.split(",").map((item) => item.trim()).filter(Boolean))} /></label>
            <label className="field">Experience<select value={profile.experience} onChange={(event) => update("experience", event.target.value)}><option>5–8 years</option><option>2–4 years</option><option>8+ years</option><option>Less than 2 years</option></select></label>
            <label className="field">Languages<input value={profile.languages.join(", ")} onChange={(event) => update("languages", event.target.value.split(",").map((item) => item.trim()).filter(Boolean))} /></label>
          </div>}
          {step === 3 && <div className="step-form">
            <h1>Show your best work.</h1><p>Add an illustrative portfolio project; no file upload or external publication is performed.</p>
            <label className="field">Project title<input value={project.title} onChange={(event) => setProject((current) => ({ ...current, title: event.target.value }))} placeholder="Optional demo project title" /></label>
            <label className="field">Tools or skills<input value={project.tools} onChange={(event) => setProject((current) => ({ ...current, tools: event.target.value }))} placeholder="Separate with commas" /></label>
            <label className="field">Image URL (optional)<input type="url" value={project.image} onChange={(event) => setProject((current) => ({ ...current, image: event.target.value }))} /></label>
            <small>Leave the title blank to skip adding a sample project.</small>
          </div>}
          {step === 4 && <div className="step-form">
            <h1>Package your first service.</h1><p>Set clear expectations for the first package; other tiers are populated as editable demo options.</p>
            <label className="field">Service title<input required minLength={10} value={service.title} onChange={(event) => setService((current) => ({ ...current, title: event.target.value }))} placeholder="I will create..." /></label>
            <div className="two-fields">
              <label className="field">Starting price (₹)<input required type="number" min="1" value={service.price} onChange={(event) => setService((current) => ({ ...current, price: event.target.value }))} /></label>
              <label className="field">Delivery days<input required type="number" min="1" max="365" value={service.delivery} onChange={(event) => setService((current) => ({ ...current, delivery: event.target.value }))} /></label>
            </div>
          </div>}
          {step === 5 && <div className="step-form preview-step">
            <span><Check /></span><h1>Ready to share your expertise?</h1>
            <p>Review the local demo profile, portfolio, and first service before saving.</p>
            <ul><li>{profile.name} · {profile.city}</li><li>{profile.headline}</li><li>{profile.skills.join(", ")}</li><li>{service.title} · ₹{Number(service.price).toLocaleString("en-IN")}</li></ul>
          </div>}
          {error && <p className="validation-note" role="alert">{error}</p>}
          <div className="onboarding-actions">
            {step > 1 ? <Button variant="secondary" onClick={() => setStep((current) => current - 1)}>Back</Button> : <span />}
            <Button onClick={saveStep}>{step === stepNames.length ? "Publish demo profile" : "Save & continue"}<ArrowRight size={17} /></Button>
          </div>
        </main>
      </div>
    </PageShell>
  )
}
