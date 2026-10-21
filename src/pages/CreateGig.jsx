import { useMemo, useState } from "react"
import { ArrowRight, Eye, Plus, Save, X } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button, DashboardShell } from "../components/SharedComponents.jsx"
import { useAuth } from "../context/AuthContext.jsx"
import { useStore } from "../context/StoreContext.jsx"
import { categories, services } from "../services/data.js"

const defaultPackages = [
  { name: "Basic", price: 2499, delivery: 5, revisions: 2, description: "A focused starter package", includes: ["One core concept", "Source files"] },
  { name: "Standard", price: 5999, delivery: 8, revisions: 4, description: "A complete solution for growing teams", includes: ["Three concepts", "Source files", "Usage guide"] },
  { name: "Premium", price: 9999, delivery: 12, revisions: 6, description: "A comprehensive creative partnership", includes: ["Full creative direction", "Source files", "Usage guide"] },
]
const blankForm = () => ({
  title: "",
  category: "graphic-design",
  subcategory: "",
  description: "",
  tags: "",
  image: "",
  gallery: "",
  requirements: "",
  faqs: [],
  packages: defaultPackages.map((item) => ({ ...item })),
})

export function ServiceFormPage() {
  const { serviceId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getService, getSellerProfile, saveSellerService } = useStore()
  const existing = serviceId ? getService(serviceId) : null
  const owner = existing && existing.sellerEmail && existing.sellerEmail !== user?.email
  const initialForm = useMemo(() => {
    if (!existing) return blankForm()
    return {
      ...blankForm(),
      ...existing,
      tags: (existing.tags || []).join(", "),
      gallery: (existing.gallery || []).join(", "),
      requirements: existing.requirements || "",
      faqs: (existing.faqs || []).map((item) => ({ ...item })),
      packages: existing.packages.map((item) => ({ ...item })),
    }
  }, [existing])
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState("")
  const [feedback, setFeedback] = useState("")
  const [saving, setSaving] = useState(false)
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const updatePackage = (index, key, value) =>
    setForm((current) => ({
      ...current,
      packages: current.packages.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }))

  const submit = (status) => (event) => {
    event.preventDefault()
    setError("")
    setFeedback("")
    const profile = getSellerProfile(user?.email)
    if (!user?.email || owner) {
      setError("This service cannot be edited from the current demo seller account.")
      return
    }
    if (form.title.trim().length < 10 || form.description.trim().length < 40 || !form.subcategory.trim()) {
      setError("Add a title of at least 10 characters, a subcategory, and a description of at least 40 characters.")
      return
    }
    const packages = form.packages.map((item) => ({
      ...item,
      price: Number(item.price),
      delivery: Number(item.delivery),
      revisions: Number(item.revisions),
    }))
    if (packages.some((item) => !Number.isFinite(item.price) || item.price < 1 || !Number.isInteger(item.delivery) || item.delivery < 1 || !Number.isInteger(item.revisions) || item.revisions < 0)) {
      setError("Each package needs a positive price and delivery time, with zero or more revisions.")
      return
    }
    if (form.faqs.some((item) => !item.question.trim() || !item.answer.trim())) {
      setError("Complete both the question and answer for each FAQ, or remove the empty row.")
      return
    }
    setSaving(true)
    const category = categories.find((item) => item.slug === form.category)
    const result = saveSellerService(user.email, {
      ...form,
      id: existing?.id,
      sellerEmail: user.email,
      freelancerId: profile.freelancerId || "freelancer-1",
      title: form.title.trim(),
      subcategory: form.subcategory.trim(),
      description: form.description.trim(),
      category: category?.slug || "graphic-design",
      tags: form.tags.split(",").map((item) => item.trim()).filter(Boolean),
      image: form.image.trim() || existing?.image || services[0].image,
      gallery: form.gallery.split(",").map((item) => item.trim()).filter(Boolean),
      requirements: form.requirements.trim(),
      faqs: form.faqs.map((item) => ({ question: item.question.trim(), answer: item.answer.trim() })).filter((item) => item.question),
      packages,
      status,
    })
    setSaving(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    if (status === "Draft") {
      setFeedback("Draft saved in this browser. It is not visible in marketplace search.")
      navigate(`/seller/services/${result.service.id}/edit`, { replace: true })
    } else {
      setFeedback("Service published in the local demo marketplace. No server publication occurred.")
      navigate(`/service/${result.service.id}`)
    }
  }

  return (
    <DashboardShell
      seller
      title={existing ? "Edit service" : "Create a new service"}
      subtitle="Build a clear offer with editable packages. Changes are saved only in this browser demo."
    >
      {owner ? <p className="validation-note" role="alert">This listing belongs to another demo seller.</p> : null}
      <form className="service-form workflow-form" onSubmit={submit("Published")}>
        <section className="panel">
          <span className="form-section-number">01</span>
          <h2>Service overview</h2>
          <p>Help clients understand the outcome in a few seconds.</p>
          <label className="field">Service title
            <input required minLength={10} maxLength={100} value={form.title} onChange={(event) => update("title", event.target.value)} />
          </label>
          <div className="two-fields">
            <label className="field">Category
              <select value={form.category} onChange={(event) => update("category", event.target.value)}>
                {categories.map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}
              </select>
            </label>
            <label className="field">Subcategory
              <input required maxLength={80} value={form.subcategory} onChange={(event) => update("subcategory", event.target.value)} />
            </label>
          </div>
          <label className="field">Description
            <textarea required minLength={40} maxLength={3000} rows={7} value={form.description} onChange={(event) => update("description", event.target.value)} />
          </label>
          <label className="field">Search tags <input value={form.tags} onChange={(event) => update("tags", event.target.value)} placeholder="Separate tags with commas" /></label>
          <div className="two-fields">
            <label className="field">Cover image URL (optional)<input type="url" value={form.image} onChange={(event) => update("image", event.target.value)} placeholder="https://example.com/cover.jpg" /></label>
            <label className="field">Gallery image URLs (optional)<input value={form.gallery} onChange={(event) => update("gallery", event.target.value)} placeholder="Separate image URLs with commas" /></label>
          </div>
          <small>Only provide images you have permission to use. Uploads are not supported in this frontend demo.</small>
        </section>
        <section className="panel">
          <span className="form-section-number">02</span>
          <h2>Packages</h2>
          <p>Give clients meaningful options without unnecessary complexity.</p>
          <div className="package-editor">
            {form.packages.map((pack, index) => <div key={pack.name}>
              <h3>{pack.name}</h3>
              <label>Price (₹)<input required type="number" min="1" value={pack.price} onChange={(event) => updatePackage(index, "price", event.target.value)} /></label>
              <label>Delivery days<input required type="number" min="1" max="365" value={pack.delivery} onChange={(event) => updatePackage(index, "delivery", event.target.value)} /></label>
              <label>Revisions<input required type="number" min="0" max="100" value={pack.revisions} onChange={(event) => updatePackage(index, "revisions", event.target.value)} /></label>
              <label>Summary<textarea required rows={3} value={pack.description} onChange={(event) => updatePackage(index, "description", event.target.value)} /></label>
            </div>)}
          </div>
        </section>
        <section className="panel">
          <span className="form-section-number">03</span>
          <h2>Requirements & FAQ</h2>
          <label className="field">What do you need from the client?
            <textarea rows={5} value={form.requirements} onChange={(event) => update("requirements", event.target.value)} />
          </label>
          {form.faqs.map((faq, index) => <div className="faq-editor-row" key={`faq-${index}`}>
            <label className="field">Question {index + 1}<input value={faq.question} onChange={(event) => setForm((current) => ({ ...current, faqs: current.faqs.map((item, itemIndex) => itemIndex === index ? { ...item, question: event.target.value } : item) }))} /></label>
            <label className="field">Answer {index + 1}<textarea rows={3} value={faq.answer} onChange={(event) => setForm((current) => ({ ...current, faqs: current.faqs.map((item, itemIndex) => itemIndex === index ? { ...item, answer: event.target.value } : item) }))} /></label>
            <Button type="button" variant="ghost" aria-label={`Remove FAQ ${index + 1}`} onClick={() => setForm((current) => ({ ...current, faqs: current.faqs.filter((_, itemIndex) => itemIndex !== index) }))}><X size={17} /> Remove FAQ</Button>
          </div>)}
          <Button type="button" variant="secondary" onClick={() => setForm((current) => ({ ...current, faqs: [...current.faqs, { question: "", answer: "" }] }))}><Plus size={17} /> Add FAQ</Button>
        </section>
        {error && <p className="validation-note" role="alert">{error}</p>}
        {feedback && <p className="demo-submit-status" role="status">{feedback}</p>}
        <div className="form-actions">
          <Button type="button" variant="secondary" disabled={saving} onClick={submit("Draft")}>
            <Save size={17} /> Save draft
          </Button>
          {existing && <Link className="button button-secondary" to={`/service/${existing.id}`}><Eye size={17} /> Preview</Link>}
          <Button type="submit" disabled={saving || owner}>{saving ? "Saving…" : existing ? "Save & publish" : "Publish demo service"}<ArrowRight size={17} /></Button>
        </div>
      </form>
    </DashboardShell>
  )
}

export default ServiceFormPage
