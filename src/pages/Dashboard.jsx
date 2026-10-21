import { useEffect, useState } from "react"
import {
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  CircleDollarSign,
  Clock3,
  Copy,
  Edit3,
  Eye,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Send,
  Settings2,
  ShoppingBag,
  Star,
  Trash2,
  TrendingUp,
  UsersRound,
} from "lucide-react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import {
  Button,
  DashboardShell,
  EmptyState,
  MarketplaceImage,
  ServiceCard,
  StatCard,
  StatusBadge,
} from "../components/SharedComponents.jsx"
import { freelancers, portfolios } from "../services/data.js"
import { useStore } from "../context/StoreContext.jsx"
import { useAuth } from "../context/AuthContext.jsx"

export function ClientDashboard() {
  const { orders, conversations, favorites, notifications, getProfile, getService, publishedServices } = useStore()
  const { user } = useAuth()
  const buyerProfile = getProfile(user?.email)
  const unreadMessages = conversations.reduce((sum, item) => sum + item.unread, 0)
  const activeOrders = orders.filter(
    (order) => !["Completed"].includes(order.status),
  ).length
  const pendingDeliveries = orders.filter(
    (order) => order.status === "Delivery submitted",
  ).length
  return (
    <DashboardShell
      title={`Good morning, ${buyerProfile.firstName || user?.name?.split(" ")[0] || "there"}.`}
      subtitle="Here’s what’s moving across your creative projects."
      action={
        <Link className="button button-primary" to="/explore">
          <Plus size={17} /> Start a project
        </Link>
      }
    >
      <div className="stats-grid">
        <StatCard
          label="Active orders"
          value={String(activeOrders)}
          trend="Across your demo projects"
          icon={ShoppingBag}
        />
        <StatCard
          label="Pending deliveries"
          value={String(pendingDeliveries)}
          trend="Ready for your review"
          icon={Clock3}
        />
        <StatCard
          label="Saved services"
          value={String(favorites.length)}
          trend="Services and freelancers"
          icon={Heart}
        />
        <StatCard
          label="Unread messages"
          value={String(unreadMessages)}
          trend={`${notifications.filter((item) => item.unread).length} unread updates`}
          icon={MessageCircle}
        />
      </div>
      <div className="dashboard-grid">
        <section className="panel span-2">
          <div className="panel-head">
            <div>
              <h2>Recent orders</h2>
              <p>Track scope, delivery, and project momentum.</p>
            </div>
            <Link to="/dashboard/orders">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="order-list">
            {orders.length ? orders.slice(0, 4).map((order) => {
              const service = getService(order.serviceId)
              const person = freelancers.find(
                (item) => item.id === order.freelancerId,
              )
              return (
                <Link
                  to={`/dashboard/orders/${order.id}`}
                  className="order-row"
                  key={order.id}
                >
                  <img src={service.image} alt="" />
                  <div className="order-primary">
                    <strong>{service?.subcategory || "Demo service"}</strong>
                    <span>
                      {person?.name || "Demo freelancer"} · {order.packageName}
                    </span>
                  </div>
                  <StatusBadge status={order.status} />
                  <div className="order-date">
                    <small>Due</small>
                    <strong>{order.due}</strong>
                  </div>
                  <ArrowRight />
                </Link>
              )
            }) : (
              <EmptyState
                icon={ShoppingBag}
                title="No orders yet"
                detail="Explore a service to start your first demo project."
                action={<Link className="button button-primary" to="/explore">Explore services</Link>}
              />
            )}
          </div>
        </section>
        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>Conversations</h2>
              <p>Latest project updates</p>
            </div>
          </div>
          <div className="conversation-mini">
            {conversations.length ? conversations.slice(0, 4).map((conversation) => (
              <Link
                to={`/dashboard/messages/${conversation.id}`}
                key={conversation.id}
              >
                <img src={conversation.avatar} alt="" />
                <div>
                  <strong>{conversation.person}</strong>
                  <span>{conversation.messages.at(-1)?.text}</span>
                </div>
                {conversation.unread > 0 && <i>{conversation.unread}</i>}
              </Link>
            )) : (
              <EmptyState
                icon={MessageCircle}
                title="No conversations yet"
                detail="Contact a freelancer to start a simulated demo conversation."
                action={<Link className="button button-secondary" to="/explore">Find a freelancer</Link>}
              />
            )}
          </div>
        </section>
      </div>
      <section className="panel recommendation-panel">
        <div className="panel-head">
          <div>
            <h2>Picked for your next project</h2>
            <p>Based on your recent demo browsing.</p>
          </div>
          <Link to="/explore">Explore more</Link>
        </div>
        <div className="service-grid compact-grid">
          {publishedServices.slice(0, 4).map((service) => (
            <ServiceCard service={service} key={service.id} />
          ))}
        </div>
      </section>
    </DashboardShell>
  )
}

export function OrdersPage({ seller = false }) {
  const { orders, getService, getSellerProfile } = useStore()
  const { user } = useAuth()
  const sellerProfile = seller ? getSellerProfile(user?.email) : null
  const visibleOrders = seller
    ? orders.filter((order) => order.freelancerId === sellerProfile.freelancerId)
    : orders
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")
  const filtered = visibleOrders.filter(
    (order) =>
      (status === "all" || order.status === status) &&
      `${order.id} ${getService(order.serviceId)?.title || ""}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  )
  return (
    <DashboardShell
      seller={seller}
      title={seller ? "Orders" : "My orders"}
      subtitle={
        seller
          ? "Review new requests and keep every delivery on track."
          : "Everything you’ve commissioned, in one place."
      }
    >
      <div className="dashboard-filters">
        <div className="dashboard-search">
          <Search />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search orders"
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          {[
            "Requirements pending",
            "In progress",
            "Delivery submitted",
            "Revision requested",
            "Completed",
          ].map(
            (item) => (
              <option key={item}>{item}</option>
            ),
          )}
        </select>
        {(query || status !== "all") && (
          <Button
            variant="secondary"
            onClick={() => {
              setQuery("")
              setStatus("all")
            }}
          >
            Clear filters
          </Button>
        )}
      </div>
      <section className="panel">
        {filtered.length ? (
          <div className="order-list detailed">
            {filtered.map((order) => {
              const service = getService(order.serviceId)
              const person = freelancers.find(
                (item) => item.id === order.freelancerId,
              )
              if (!service) return null
              const path = seller
                ? `/seller/orders/${order.id}`
                : `/dashboard/orders/${order.id}`
              return (
                <Link to={path} className="order-row" key={order.id}>
                  <img src={service.image} alt="" />
                  <div className="order-primary">
                    <small>#{order.id}</small>
                    <strong>{service.title}</strong>
                    <span>
                      {seller
                        ? "Client: Riya Sharma"
                        : `Freelancer: ${person.name}`}{" "}
                      · {order.packageName}
                    </span>
                  </div>
                  <StatusBadge status={order.status} />
                  <div className="order-date">
                    <small>{seller ? "Value" : "Total"}</small>
                    <strong>₹{order.total.toLocaleString("en-IN")}</strong>
                  </div>
                  <div className="order-date">
                    <small>Due</small>
                    <strong>{order.due}</strong>
                  </div>
                  <ArrowRight />
                </Link>
              )
            })}
          </div>
        ) : (
          <EmptyState
            title="No matching orders"
            detail="Try another search or status filter."
          />
        )}
      </section>
    </DashboardShell>
  )
}

export function OrderDetailPage({ seller = false }) {
  const { orderId } = useParams()
  const { orders, transitionOrder, getService, getSellerProfile } = useStore()
  const { user } = useAuth()
  const order = orders.find((item) => item.id === orderId)
  const service = getService(order?.serviceId)
  const person = freelancers.find((item) => item.id === order?.freelancerId)
  const sellerProfile = seller ? getSellerProfile(user?.email) : null
  const [status, setStatus] = useState(order?.status || "")
  const [revisionOpen, setRevisionOpen] = useState(false)
  const [actionError, setActionError] = useState("")
  const [delivery, setDelivery] = useState({ title: "", description: "" })
  useEffect(() => setStatus(order?.status || ""), [order?.status])
  if (!order || !service || !person || (seller && order.freelancerId !== sellerProfile.freelancerId)) {
    return (
      <DashboardShell seller={seller} title="Order not found">
        <EmptyState
          icon={ShoppingBag}
          title="This order is unavailable"
          detail="Choose an order from your list."
          action={<Link className="button button-primary" to={seller ? "/seller/orders" : "/dashboard/orders"}>View orders</Link>}
        />
      </DashboardShell>
    )
  }
  const submitDemoDelivery = () => {
    if (delivery.title.trim().length < 3 || delivery.description.trim().length < 20) {
      setActionError("Add a delivery title and a description of at least 20 characters.")
      return
    }
    const result = transitionOrder(order.id, "Delivery submitted", {
      title: delivery.title.trim(),
      description: delivery.description.trim(),
      fileName: "simulated-demo-delivery.pdf",
    })
    setActionError(result.ok ? "" : result.error)
    if (result.ok) {
      setStatus("Delivery submitted")
      setDelivery({ title: "", description: "" })
    }
  }
  return (
    <DashboardShell
      seller={seller}
      title={`Order #${order.id}`}
      subtitle={service.title}
      action={<StatusBadge status={status} />}
    >
      {actionError && <p className="validation-note" role="alert">{actionError}</p>}
      <div className="order-detail-layout">
        <div>
          <section className="panel order-overview">
            <img src={service.image} alt="" />
            <div>
              <span className="eyebrow">{order.packageName} package</span>
              <h2>{service.subcategory}</h2>
              <p>Working with {seller ? "Riya Sharma" : person.name}</p>
              <div>
                <span>
                  Order value{" "}
                  <strong>₹{order.total.toLocaleString("en-IN")}</strong>
                </span>
                <span>
                  Due date <strong>{order.due}</strong>
                </span>
              </div>
            </div>
          </section>
          <section className="panel">
            <div className="panel-head">
              <div>
                <h2>Project progress</h2>
                <p>A shared view of where the work stands.</p>
              </div>
            </div>
            <div className="timeline">
              {[
                ["Order confirmed", "Brief and package approved", true],
                [
                  "Work in progress",
                  "First direction is being developed",
                  true,
                ],
                [
                  "Delivery review",
                  "Files ready for client feedback",
                  status === "Delivery submitted" || status === "Completed",
                ],
                [
                  "Complete",
                  "Final approval and review",
                  status === "Completed",
                ],
              ].map(([title, detail, done], index) => (
                <div className={done ? "done" : ""} key={String(title)}>
                  <span>{done ? <Check /> : index + 1}</span>
                  <div>
                    <strong>{String(title)}</strong>
                    <small>{String(detail)}</small>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="panel">
            <div className="panel-head">
              <div>
                <h2>Requirements</h2>
                <p>Submitted at checkout</p>
              </div>
            </div>
            <div className="requirements">
              <strong>Project goal</strong>
              <p>{order.requirements?.goal || "Buyer requirements have not been submitted yet."}</p>
              <strong>Audience</strong>
              <p>{order.requirements?.audience || "Not specified"}</p>
              {order.revisionFeedback && <>
                <strong>Revision feedback</strong>
                <p>{order.revisionFeedback}</p>
              </>}
            </div>
          </section>
          <section className="panel">
            <div className="panel-head">
              <div>
                <h2>Delivery files</h2>
                <p>Simulated file references for this demo.</p>
              </div>
            </div>
            <div className="file-row">
              <span>ZIP</span>
              <div>
                <strong>{order.delivery?.fileName || "No demo delivery submitted yet"}</strong>
                <small>{order.delivery ? `${order.delivery.title} · Version ${order.delivery.version}` : "A seller may submit a simulated delivery when work is in progress."}</small>
              </div>
              <Button variant="secondary" disabled={!order.delivery} onClick={() => window.alert(`${order.delivery?.description || "No delivery preview is available."} Demo only; no file was uploaded.`)}>Preview</Button>
            </div>
          </section>
        </div>
        <aside>
          <section className="panel order-actions">
            <h3>{seller ? "Manage delivery" : "Review delivery"}</h3>
            {seller ? (
              <>
                {["In progress", "Revision requested"].includes(order.status) ? <div className="inline-form">
                  <label>Delivery title<input maxLength={100} value={delivery.title} onChange={(event) => setDelivery((current) => ({ ...current, title: event.target.value }))} placeholder="e.g. Brand identity concept" /></label>
                  <label>Delivery notes<textarea rows={4} maxLength={1000} value={delivery.description} onChange={(event) => setDelivery((current) => ({ ...current, description: event.target.value }))} placeholder="Describe the illustrative deliverables included in this demo." /></label>
                  <small>Submitting stores a text-only demo preview. No file is uploaded or delivered.</small>
                  <Button className="full" onClick={submitDemoDelivery}>Submit demo delivery</Button>
                </div> : <Button className="full" disabled>Submit demo delivery</Button>}
                <Link
                  className="button button-secondary full"
                  to={`/seller/messages?person=${person.id}`}
                >
                  Message client
                </Link>
              </>
            ) : (
              <>
                <Button className="full" onClick={() => setStatus("Completed")}>
                  Approve delivery
                </Button>
                <Button
                  variant="secondary"
                  className="full"
                  onClick={() => setRevisionOpen(!revisionOpen)}
                >
                  Request revision
                </Button>
                <Link
                  className="button button-secondary full"
                  to="/dashboard/messages"
                >
                  Message freelancer
                </Link>
              </>
            )}
            {revisionOpen && (
              <div className="inline-form">
                <label>
                  What needs to change?
                  <textarea
                    rows={4}
                    placeholder="Keep feedback specific and consolidated..."
                  />
                </label>
                <Button
                  onClick={() => {
                    setStatus("Revision requested")
                    setRevisionOpen(false)
                  }}
                >
                  Send request
                </Button>
              </div>
            )}
          </section>
          <section className="panel">
            <h3>Package includes</h3>
            {service.packages
              .find((item) => item.name === order.packageName)
              ?.includes.map((item) => (
                <p className="included" key={item}>
                  <Check />
                  {item}
                </p>
              ))}
          </section>
        </aside>
      </div>
    </DashboardShell>
  )
}

export function FavoritesPage() {
  const { favorites, toggleFavorite, publishedServices } = useStore()
  const favoriteServices = publishedServices.filter((item) =>
    favorites.includes(item.id),
  )
  const favoriteFreelancers = freelancers.filter((item) =>
    favorites.includes(item.id),
  )
  return (
    <DashboardShell
      title="Favorites"
      subtitle="Keep standout services and talent close."
    >
      {favoriteServices.length || favoriteFreelancers.length ? (
        <>
          {favoriteServices.length > 0 && (
            <div className="service-grid">
              {favoriteServices.map((service) => (
                <ServiceCard service={service} key={service.id} />
              ))}
            </div>
          )}
          {favoriteFreelancers.length > 0 && (
            <div className="profile-list favorites-talent">
              {favoriteFreelancers.map((person) => (
                <div className="favorite-talent-card" key={person.id}>
                  <Link to={`/freelancer/${person.id}`}>
                    <MarketplaceImage src={person.avatar} alt={person.name} />
                    <div>
                      <h3>{person.name}</h3>
                      <p>{person.role}</p>
                      <span>Illustrative demo profile</span>
                    </div>
                  </Link>
                  <button
                    className="button button-secondary"
                    onClick={() => toggleFavorite(person.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={Heart}
          title="Your shortlist is waiting"
          detail="Save services you’d like to compare or revisit."
          action={
            <Link className="button button-primary" to="/explore">
              Explore services
            </Link>
          }
        />
      )}
    </DashboardShell>
  )
}

export function MessagesPage({ seller = false }) {
  const { conversationId } = useParams()
  const [params] = useSearchParams()
  const { conversations, sendMessage, startConversation } = useStore()
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState(
    conversationId || conversations[0]?.id || "",
  )
  const [text, setText] = useState("")
  const [search, setSearch] = useState("")
  const personParam = params.get("person")
  const paramPerson = freelancers.find((item) => item.id === personParam)
  const personConversation = conversations.find(
    (item) =>
      item.personId === personParam ||
      (paramPerson && item.person === paramPerson.name),
  )
  const resolvedActiveId =
    conversationId || (personParam ? personConversation?.id : activeId)
  const active = conversations.find((item) => item.id === resolvedActiveId)
  const visibleConversations = conversations.filter((item) =>
    `${item.person} ${item.messages.at(-1)?.text || ""}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  )
  useEffect(() => {
    if (conversationId && conversations.some((item) => item.id === conversationId)) {
      setActiveId(conversationId)
    }
  }, [conversationId, conversations])
  const startRequestedConversation = () => {
    if (!paramPerson) return
    const conversation = startConversation(paramPerson.id)
    if (conversation) navigate(`/dashboard/messages/${conversation.id}`)
  }
  const submit = (event) => {
    event.preventDefault()
    if (!text.trim() || !active) return
    sendMessage(resolvedActiveId, text.trim())
    setText("")
  }
  return (
    <DashboardShell
      seller={seller}
      title="Messages"
      subtitle="Project conversations, organized and in context."
    >
      {personParam && !paramPerson ? (
        <EmptyState
          title="This freelancer is not in the demo directory"
          detail="Choose a freelancer from the marketplace to start a conversation."
          action={
            <Link className="button button-primary" to="/explore">
              Explore services
            </Link>
          }
        />
      ) : conversationId && !active ? (
        <EmptyState
          title="Conversation not found"
          detail="This conversation is not available in the current demo session."
          action={
            <Link className="button button-primary" to={seller ? "/seller/messages" : "/dashboard/messages"}>
              View conversations
            </Link>
          }
        />
      ) : personParam && paramPerson && !active ? (
        <EmptyState
          title={`Start a conversation with ${paramPerson.name}`}
          detail="This demo conversation has not been started yet."
          action={
            <Button onClick={startRequestedConversation}>
              Start demo conversation
            </Button>
          }
        />
      ) : !active ? (
        <EmptyState
          title="No conversations yet"
          detail="Contact a freelancer from a service or profile to start a demo conversation."
          action={
            <Link className="button button-primary" to="/explore">
              Explore services
            </Link>
          }
        />
      ) : (
      <div className="messages-app">
        <aside className={conversationId || (personParam && active) ? "mobile-hidden" : ""}>
          <div className="conversation-search">
            <Search />
            <input
              aria-label="Search conversations"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search conversations"
            />
          </div>
          {visibleConversations.map((conversation) => (
            <button
              className={resolvedActiveId === conversation.id ? "active" : ""}
              onClick={() => {
                setActiveId(conversation.id)
                navigate(
                  seller
                    ? `/seller/messages/${conversation.id}`
                    : `/dashboard/messages/${conversation.id}`,
                )
              }}
              key={conversation.id}
            >
              <img src={conversation.avatar} alt="" />
              <div>
                <strong>{conversation.person}</strong>
                <span>{conversation.messages.at(-1)?.text || "New demo conversation"}</span>
              </div>
              <small>{conversation.messages.at(-1)?.time || "New"}</small>
              {conversation.unread > 0 && <i>{conversation.unread}</i>}
            </button>
          ))}
          {!visibleConversations.length && (
            <EmptyState title="No matching conversations" detail="Try another name or message keyword." />
          )}
        </aside>
        <section className="message-thread">
          <header>
            <img src={paramPerson?.avatar || active.avatar} alt="" />
            <div>
              <strong>{paramPerson?.name || active.person}</strong>
              <span>
                {active.orderId
                  ? `Demo order #${active.orderId}`
                  : "New inquiry · demo conversation"}
              </span>
            </div>
            <button>
              <MoreHorizontal />
            </button>
          </header>
          <div className="messages">
            {active.messages.map((message) => (
              <div className={`message ${message.from}`} key={message.id}>
                <p>{message.text}</p>
                <span>{message.time}</span>
              </div>
            ))}
          </div>
          <div className="simulated-note">
            Messages are simulated and stay in this active frontend session.
          </div>
          <form className="message-composer" onSubmit={submit}>
            <button type="button" aria-label="Attach a demo file">
              <Paperclip />
            </button>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a message…"
              aria-label="Message"
            />
            <button type="submit" aria-label="Send message">
              <Send />
            </button>
          </form>
        </section>
      </div>
      )}
    </DashboardShell>
  )
}

export function NotificationsPage() {
  const { notifications, markAllRead, markNotificationRead } = useStore()
  return (
    <DashboardShell
      title="Notifications"
      subtitle="The updates that need your attention."
      action={
        <Button variant="secondary" onClick={markAllRead}>
          Mark all as read
        </Button>
      }
    >
      <section className="panel notifications-list">
        {notifications.length ? notifications.map((item) => (
          <article className={item.unread ? "unread" : ""} key={item.id}>
            <span><Bell /></span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
              <small>{item.createdAt || "Demo update"}</small>
              {item.href && <Link to={item.href} onClick={() => markNotificationRead(item.id)}>Open related demo screen <ArrowRight size={14} /></Link>}
            </div>
            {item.unread && <Button variant="ghost" onClick={() => markNotificationRead(item.id)}>Mark read</Button>}
          </article>
        )) : <EmptyState icon={Bell} title="No notifications yet" detail="Demo order and message updates will appear here." />}
      </section>
    </DashboardShell>
  )
}

export function SettingsPage({ seller = false }) {
  const [saved, setSaved] = useState(false)
  const { user, signIn } = useAuth()
  const { getSellerProfile, saveSellerProfile } = useStore()
  const sellerProfile = seller ? getSellerProfile(user?.email) : null
  const [sellerForm, setSellerForm] = useState(sellerProfile)
  const [error, setError] = useState("")
  const saveSeller = (event) => {
    event.preventDefault()
    if (sellerForm.name.trim().length < 2 || sellerForm.headline.trim().length < 8 || sellerForm.bio.trim().length < 20) {
      setError("Enter a name, a headline of at least 8 characters, and a bio of at least 20 characters.")
      setSaved(false)
      return
    }
    const result = saveSellerProfile(user?.email, { ...sellerForm, name: sellerForm.name.trim(), headline: sellerForm.headline.trim(), bio: sellerForm.bio.trim() })
    setError(result ? "" : "Unable to save seller settings in this demo.")
    setSaved(result)
    if (result && user) signIn({ ...user, name: sellerForm.name.trim() })
  }
  if (seller) {
    return (
      <DashboardShell seller title="Seller settings" subtitle="Profile, visibility, and availability preferences stored in this browser demo.">
        <form className="panel settings-form workflow-form" onSubmit={saveSeller}>
          <h2>Professional profile</h2>
          <div className="two-fields">
            <label className="field">Display name<input required value={sellerForm.name} onChange={(event) => { setSaved(false); setSellerForm((current) => ({ ...current, name: event.target.value })) }} /></label>
            <label className="field">City<input value={sellerForm.city} onChange={(event) => { setSaved(false); setSellerForm((current) => ({ ...current, city: event.target.value })) }} /></label>
          </div>
          <label className="field">Professional headline<input required value={sellerForm.headline} onChange={(event) => { setSaved(false); setSellerForm((current) => ({ ...current, headline: event.target.value })) }} /></label>
          <label className="field">Bio<textarea required rows={5} value={sellerForm.bio} onChange={(event) => { setSaved(false); setSellerForm((current) => ({ ...current, bio: event.target.value })) }} /></label>
          <label className="field">Skills<input value={(sellerForm.skills || []).join(", ")} onChange={(event) => { setSaved(false); setSellerForm((current) => ({ ...current, skills: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })) }} /></label>
          <label className="check-row consent"><input type="checkbox" checked={sellerForm.available} onChange={(event) => { setSaved(false); setSellerForm((current) => ({ ...current, available: event.target.checked })) }} />Available for new demo projects</label>
          <small>Availability changes affect only the demo profile. No leads or work assignments are sent.</small>
          {error && <p className="validation-note" role="alert">{error}</p>}
          {saved && <p className="demo-submit-status" role="status">Seller profile and availability saved locally.</p>}
          <Button type="submit">Save seller settings</Button>
          {!sellerProfile.onboardingComplete && <Link to="/seller/onboarding">Continue seller onboarding</Link>}
        </form>
      </DashboardShell>
    )
  }
  return (
    <DashboardShell
      seller={seller}
      title="Settings"
      subtitle="Manage your profile, availability, and preferences."
    >
      <div className="settings-layout">
        <nav>
          <button className="active">
            <UsersRound /> Profile
          </button>
          <button>
            <Bell /> Notifications
          </button>
          <button>
            <Settings2 /> Preferences
          </button>
        </nav>
        <form
          className="panel settings-form"
          onSubmit={(e) => {
            e.preventDefault()
            setSaved(true)
          }}
        >
          <h2>{seller ? "Professional profile" : "Account profile"}</h2>
          <p>Demo changes are not persisted to a secure backend.</p>
          <div className="two-fields">
            <label className="field">
              First name
              <input defaultValue={seller ? "Aarav" : "Riya"} />
            </label>
            <label className="field">
              Last name
              <input defaultValue={seller ? "Mehta" : "Sharma"} />
            </label>
          </div>
          <label className="field">
            Email
            <input
              type="email"
              defaultValue={seller ? "aarav@example.com" : "riya@example.com"}
            />
          </label>
          <label className="field">
            Bio
            <textarea
              rows={5}
              defaultValue={
                seller
                  ? "Brand identity designer for ambitious new ventures."
                  : "Marketing lead building thoughtful consumer brands."
              }
            />
          </label>
          {seller && (
            <label className="check-row consent">
              <input type="checkbox" defaultChecked />
              Available for new projects
            </label>
          )}
          <Button>{saved ? "Changes saved locally" : "Save changes"}</Button>
        </form>
      </div>
    </DashboardShell>
  )
}

export function SellerDashboard() {
  const { orders, getSellerProfile, servicesForSeller, getService } = useStore()
  const { user } = useAuth()
  const profile = getSellerProfile(user?.email)
  const sellerOrders = orders.filter((order) => order.freelancerId === profile.freelancerId)
  const sellerServices = servicesForSeller(user?.email, profile.freelancerId)
  const activeOrders = sellerOrders.filter((order) => order.status !== "Completed")
  const totalDemoEarnings = sellerOrders.reduce((sum, order) => sum + Number(order.total || 0), 0)
  const ratedServices = sellerServices.filter((service) => service.rating > 0)
  const averageRating = ratedServices.length ? (ratedServices.reduce((sum, service) => sum + service.rating, 0) / ratedServices.length).toFixed(1) : "—"
  return (
    <DashboardShell
      seller
      title="Your studio, at a glance."
      subtitle={`Good morning, ${profile.name.split(" ")[0]}. This overview uses local demo data only.`}
      action={
        <Link className="button button-primary" to="/seller/services/new">
          <Plus size={17} /> Create service
        </Link>
      }
    >
      <div className="stats-grid">
        <StatCard
          label="Demo earnings"
          value={`₹${totalDemoEarnings.toLocaleString("en-IN")}`}
          trend="Value of current demo orders"
          icon={CircleDollarSign}
        />
        <StatCard
          label="Active orders"
          value={String(activeOrders.length)}
          trend="Non-completed demo orders"
          icon={ShoppingBag}
        />
        <StatCard
          label="Profile views"
          value={sellerServices.reduce((sum, item) => sum + (item.views || (item.isSeeded ? 420 + item.reviews : 0)), 0).toLocaleString("en-IN")}
          trend="Illustrative service views"
          icon={Eye}
        />
        <StatCard
          label="Average rating"
          value={averageRating}
          trend="From available demo service ratings"
          icon={Star}
        />
      </div>
      <div className="dashboard-grid">
        <section className="panel span-2">
          <div className="panel-head">
            <div>
              <h2>Orders needing attention</h2>
              <p>Prioritized by due date and status.</p>
            </div>
            <Link to="/seller/orders">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="order-list">
            {sellerOrders.map((order) => {
              const service = getService(order.serviceId)
              if (!service) return null
              return (
                <Link
                  to={`/seller/orders/${order.id}`}
                  className="order-row"
                  key={order.id}
                >
                  <img src={service.image} alt="" />
                  <div className="order-primary">
                    <strong>{service.subcategory}</strong>
                    <span>Riya Sharma · {order.packageName}</span>
                  </div>
                  <StatusBadge status={order.status} />
                  <div className="order-date">
                    <small>Due</small>
                    <strong>{order.due}</strong>
                  </div>
                  <ArrowRight />
                </Link>
              )
            })}
            {!sellerOrders.length && <EmptyState icon={ShoppingBag} title="No seller orders yet" detail="New demo orders for your services will appear here." action={<Link className="button button-secondary" to="/seller/services">Manage services</Link>} />}
          </div>
        </section>
        <section className="panel performance-card">
          <div className="panel-head">
            <div>
              <h2>Profile strength</h2>
              <p>Strong profiles win trust.</p>
            </div>
          </div>
          <div className="progress-ring">
            <strong>{profile.onboardingComplete ? "100%" : "72%"}</strong>
            <span>{profile.onboardingComplete ? "Complete" : "Demo profile"}</span>
          </div>
          <div className="progress-tip">
            <Check /> {profile.onboardingComplete ? "Your demo profile onboarding is complete." : "Finish your seller profile onboarding."}
          </div>
          <Link to="/seller/profile">Improve profile</Link>
        </section>
      </div>
      <div className="dashboard-grid">
        <section className="panel span-2">
          <div className="panel-head">
            <div>
              <h2>Service performance</h2>
              <p>Demo views and conversions over 30 days.</p>
            </div>
          </div>
          <div className="performance-chart">
            {[42, 55, 48, 68, 61, 77, 72, 88, 81, 94, 86, 98].map(
              (height, index) => (
                <i key={index} style={{ height: `${height}%` }} />
              ),
            )}
          </div>
          <div className="chart-legend">
            <span>
              <i /> Views
            </span>
            <strong>4,820 total</strong>
          </div>
        </section>
        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>Recent review</h2>
              <p>Illustrative client feedback</p>
            </div>
          </div>
          <div className="big-rating">
            <Star fill="currentColor" /> <strong>5.0</strong>
          </div>
          <blockquote>
            “Clear thinking, excellent communication, and a beautifully
            organized handoff.”
          </blockquote>
          <small>Riya S. · Brand identity</small>
        </section>
      </div>
    </DashboardShell>
  )
}

export function SellerServicesPage() {
  const { user } = useAuth()
  const { getSellerProfile, servicesForSeller, updateSellerServiceStatus, removeSellerService, saveSellerService } = useStore()
  const profile = getSellerProfile(user?.email)
  const items = servicesForSeller(user?.email, profile.freelancerId)
  const [message, setMessage] = useState("")
  const changeStatus = (id, status) => {
    const result = updateSellerServiceStatus(user?.email, id, status)
    setMessage(result.ok ? `Service ${status.toLowerCase()} in this browser demo.` : result.error)
  }
  const duplicate = (service) => {
    const { id, sellerEmail, isSeeded, ...copy } = service
    const result = saveSellerService(user?.email, { ...copy, title: `${service.title} (copy)`, status: "Draft" })
    setMessage(result.ok ? "Draft copy created locally." : result.error)
  }
  return (
    <DashboardShell
      seller
      title="My services"
      subtitle="Create, refine, and publish your offers."
      action={
        <Link className="button button-primary" to="/seller/services/new">
          <Plus size={17} /> New service
        </Link>
      }
    >
      {message && <p className="demo-submit-status" role="status">{message}</p>}
      {items.length ? <section className="panel service-table">
        {items.map((service) => (
          <div className="seller-service-row" key={service.id}>
            <img src={service.image} alt="" />
            <div>
              <strong>{service.title}</strong>
              <span>
                {service.subcategory} · From ₹
                {service.packages[0].price.toLocaleString("en-IN")}
              </span>
            </div>
            <StatusBadge status={service.status} />
            <div className="mini-metric">
              <strong>{420 + service.reviews}</strong>
              <span>Views</span>
            </div>
            <div className="mini-metric">
              <strong>{service.rating}</strong>
              <span>Rating</span>
            </div>
            <div className="row-actions">
              <Link to={`/service/${service.id}`} aria-label="Preview">
                <Eye />
              </Link>
              <Link
                to={`/seller/services/${service.id}/edit`}
                aria-label="Edit"
              >
                <Edit3 />
              </Link>
              <button aria-label={`Duplicate ${service.title}`} onClick={() => duplicate(service)}>
                <Copy />
              </button>
              {service.status === "Published" ? <button aria-label={`Pause ${service.title}`} onClick={() => changeStatus(service.id, "Paused")}><Clock3 /></button> : service.status === "Paused" ? <button aria-label={`Publish ${service.title}`} onClick={() => changeStatus(service.id, "Published")}><Check /></button> : null}
              <button aria-label={`Archive ${service.title}`} onClick={() => changeStatus(service.id, "Archived")}>
                <Trash2 />
              </button>
            </div>
          </div>
        ))}
      </section> : <EmptyState title="No services yet" detail="Create a draft and publish it in demo mode to add it to your studio." action={<Link className="button button-primary" to="/seller/services/new"><Plus size={17} /> Create service</Link>} />}
    </DashboardShell>
  )
}

export function SellerPortfolioPage() {
  const { user } = useAuth()
  const { getSellerProfile, sellerPortfolioFor, addSellerPortfolio, updateSellerPortfolio, removeSellerPortfolio } = useStore()
  const profile = getSellerProfile(user?.email)
  const managed = sellerPortfolioFor(user?.email)
  const sample = portfolios.filter((project) => project.freelancerId === profile.freelancerId)
  const [form, setForm] = useState({ title: "", tools: "", image: "" })
  const [editingId, setEditingId] = useState("")
  const [feedback, setFeedback] = useState("")
  const submit = (event) => {
    event.preventDefault()
    if (form.title.trim().length < 3) {
      setFeedback("Project title must contain at least three characters.")
      return
    }
    const project = { title: form.title.trim(), tools: form.tools.split(",").map((tool) => tool.trim()).filter(Boolean), image: form.image.trim() || sample[0]?.image }
    const saved = editingId
      ? updateSellerPortfolio(user.email, editingId, project)
      : addSellerPortfolio(user.email, project)
    if (!saved) {
      setFeedback("Unable to update this portfolio item from the current seller account.")
      return
    }
    setForm({ title: "", tools: "", image: "" })
    setEditingId("")
    setFeedback(`${editingId ? "Portfolio project updated" : "Portfolio project added"} locally. It is illustrative demo content.`)
  }
  return (
    <DashboardShell
      seller
      title="Portfolio"
      subtitle="Show clients the thinking and craft behind your work."
      subtitle="Manage illustrative projects stored in this browser demo."
    >
      <form className="panel workflow-form" onSubmit={submit}>
        <h2>Add a demo project</h2>
        <label className="field">Project title<input required minLength={3} value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} /></label>
        <label className="field">Tools or skills<input value={form.tools} onChange={(event) => setForm((current) => ({ ...current, tools: event.target.value }))} placeholder="Separate with commas" /></label>
        <label className="field">Image URL (optional)<input type="url" value={form.image} onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))} /></label>
        {feedback && <p className={feedback.startsWith("Project title") ? "validation-note" : "demo-submit-status"} role="status">{feedback}</p>}
        <Button type="submit">{editingId ? "Save project changes" : "Add project locally"}</Button>
        {editingId && <Button type="button" variant="secondary" onClick={() => { setEditingId(""); setForm({ title: "", tools: "", image: "" }) }}>Cancel edit</Button>}
      </form>
      <div className="portfolio-manager">
        {[...managed, ...sample].map((project) => (
          <div key={project.id}>
            <img src={project.image} alt={project.title} />
            <div>
              <strong>{project.title}</strong>
              <span>{project.tools.join(" · ")}</span>
            </div>
            {project.sellerEmail === user?.email && <div className="row-actions">
              <button aria-label={`Edit ${project.title}`} onClick={() => { setEditingId(project.id); setForm({ title: project.title, tools: (project.tools || []).join(", "), image: project.image || "" }); setFeedback("") }}><Edit3 /></button>
              <button aria-label={`Remove ${project.title}`} onClick={() => { removeSellerPortfolio(user.email, project.id); if (editingId === project.id) { setEditingId(""); setForm({ title: "", tools: "", image: "" }) } }}><Trash2 /></button>
            </div>}
          </div>
        ))}
      </div>
    </DashboardShell>
  )
}

export function AnalyticsPage() {
  const { user } = useAuth()
  const { orders, getSellerProfile, servicesForSeller } = useStore()
  const profile = getSellerProfile(user?.email)
  const items = servicesForSeller(user?.email, profile.freelancerId).filter((item) => item.status !== "Archived")
  const sellerOrders = orders.filter((order) => order.freelancerId === profile.freelancerId)
  const impressions = items.reduce((sum, item) => sum + (item.views || (item.isSeeded ? 420 + item.reviews : 0)), 0)
  const completed = sellerOrders.filter((order) => order.status === "Completed").length
  const ratingItems = items.filter((item) => item.rating > 0)
  const rating = ratingItems.length ? (ratingItems.reduce((sum, item) => sum + item.rating, 0) / ratingItems.length).toFixed(1) : "—"
  return (
    <DashboardShell
      seller
      title="Analytics"
      subtitle="Understand how clients discover and choose your services."
    >
      <div className="stats-grid">
        <StatCard label="Demo impressions" value={impressions.toLocaleString("en-IN")} trend="Calculated from demo services" icon={Eye} />
        <StatCard
          label="Profile visits"
          value={String(items.filter((item) => item.status === "Published").length)}
          trend="Published demo services"
          icon={UsersRound}
        />
        <StatCard
          label="Orders"
          value={String(sellerOrders.length)}
          trend={`${completed} completed demo orders`}
          icon={ShoppingBag}
        />
        <StatCard
          label="Conversion"
          value={rating}
          trend="Average across demo services"
          icon={TrendingUp}
        />
      </div>
      <section className="panel analytics-panel">
        <div className="panel-head">
          <div>
            <h2>Discovery over time</h2>
            <p>Illustrative chart. Counters above use local demo records.</p>
          </div>
          <select>
            <option>Last 30 days</option>
          </select>
        </div>
        <div className="performance-chart tall">
          {[
            25, 34, 31, 42, 48, 44, 55, 63, 58, 72, 68, 78, 84, 80, 92, 88, 96,
            91,
          ].map((height, index) => (
            <i key={index} style={{ height: `${height}%` }} />
          ))}
        </div>
      </section>
    </DashboardShell>
  )
}

export function EarningsPage() {
  const { user } = useAuth()
  const { orders, getSellerProfile, getPayoutSettings, savePayoutSettings } = useStore()
  const profile = getSellerProfile(user?.email)
  const sellerOrders = orders.filter((order) => order.freelancerId === profile.freelancerId)
  const completed = sellerOrders.filter((order) => order.status === "Completed")
  const pending = sellerOrders.filter((order) => order.status !== "Completed")
  const amount = (items) => items.reduce((sum, order) => sum + Number(order.total || 0), 0)
  const [payout, setPayout] = useState(() => getPayoutSettings(user?.email))
  const [feedback, setFeedback] = useState("")
  return (
    <DashboardShell
      seller
      title="Earnings"
      subtitle="A frontend representation only—no real payouts have occurred."
    >
      <div className="stats-grid">
        <StatCard
          label="Available balance"
          value={`₹${amount(completed).toLocaleString("en-IN")}`}
          trend="Completed demo orders only"
          icon={CircleDollarSign}
        />
        <StatCard
          label="Pending clearance"
          value={`₹${amount(pending).toLocaleString("en-IN")}`}
          trend={`Across ${pending.length} non-completed demo orders`}
          icon={Clock3}
        />
        <StatCard
          label="Earned this month"
          value={`₹${amount(sellerOrders).toLocaleString("en-IN")}`}
          trend="All seller demo orders"
          icon={TrendingUp}
        />
        <StatCard
          label="Lifetime demo earnings"
          value={`₹${amount(completed).toLocaleString("en-IN")}`}
          trend="Completed total in current demo data"
          icon={BarChart3}
        />
      </div>
      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Transaction history</h2>
            <p>Order totals are sample records, not actual earnings.</p>
          </div>
          <Button disabled>Withdraw funds</Button>
        </div>
        <div className="transactions">
          {sellerOrders.length ? sellerOrders.map((order) => (
            <div key={order.id}>
              <span>{order.id}</span>
              <strong>{order.packageName} · {order.status}</strong>
              <em>₹{Number(order.total).toLocaleString("en-IN")}</em>
              <StatusBadge status={order.status} />
            </div>
          )) : <EmptyState title="No demo ledger entries" detail="Seller order totals will appear here when a matching demo order exists." />}
        </div>
      </section>
      <form className="panel workflow-form" onSubmit={(event) => { event.preventDefault(); const saved = savePayoutSettings(user?.email, payout); setFeedback(saved ? "Demo payout preferences saved locally. No money can be transferred." : "Unable to save demo payout settings.") }}>
        <h2>Demo payout settings</h2>
        <p>Do not enter real bank or payment details. These preferences are not connected to a payout service.</p>
        <label className="field">Method<select value={payout.method} onChange={(event) => setPayout((current) => ({ ...current, method: event.target.value }))}><option>Demo bank transfer</option><option>Demo UPI</option></select></label>
        <label className="field">Placeholder account label<input maxLength={80} value={payout.accountLabel} onChange={(event) => setPayout((current) => ({ ...current, accountLabel: event.target.value }))} /></label>
        {feedback && <p className="demo-submit-status" role="status">{feedback}</p>}
        <Button type="submit">Save demo preferences</Button>
      </form>
    </DashboardShell>
  )
}

export function SellerReviewsPage() {
  const { user } = useAuth()
  const { reviews, getSellerProfile } = useStore()
  const profile = getSellerProfile(user?.email)
  const items = reviews.filter((review) => review.freelancerId === profile.freelancerId)
  const average = items.length
    ? (items.reduce((sum, review) => sum + Number(review.rating || 0), 0) / items.length).toFixed(1)
    : "—"
  return (
    <DashboardShell seller title="Reviews" subtitle="Feedback submitted on completed demo orders. No review is fabricated by this screen.">
      <section className="panel">
        {items.length ? <>
          <div className="big-rating"><Star fill="currentColor" /><strong>{average}</strong><span>{items.length} demo review{items.length === 1 ? "" : "s"}</span></div>
          <div className="notifications-list">
            {items.map((review) => <article key={review.id}>
              <span><Star /></span>
              <div><strong>{review.rating} / 5 · Demo buyer review</strong><p>{review.text}</p><small>{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Demo review"}</small></div>
            </article>)}
          </div>
        </> : <EmptyState icon={Star} title="No reviews yet" detail="A buyer can submit a demo review after completing an order for your seller profile." />}
      </section>
    </DashboardShell>
  )
}

export function SellerProfilePage() {
  const { user } = useAuth()
  const { getSellerProfile, sellerPortfolioFor, servicesForSeller } = useStore()
  const profile = getSellerProfile(user?.email)
  const projects = sellerPortfolioFor(user?.email)
  const items = servicesForSeller(user?.email, profile.freelancerId).filter((item) => item.status === "Published")
  return (
    <DashboardShell seller title="Public profile preview" subtitle="A preview of your local demo seller profile. It is not publicly hosted.">
      <section className="panel profile-preview-card">
        <span className="eyebrow">Demo freelancer profile · {profile.available ? "Available" : "Unavailable"}</span>
        <h2>{profile.name}</h2>
        <p>{profile.headline}</p>
        <p>{profile.bio}</p>
        <p>{(profile.skills || []).join(" · ")}</p>
        <Link className="button button-secondary" to="/seller/settings">Edit profile and availability</Link>
      </section>
      <section className="panel">
        <h2>Published demo services</h2>
        {items.length ? items.map((item) => <p key={item.id}><Link to={`/service/${item.id}`}>{item.title}</Link> · {item.status}</p>) : <EmptyState title="No published services" detail="Publish a service to show it in this preview." action={<Link className="button button-primary" to="/seller/services/new">Create service</Link>} />}
      </section>
      <section className="panel">
        <h2>Portfolio samples</h2>
        {projects.length ? projects.map((project) => <p key={project.id}>{project.title} · {(project.tools || []).join(" · ")}</p>) : <EmptyState title="No portfolio projects" detail="Add illustrative work from your portfolio manager." action={<Link className="button button-secondary" to="/seller/portfolio">Manage portfolio</Link>} />}
      </section>
    </DashboardShell>
  )
}

export function GenericDashboardPage({ seller = false, title }) {
  return (
    <DashboardShell
      seller={seller}
      title={title}
      subtitle="Demo placeholder — this section is coming soon."
    >
      <EmptyState
        icon={Settings2}
        title={`${title} coming soon`}
        detail={`${title} is not implemented in this demo yet. Its screen is reserved for a future release.`}
        action={
          <Link
            className="button button-primary"
            to={seller ? "/seller/dashboard" : "/dashboard"}
          >
            Back to overview
          </Link>
        }
      />
    </DashboardShell>
  )
}

export default ClientDashboard
