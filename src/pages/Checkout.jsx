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

import { NotFoundPage } from "./NotFound.jsx"

export function CheckoutPage() {
  const { serviceId } = useParams()
  const store = useStore()
  const service = store.getService(serviceId)
  const [params, setParams] = useSearchParams()
  const packageName = params.get("package") || "Standard"
  const [checkoutKey] = useState(
    () =>
      params.get("checkout") ||
      (globalThis.crypto?.randomUUID?.() ?? `checkout-${Date.now()}-${Math.random().toString(36).slice(2)}`),
  )
  const initialIndex = Math.max(
    0,
    service?.packages.findIndex((item) => item.name === packageName) ?? 1,
  )
  const [step, setStep] = useState(1)
  const [packageIndex, setPackageIndex] = useState(initialIndex)
  const [priority, setPriority] = useState(params.get("addon") === "priority")
  const [brief, setBrief] = useState("")
  const [demoConsent, setDemoConsent] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [confirmedOrder, setConfirmedOrder] = useState(null)
  const [orderError, setOrderError] = useState("")
  const { addOrder, orders } = store
  useEffect(() => {
    if (params.get("checkout") === checkoutKey) return
    const next = new URLSearchParams(params)
    next.set("checkout", checkoutKey)
    setParams(next, { replace: true })
  }, [checkoutKey, params, setParams])
  if (!service) return <NotFoundPage />
  if (!service.available) {
    return (
      <PageShell>
        <EmptyState
          title="This service is unavailable in the demo"
          detail="No checkout or sample order can be created for this listing."
          action={
            <Link className="button button-secondary" to={`/service/${service.id}`}>
              Return to service details
            </Link>
          }
        />
      </PageShell>
    )
  }
  const existingOrder = orders.find((order) => order.checkoutKey === checkoutKey)
  const selected = service.packages[packageIndex]
  const fee = Math.round(selected.price * 0.05)
  const total = selected.price + fee + (priority ? 1499 : 0)
  const confirm = () => {
    if (confirming || !demoConsent) return
    setConfirming(true)
    setOrderError("")
    const result = addOrder({
      id: `FLG-${Date.now().toString().slice(-7)}${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,
      checkoutKey,
      serviceId: service.id,
      freelancerId: service.freelancerId,
      packageName: selected.name,
      total,
      status: "Requirements pending",
      due: "25 Jun",
      requirements: { goal: brief.trim(), audience: "", references: "" },
      requirementsSubmitted: false,
    })
    if (!result.ok) {
      setOrderError(result.error)
      setConfirming(false)
      return
    }
    setConfirmedOrder(result.order)
    setConfirming(false)
  }
  if (confirmedOrder || existingOrder)
    {
    const order = confirmedOrder || existingOrder
    return (
      <PageShell>
        <div className="confirmation-page">
          <span>
            <Check />
          </span>
          <small>Demo order created</small>
          <h1>Your project is ready to begin.</h1>
          <p>
            No payment was processed. This order now appears in your local demo
            dashboard.
          </p>
          <div>
            <Link className="button button-primary" to={`/dashboard/orders/${order.id}`}>
              Continue order requirements
            </Link>
            <Link className="button button-secondary" to={`/dashboard/messages?person=${service.freelancerId}`}>
              Message freelancer
            </Link>
          </div>
        </div>
      </PageShell>
    )
    }
  return (
    <PageShell compact>
      <div className="checkout-page">
        <div className="checkout-progress">
          {["Review", "Extras", "Requirements", "Payment"].map(
            (label, index) => (
              <div className={step >= index + 1 ? "active" : ""} key={label}>
                <span>{step > index + 1 ? <Check /> : index + 1}</span>
                <strong>{label}</strong>
              </div>
            ),
          )}
        </div>
        <div className="checkout-grid">
          <div className="checkout-main">
            {step === 1 && (
              <section>
                <span className="eyebrow">Step 1 of 4</span>
                <h1>Review your package</h1>
                <div className="checkout-service">
                  <img src={service.image} alt="" />
                  <div>
                    <small>{service.subcategory}</small>
                    <h3>{service.title}</h3>
                  </div>
                </div>
                <div className="package-options">
                  {service.packages.map((pack, index) => (
                    <button
                      className={index === packageIndex ? "selected" : ""}
                      onClick={() => setPackageIndex(index)}
                      key={pack.name}
                    >
                      <span>{pack.name}</span>
                      <strong>₹{pack.price.toLocaleString("en-IN")}</strong>
                      <small>
                        {pack.delivery} days · {pack.revisions} revisions
                      </small>
                    </button>
                  ))}
                </div>
              </section>
            )}
            {step === 2 && (
              <section>
                <span className="eyebrow">Step 2 of 4</span>
                <h1>Shape your timeline</h1>
                <p>
                  Choose an optional demo extra. No real payment will be
                  collected.
                </p>
                <label className={`extra-card ${priority ? "selected" : ""}`}>
                  <input
                    type="checkbox"
                    checked={priority}
                    onChange={(e) => setPriority(e.target.checked)}
                  />
                  <span>
                    <strong>48-hour priority start</strong>
                    <small>
                      Your freelancer will prioritize discovery and kickoff.
                    </small>
                  </span>
                  <strong>+ ₹1,499</strong>
                </label>
                <label className="extra-card muted">
                  <input type="checkbox" disabled />
                  <span>
                    <strong>Live strategy workshop</strong>
                    <small>Not available with this package.</small>
                  </span>
                  <strong>+ ₹2,999</strong>
                </label>
              </section>
            )}
            {step === 3 && (
              <section>
                <span className="eyebrow">Step 3 of 4</span>
                <h1>Share your project context</h1>
                <p>
                  A strong brief helps your freelancer start with confidence.
                </p>
                <label className="field">
                  What are you hoping to create?
                  <textarea
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    minLength={20}
                    maxLength={800}
                    placeholder="Describe your goals, audience, scope, and what a successful result looks like..."
                    rows={7}
                  />
                  <span>{brief.length}/800 characters · at least 20 required</span>
                </label>
                <p className="demo-content-note">Add reference links in the order requirements after checkout. File upload is not available in this demo.</p>
                {brief.trim().length < 20 && (
                  <p className="validation-note">
                    Enter at least 20 characters to continue.
                  </p>
                )}
              </section>
            )}
            {step === 4 && (
              <section>
                <span className="eyebrow">Step 4 of 4</span>
                <h1>Confirm mock checkout</h1>
                <div className="notice">
                  <LockKeyhole />
                  <p>
                    <strong>This is a frontend demo.</strong> No real card
                    details are accepted, no charge will occur, and no payout is
                    created.
                  </p>
                </div>
                <label className="payment-choice">
                  <input type="radio" checked readOnly />
                  <WalletCards />
                  <span>
                    <strong>Demo payment method</strong>
                    <small>Simulated order confirmation only</small>
                  </span>
                  <Check />
                </label>
                <label className="check-row consent">
                  <input type="checkbox" checked={demoConsent} onChange={(event) => setDemoConsent(event.target.checked)} />I understand this is a
                  simulated checkout and agree to the demo terms.
                </label>
              </section>
            )}
            <div className="checkout-actions">
              {step > 1 ? (
                <Button variant="secondary" onClick={() => setStep(step - 1)}>
                  <ArrowLeft size={17} /> Back
                </Button>
              ) : (
                <Link
                  className="button button-secondary"
                  to={`/service/${service.id}`}
                >
                  <ArrowLeft size={17} /> Back to service
                </Link>
              )}
              <Button
                disabled={(step === 3 && brief.trim().length < 20) || (step === 4 && (!demoConsent || confirming))}
                onClick={() => (step < 4 ? setStep(step + 1) : confirm())}
              >
                {step === 4 ? confirming ? "Creating demo order…" : "Confirm demo order" : "Continue"}{" "}
                <ArrowRight size={17} />
              </Button>
            </div>
            {orderError && <p className="validation-note" role="alert">{orderError}</p>}
          </div>
          <aside className="order-summary">
            <h3>Order summary</h3>
            <div className="summary-person">
              <img
                src={
                  freelancers.find((item) => item.id === service.freelancerId)
                    ?.avatar
                }
                alt=""
              />
              <span>
                Working with
                <strong>
                  {
                    freelancers.find((item) => item.id === service.freelancerId)
                      ?.name
                  }
                </strong>
              </span>
            </div>
            <div className="summary-lines">
              <div>
                <span>{selected.name} package</span>
                <strong>₹{selected.price.toLocaleString("en-IN")}</strong>
              </div>
              {priority && (
                <div>
                  <span>Priority start</span>
                  <strong>₹1,499</strong>
                </div>
              )}
              <div>
                <span>Illustrative service fee (5%)</span>
                <strong>₹{fee.toLocaleString("en-IN")}</strong>
              </div>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <strong>₹{total.toLocaleString("en-IN")}</strong>
            </div>
            <small>
              <ShieldCheck /> Mock checkout protection
            </small>
          </aside>
        </div>
      </div>
    </PageShell>
  )
}
