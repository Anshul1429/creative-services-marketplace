import { useEffect, useState } from "react"
import { ArrowRight, BriefcaseBusiness, CreditCard, FileCheck2, Heart, Plus, Trash2 } from "lucide-react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { Button, DashboardShell, EmptyState, MarketplaceImage, StatusBadge } from "../components/SharedComponents.jsx"
import { useAuth } from "../context/AuthContext.jsx"
import { useStore } from "../context/StoreContext.jsx"
import { categories, freelancers } from "../services/data.js"

const blankRequirements = { goal: "", audience: "", references: "" }
const deliveryStatuses = ["Delivery submitted", "Revision requested", "Completed"]

export function BuyerOrderDetailPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { orders, submitRequirements, transitionOrder, startConversation, submitReview, reviews, getService, sellerProfileForFreelancerId } = useStore()
  const order = orders.find((item) => item.id === orderId)
  const service = getService(order?.serviceId)
  const baseFreelancer = freelancers.find((item) => item.id === order?.freelancerId)
  const sellerProfile = sellerProfileForFreelancerId(order?.freelancerId)
  const freelancer = baseFreelancer && sellerProfile
    ? { ...baseFreelancer, name: sellerProfile.name, role: sellerProfile.headline }
    : baseFreelancer
  const [requirements, setRequirements] = useState(blankRequirements)
  const [revision, setRevision] = useState("")
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [previewOpen, setPreviewOpen] = useState(false)
  const reviewed = reviews.some((item) => item.orderId === orderId)

  useEffect(() => {
    setRequirements({ ...blankRequirements, ...order?.requirements })
    setRevision("")
    setError("")
    setNotice("")
    setPreviewOpen(false)
  }, [orderId])
  useEffect(() => {
    if (!previewOpen) return undefined
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setPreviewOpen(false)
    }
    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [previewOpen])

  if (!order || !service || !freelancer) {
    return (
      <DashboardShell title="Order not found">
        <EmptyState
          icon={BriefcaseBusiness}
          title="This demo order is unavailable"
          detail="It may not exist in this browser yet, or its service is no longer available."
          action={<Link className="button button-primary" to="/dashboard/orders">View orders</Link>}
        />
      </DashboardShell>
    )
  }

  const runTransition = (next, details, success) => {
    const result = transitionOrder(order.id, next, details)
    setError(result.ok ? "" : result.error)
    setNotice(result.ok ? success : "")
  }
  const submitProjectRequirements = (event) => {
    event.preventDefault()
    const result = submitRequirements(order.id, requirements)
    setError(result.ok ? "" : result.error)
    setNotice(result.ok ? "Requirements saved locally. Your order is now in progress." : "")
  }
  const openConversation = () => {
    const conversation = startConversation(freelancer.id)
    if (!conversation) {
      setError("Unable to open this demo conversation. Please try again.")
      return
    }
    navigate(`/dashboard/messages/${conversation.id}`)
  }
  const submitRevision = (event) => {
    event.preventDefault()
    runTransition("Revision requested", { feedback: revision }, "Revision request saved locally.")
  }
  const timeline = [
    ["Requirements", order.requirementsSubmitted],
    ["In progress", ["In progress", ...deliveryStatuses].includes(order.status)],
    ["Delivery submitted", deliveryStatuses.includes(order.status)],
    ["Completed", order.status === "Completed"],
  ]

  return (
    <DashboardShell
      title={`Order #${order.id}`}
      subtitle={`${service.title} · working with ${freelancer.name}`}
      action={<StatusBadge status={order.status} />}
    >
      {error && <p className="validation-note" role="alert">{error}</p>}
      {notice && <p className="demo-submit-status" role="status">{notice}</p>}
      <div className="order-detail-layout">
        <div>
          <section className="panel order-overview">
            <MarketplaceImage src={service.image} alt={service.title} />
            <div>
              <span className="eyebrow">{order.packageName} demo package</span>
              <h2>{service.subcategory}</h2>
              <p>This is a simulated order. No payment or transaction was processed.</p>
              <div>
                <span>Demo order value <strong>₹{order.total.toLocaleString("en-IN")}</strong></span>
                <span>Due date <strong>{order.due}</strong></span>
              </div>
            </div>
          </section>
          <section className="panel">
            <div className="panel-head">
              <div><h2>Project progress</h2><p>Updates are saved in this browser demo.</p></div>
            </div>
            <div className="timeline">
              {timeline.map(([label, done], index) => (
                <div className={done ? "done" : ""} key={label}>
                  <span>{done ? "✓" : index + 1}</span>
                  <div><strong>{label}</strong><small>{label === "Delivery submitted" && order.status === "Revision requested" ? "Revision requested" : done ? "Complete" : "Not started"}</small></div>
                </div>
              ))}
            </div>
          </section>
          <section className="panel">
            <div className="panel-head">
              <div><h2>Requirements</h2><p>{order.requirementsSubmitted ? "Saved project context" : "Required before the project can begin"}</p></div>
            </div>
            {order.status === "Requirements pending" ? (
              <form className="workflow-form" onSubmit={submitProjectRequirements}>
                <p className="demo-content-note">Enter at least 20 characters describing the work and name its intended audience. Do not include sensitive information.</p>
                <label className="field">Project goal
                  <textarea rows={4} required minLength={20} maxLength={1000} value={requirements.goal} onChange={(event) => setRequirements((current) => ({ ...current, goal: event.target.value }))} placeholder="Describe the outcome, scope, and what success looks like." />
                </label>
                <label className="field">Intended audience
                  <input required maxLength={160} value={requirements.audience} onChange={(event) => setRequirements((current) => ({ ...current, audience: event.target.value }))} placeholder="Who is the work for?" />
                </label>
                <label className="field">Reference links (optional)
                  <input maxLength={500} value={requirements.references} onChange={(event) => setRequirements((current) => ({ ...current, references: event.target.value }))} placeholder="https://…" />
                </label>
                <Button type="submit">Submit requirements</Button>
              </form>
            ) : (
              <div className="requirements">
                <strong>Project goal</strong><p>{order.requirements?.goal || "Not provided"}</p>
                <strong>Audience</strong><p>{order.requirements?.audience || "Not specified"}</p>
                {order.requirements?.references && <><strong>References</strong><p>{order.requirements.references}</p></>}
                {order.revisionFeedback && <><strong>Revision feedback</strong><p>{order.revisionFeedback}</p></>}
              </div>
            )}
          </section>
          {deliveryStatuses.includes(order.status) && order.delivery && (
            <section className="panel">
              <div className="panel-head"><div><h2>Delivery preview</h2><p>Simulated demo file · no real upload or download.</p></div></div>
              <div className="file-row">
                <span>PDF</span>
                <div><strong>{order.delivery.fileName}</strong><small>{order.delivery.title} · Version {order.delivery.version}</small></div>
                <Button variant="secondary" type="button" onClick={() => setPreviewOpen(true)}>Preview</Button>
              </div>
              <p className="demo-content-note">{order.delivery.description}</p>
            </section>
          )}
        </div>
        <aside>
          <section className="panel order-actions">
            <h3>Project actions</h3>
            {order.status === "Delivery submitted" && (
              <>
                <Button className="full" onClick={() => runTransition("Completed", {}, "Delivery accepted. The demo order is complete; no payment was processed.")}>Accept delivery</Button>
                <Button variant="secondary" className="full" onClick={() => setRevision((current) => current || "Please adjust the final delivery to better match the project requirements.")}>Request revision</Button>
              </>
            )}
            {revision && order.status === "Delivery submitted" && (
              <form className="inline-form" onSubmit={submitRevision}>
                <label className="field">What needs to change? (at least 10 characters)
                  <textarea rows={4} required minLength={10} maxLength={800} value={revision} onChange={(event) => setRevision(event.target.value)} />
                </label>
                <Button type="submit">Send revision request</Button>
              </form>
            )}
            {order.status === "Completed" && (
              <p className="demo-content-note">This demo order is complete. No transaction, refund, or payment has taken place.</p>
            )}
            <Button variant="secondary" className="full" onClick={openConversation}>Message freelancer</Button>
            {order.status === "Completed" && !reviewed && <Link className="button button-secondary full" to={`/dashboard/reviews?order=${order.id}`}>Write a demo review</Link>}
            {reviewed && <p role="status">A demo review is saved for this order.</p>}
          </section>
          <section className="panel">
            <h3>Package includes</h3>
            {service.packages.find((item) => item.name === order.packageName)?.includes.map((item) => <p className="included" key={item}>✓ {item}</p>)}
          </section>
        </aside>
      </div>
      {previewOpen && (
        <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setPreviewOpen(false) }}>
          <section className="panel delivery-preview-dialog" role="dialog" aria-modal="true" aria-labelledby="delivery-preview-title">
            <button type="button" className="dialog-close" aria-label="Close delivery preview" onClick={() => setPreviewOpen(false)}>×</button>
            <span className="eyebrow">Illustrative file preview</span>
            <h2 id="delivery-preview-title">{order.delivery?.title}</h2>
            <p>{order.delivery?.description}</p>
            <div className="delivery-preview-placeholder"><FileCheck2 /><strong>{order.delivery?.fileName}</strong><span>Preview content is simulated. No file was uploaded.</span></div>
            <Button onClick={() => setPreviewOpen(false)}>Close preview</Button>
          </section>
        </div>
      )}
    </DashboardShell>
  )
}

export function BuyerSettingsPage() {
  const { user, signIn } = useAuth()
  const { getProfile, updateProfile } = useStore()
  const initialProfile = getProfile(user?.email)
  const [profile, setProfile] = useState(initialProfile)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const save = (event) => {
    event.preventDefault()
    if (profile.firstName.trim().length < 2 || profile.lastName.trim().length < 2) {
      setError("Enter a first and last name with at least two characters.")
      return
    }
    if (!updateProfile(user?.email, { ...profile, firstName: profile.firstName.trim(), lastName: profile.lastName.trim() })) {
      setError("Unable to save this demo profile.")
      return
    }
    signIn({ ...user, name: `${profile.firstName.trim()} ${profile.lastName.trim()}` })
    setError("")
    setSaved(true)
  }
  return (
    <DashboardShell title="Profile & account settings" subtitle="Edit the buyer profile stored in this browser demo.">
      <form className="panel settings-form workflow-form" onSubmit={save}>
        {error && <p className="validation-note" role="alert">{error}</p>}
        {saved && <p className="demo-submit-status" role="status">Profile changes saved locally. Your demo sign-in email stays unchanged.</p>}
        <div className="two-fields">
          <label className="field">First name<input required minLength={2} maxLength={60} value={profile.firstName} onChange={(event) => { setSaved(false); setProfile((current) => ({ ...current, firstName: event.target.value })) }} /></label>
          <label className="field">Last name<input required minLength={2} maxLength={60} value={profile.lastName} onChange={(event) => { setSaved(false); setProfile((current) => ({ ...current, lastName: event.target.value })) }} /></label>
        </div>
        <label className="field">Demo account email<input type="email" value={profile.email} disabled /><small>Authentication identity cannot be changed in this frontend demo.</small></label>
        <label className="field">Phone (optional)<input type="tel" maxLength={30} value={profile.phone} onChange={(event) => { setSaved(false); setProfile((current) => ({ ...current, phone: event.target.value })) }} /></label>
        <label className="field">About you<textarea rows={5} maxLength={600} value={profile.bio} onChange={(event) => { setSaved(false); setProfile((current) => ({ ...current, bio: event.target.value })) }} /></label>
        <Button type="submit">Save profile locally</Button>
      </form>
    </DashboardShell>
  )
}

export function BuyerBillingPage() {
  const { paymentMethods, addDemoPaymentMethod, removePaymentMethod, setDefaultPaymentMethod } = useStore()
  const [method, setMethod] = useState("")
  const [feedback, setFeedback] = useState("")
  const [error, setError] = useState("")
  const add = (event) => {
    event.preventDefault()
    const result = addDemoPaymentMethod(method)
    setError(result.ok ? "" : result.error)
    setFeedback(result.ok ? "A demo payment method was saved locally. No card was verified." : "")
    if (result.ok) setMethod("")
  }
  return (
    <DashboardShell title="Billing & payments" subtitle="Manage sample payment options. No payment is processed in this demo.">
      <section className="panel">
        <div className="panel-head"><div><h2>Demo payment methods</h2><p>These are placeholder methods only; never enter real payment details.</p></div></div>
        {paymentMethods.length ? <div className="demo-method-list">
          {paymentMethods.map((item) => <article key={item.id}>
            <CreditCard />
            <div><strong>{item.label}</strong><small>{item.type} · demo only{item.isDefault ? " · Default" : ""}</small></div>
            {!item.isDefault && <Button variant="secondary" onClick={() => { setDefaultPaymentMethod(item.id); setFeedback("Default demo method updated.") }}>Make default</Button>}
            <Button variant="ghost" aria-label={`Remove ${item.label}`} onClick={() => { removePaymentMethod(item.id); setFeedback("Demo method removed.") }}><Trash2 size={17} /></Button>
          </article>)}
        </div> : <EmptyState icon={CreditCard} title="No demo methods saved" detail="Add one of the preset demo methods to see the billing screen in use." />}
      </section>
      <form className="panel workflow-form" onSubmit={add}>
        <h2>Add a preset demo method</h2>
        <label className="field">Available demo method
          <select required value={method} onChange={(event) => setMethod(event.target.value)}>
            <option value="">Choose a demo method</option>
            <option value="demo-card-4242">Demo Visa ending in 4242</option>
            <option value="demo-upi">demo@upi · simulated</option>
          </select>
        </label>
        {error && <p className="validation-note" role="alert">{error}</p>}
        {feedback && <p className="demo-submit-status" role="status">{feedback}</p>}
        <Button type="submit">Add demo method</Button>
      </form>
      <p className="demo-content-note">A stored method is for interface testing only. No authorization, charge, refund, or payout can occur.</p>
    </DashboardShell>
  )
}

export function BuyerBriefsPage() {
  const { briefs, deleteBrief } = useStore()
  return (
    <DashboardShell title="Project briefs" subtitle="Drafts you create here are stored locally in this browser.">
      <div className="dashboard-head-inline">
        <Link className="button button-primary" to="/dashboard/briefs/new"><Plus size={17} /> Create project brief</Link>
        <Link className="button button-secondary" to="/dashboard/briefs/new?format=job-description">Post a job description</Link>
      </div>
      {briefs.length ? <section className="panel brief-list">
        {briefs.map((brief) => <article key={brief.id}>
          <div><span className="eyebrow">{brief.format === "job-description" ? "Job description" : "Project brief"} · {brief.status}</span><h2>{brief.title}</h2><p>{brief.description}</p><small>{brief.category} · {brief.budget || "Budget not set"} · {brief.timeline || "Timeline flexible"}</small></div>
          <Button variant="ghost" aria-label={`Delete ${brief.title}`} onClick={() => deleteBrief(brief.id)}><Trash2 /></Button>
        </article>)}
      </section> : <EmptyState icon={BriefcaseBusiness} title="No briefs yet" detail="Create a short project brief or a longer job description to organize your demo hiring needs." action={<Link className="button button-primary" to="/dashboard/briefs/new"><Plus size={17} /> Create your first brief</Link>} />}
    </DashboardShell>
  )
}

export function BuyerBriefFormPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const jobDescription = params.get("format") === "job-description"
  const { createBrief } = useStore()
  const [form, setForm] = useState({ title: "", description: "", category: "", budget: "", timeline: "" })
  const [error, setError] = useState("")
  const submit = (event) => {
    event.preventDefault()
    if (form.title.trim().length < 5 || form.description.trim().length < (jobDescription ? 60 : 30)) {
      setError(jobDescription ? "Add a title and a job description of at least 60 characters." : "Add a title and project brief of at least 30 characters.")
      return
    }
    createBrief({ ...form, title: form.title.trim(), description: form.description.trim(), format: jobDescription ? "job-description" : "brief" })
    navigate("/dashboard/briefs", { replace: true })
  }
  return (
    <DashboardShell title={jobDescription ? "Post a job description" : "Create a project brief"} subtitle="Saved locally for this demo only. It is not published to freelancers.">
      <form className="panel workflow-form" onSubmit={submit}>
        {error && <p className="validation-note" role="alert">{error}</p>}
        <label className="field">Title<input required minLength={5} maxLength={100} value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder={jobDescription ? "Role or project title" : "What do you need help with?"} /></label>
        <label className="field">{jobDescription ? "Job description" : "Project description"}
          <textarea rows={7} required minLength={jobDescription ? 60 : 30} maxLength={2000} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder={jobDescription ? "Describe the work, responsibilities, skills, and expected outcome." : "Describe scope, audience, references, and success criteria."} />
          <small>{form.description.length}/2000 characters</small>
        </label>
        <label className="field">Creative category<select required value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}><option value="">Choose a category</option>{categories.map((category) => <option key={category.slug}>{category.name}</option>)}</select></label>
        <div className="two-fields">
          <label className="field">Demo budget range<input maxLength={80} value={form.budget} onChange={(event) => setForm((current) => ({ ...current, budget: event.target.value }))} placeholder="e.g. ₹20,000–₹40,000" /></label>
          <label className="field">Target timeline<input maxLength={80} value={form.timeline} onChange={(event) => setForm((current) => ({ ...current, timeline: event.target.value }))} placeholder="e.g. 3–4 weeks" /></label>
        </div>
        <p className="demo-content-note">This form does not publish an offer, contact sellers, or create a contract.</p>
        <Button type="submit">Save {jobDescription ? "job description" : "brief"} locally</Button>
      </form>
    </DashboardShell>
  )
}

export function BuyerReviewsPage() {
  const { orders, reviews, submitReview, getService } = useStore()
  const [params] = useSearchParams()
  const completed = orders.filter((order) => order.status === "Completed")
  const eligible = completed.filter((order) => !reviews.some((review) => review.orderId === order.id))
  const [orderId, setOrderId] = useState(params.get("order") || eligible[0]?.id || "")
  const [rating, setRating] = useState("5")
  const [text, setText] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  useEffect(() => {
    const requestedOrder = params.get("order")
    if (requestedOrder && eligible.some((order) => order.id === requestedOrder)) {
      setOrderId(requestedOrder)
    }
  }, [params, eligible])
  const selectedOrder = eligible.find((order) => order.id === orderId) || eligible[0]
  const freelancer = freelancers.find((item) => item.id === selectedOrder?.freelancerId)
  const submit = (event) => {
    event.preventDefault()
    if (!selectedOrder || text.trim().length < 20) {
      setError("Choose a completed order and write at least 20 characters.")
      return
    }
    const result = submitReview({ orderId: selectedOrder.id, freelancerId: selectedOrder.freelancerId, rating: Number(rating), text: text.trim() })
    setError(result.ok ? "" : result.error)
    setMessage(result.ok ? "Demo review saved locally. It was not published." : "")
    if (result.ok) setText("")
  }
  return (
    <DashboardShell title="Reviews" subtitle="Reviews are private illustrative demo data and are not published.">
      {eligible.length ? <form className="panel workflow-form" onSubmit={submit}>
        <h2>Review a completed demo order</h2>
        <label className="field">Completed order<select required value={selectedOrder?.id || ""} onChange={(event) => setOrderId(event.target.value)}>{eligible.map((order) => <option key={order.id} value={order.id}>#{order.id} · {getService(order.serviceId)?.subcategory || "Demo service"}</option>)}</select></label>
        {freelancer && <p>Freelancer: <strong>{freelancer.name}</strong></p>}
        <label className="field">Illustrative rating<select value={rating} onChange={(event) => setRating(event.target.value)}>{[5, 4, 3, 2, 1].map((score) => <option key={score} value={score}>{score} / 5</option>)}</select></label>
        <label className="field">Feedback<textarea required minLength={20} maxLength={800} rows={5} value={text} onChange={(event) => setText(event.target.value)} placeholder="Share respectful, specific feedback (at least 20 characters)." /></label>
        {error && <p className="validation-note" role="alert">{error}</p>}
        {message && <p className="demo-submit-status" role="status">{message}</p>}
        <Button type="submit">Save demo review</Button>
      </form> : <EmptyState icon={Heart} title={completed.length ? "All eligible orders are reviewed" : "No completed orders to review"} detail={completed.length ? "You have already reviewed each completed demo order." : "Complete an order before adding a demo review."} action={<Link className="button button-secondary" to="/dashboard/orders">View orders</Link>} />}
      {reviews.length > 0 && <section className="panel review-list"><h2>Your saved demo reviews</h2>{reviews.map((review) => <article key={review.id}><strong>{freelancers.find((person) => person.id === review.freelancerId)?.name || "Demo freelancer"} · {review.rating}/5</strong><p>{review.text}</p><small>Order #{review.orderId} · saved locally</small></article>)}</section>}
    </DashboardShell>
  )
}

export function BuyerSupportPage() {
  const { submitSupportRequest } = useStore()
  const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" })
  const [error, setError] = useState("")
  const [request, setRequest] = useState(null)
  const submit = (event) => {
    event.preventDefault()
    if (
      form.name.trim().length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) ||
      !form.topic ||
      form.message.trim().length < 15
    ) {
      setError("Enter a valid name and email, choose a topic, and write at least 15 characters.")
      return
    }
    setError("")
    setRequest(submitSupportRequest({ ...form, name: form.name.trim(), message: form.message.trim() }))
  }
  return (
    <DashboardShell title="Demo support" subtitle="Your request stays in this browser and is not sent to a support team.">
      {request ? <section className="panel support-confirmation" role="status"><span className="eyebrow">Request recorded locally</span><h2>Thanks, {request.name}.</h2><p>Demo reference: {request.id}. No message was transmitted.</p><Button onClick={() => { setRequest(null); setForm({ name: "", email: "", topic: "", message: "" }) }}>Submit another demo request</Button>      </section> : <form className="panel workflow-form" noValidate onSubmit={submit}>
        {error && <p className="validation-note" role="alert">{error}</p>}
        <div className="two-fields">
          <label className="field">Name<input required minLength={2} maxLength={80} autoComplete="name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} /></label>
          <label className="field">Email<input required type="email" autoComplete="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} /></label>
        </div>
        <label className="field">Topic<select required value={form.topic} onChange={(event) => setForm((current) => ({ ...current, topic: event.target.value }))}><option value="">Choose a topic</option><option>Orders and delivery</option><option>Messages</option><option>Favorites and account</option><option>Other demo feedback</option></select></label>
        <label className="field">How can we help?<textarea required minLength={15} maxLength={1000} rows={5} value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} placeholder="Describe the issue without sensitive information." /></label>
        <p className="demo-content-note">This is a local form validation and confirmation only; it cannot contact support.</p>
        <Button type="submit">Save demo support request</Button>
      </form>}
    </DashboardShell>
  )
}
