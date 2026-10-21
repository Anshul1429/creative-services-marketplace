import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import { freelancers, initialConversations, initialOrders, services } from "../services/data.js"

const StoreContext = createContext(null)
const STORAGE_KEYS = {
  favorites: "flg-favorites",
  conversations: "flg-demo-conversations",
  orders: "flg-demo-orders",
  notifications: "flg-demo-notifications",
  briefs: "flg-demo-briefs",
  profiles: "flg-demo-profiles",
  paymentMethods: "flg-demo-payment-methods",
  reviews: "flg-demo-reviews",
  supportRequests: "flg-demo-support-requests",
  sellerProfiles: "flg-demo-seller-profiles",
  sellerServices: "flg-demo-seller-services",
  sellerPortfolios: "flg-demo-seller-portfolios",
  payoutSettings: "flg-demo-payout-settings",
}

const notificationDefaults = [
  {
    id: "n1",
    title: "New concept ready",
    detail: "Aarav shared a progress update for FLG-2048.",
    unread: true,
    href: "/dashboard/orders/FLG-2048",
    createdAt: "Today",
  },
  {
    id: "n2",
    title: "Delivery received",
    detail: "Your product design delivery is ready to review.",
    unread: true,
    href: "/dashboard/orders/FLG-1982",
    createdAt: "Today",
  },
  {
    id: "n3",
    title: "Review reminder",
    detail: "Tell Nisha how the collaboration went.",
    unread: false,
    href: "/dashboard/orders/FLG-1764",
    createdAt: "Yesterday",
  },
]

function readStored(key, fallback, isValid) {
  try {
    const stored = localStorage.getItem(key)
    if (!stored) return fallback
    const parsed = JSON.parse(stored)
    if (isValid(parsed)) return parsed
    console.error(`Stored demo data for "${key}" is invalid.`)
  } catch (error) {
    console.error(`Unable to restore demo data for "${key}".`, error)
  }
  return fallback
}

const isArray = (value) => Array.isArray(value)
const isValidOrders = (items) =>
  isArray(items) &&
  items.every(
    (item) =>
      item &&
      typeof item.id === "string" &&
      typeof item.serviceId === "string" &&
      typeof item.freelancerId === "string" &&
      typeof item.status === "string",
  )
const isValidFavorites = (items) =>
  isArray(items) && items.every((item) => typeof item === "string")
const hasIdentity = (value) =>
  value &&
  typeof value.id === "string" &&
  typeof value.person === "string"

function persist(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Unable to save demo data for "${key}".`, error)
  }
}

function normalizeOrder(order) {
  const legacyStatuses = {
    "New request": "Requirements pending",
    Delivered: "Delivery submitted",
  }
  const status = legacyStatuses[order.status] || order.status
  return {
    ...order,
    requirements: { goal: "", audience: "", references: "", ...order.requirements },
    requirementsSubmitted:
      order.requirementsSubmitted ?? status !== "Requirements pending",
    delivery:
      status === "Delivery submitted" || status === "Completed"
        ? order.delivery || {
            title: "Demo project delivery",
            description: "Illustrative delivery preview for this sample order.",
            fileName: "demo-project-preview.pdf",
            version: 1,
          }
        : order.delivery || null,
    revisionFeedback: order.revisionFeedback || "",
    status,
  }
}

const orderTransitions = {
  "Requirements pending": ["In progress"],
  "In progress": ["Delivery submitted"],
  "Delivery submitted": ["Revision requested", "Completed"],
  "Revision requested": ["Delivery submitted"],
  Completed: [],
}

export function StoreProvider({ children }) {
  const [favorites, setFavorites] = useState(() =>
    readStored(STORAGE_KEYS.favorites, [], isValidFavorites),
  )
  const [orders, setOrders] = useState(() =>
    readStored(STORAGE_KEYS.orders, initialOrders, isValidOrders).map(normalizeOrder),
  )
  const orderKeys = useRef(new Map(orders.filter((order) => order.checkoutKey).map((order) => [order.checkoutKey, order])))
  const orderIds = useRef(new Set(orders.map((order) => order.id)))
  const orderStates = useRef(new Map(orders.map((order) => [order.id, order.status])))
  const [conversations, setConversations] = useState(() =>
    readStored(
      STORAGE_KEYS.conversations,
      initialConversations,
      (items) =>
        isArray(items) &&
        items.every(
          (item) =>
            hasIdentity(item) &&
            typeof item.personId === "string" &&
            isArray(item.messages),
        ),
    ),
  )
  const [notifications, setNotifications] = useState(() =>
    readStored(
      STORAGE_KEYS.notifications,
      notificationDefaults,
      (items) =>
        isArray(items) &&
        items.every(
          (item) =>
            item &&
            typeof item.id === "string" &&
            typeof item.unread === "boolean",
        ),
    ),
  )
  const [briefs, setBriefs] = useState(() =>
    readStored(
      STORAGE_KEYS.briefs,
      [],
      (items) =>
        isArray(items) &&
        items.every(
          (item) =>
            item &&
            typeof item.id === "string" &&
            typeof item.title === "string",
        ),
    ),
  )
  const [profiles, setProfiles] = useState(() =>
    readStored(STORAGE_KEYS.profiles, {}, (value) => value && typeof value === "object" && !isArray(value)),
  )
  const [paymentMethods, setPaymentMethods] = useState(() =>
    readStored(STORAGE_KEYS.paymentMethods, [
      { id: "demo-card-4242", label: "Demo Visa ending in 4242", type: "Card", isDefault: true },
    ], (items) => isArray(items) && items.every((item) => item && typeof item.id === "string" && typeof item.label === "string")),
  )
  const [reviews, setReviews] = useState(() =>
    readStored(
      STORAGE_KEYS.reviews,
      [],
      (items) =>
        isArray(items) &&
        items.every(
          (item) =>
            item &&
            typeof item.id === "string" &&
            typeof item.orderId === "string",
        ),
    ),
  )
  const [supportRequests, setSupportRequests] = useState(() =>
    readStored(
      STORAGE_KEYS.supportRequests,
      [],
      (items) =>
        isArray(items) &&
        items.every(
          (item) =>
            item &&
            typeof item.id === "string" &&
            typeof item.name === "string" &&
            typeof item.message === "string",
        ),
    ),
  )
  const [sellerProfiles, setSellerProfiles] = useState(() =>
    readStored(STORAGE_KEYS.sellerProfiles, {}, (value) => value && typeof value === "object" && !isArray(value)),
  )
  const [sellerServices, setSellerServices] = useState(() =>
    readStored(
      STORAGE_KEYS.sellerServices,
      [],
      (items) => isArray(items) && items.every((item) => item && typeof item.id === "string" && typeof item.sellerEmail === "string"),
    ).map((item) => ({
      ...item,
      freelancerId: item.freelancerId || sellerProfiles[item.sellerEmail]?.freelancerId || "freelancer-1",
    })),
  )
  const [sellerPortfolios, setSellerPortfolios] = useState(() =>
    readStored(
      STORAGE_KEYS.sellerPortfolios,
      [],
      (items) => isArray(items) && items.every((item) => item && typeof item.id === "string" && typeof item.sellerEmail === "string"),
    ),
  )
  const [payoutSettings, setPayoutSettings] = useState(() =>
    readStored(STORAGE_KEYS.payoutSettings, {}, (value) => value && typeof value === "object" && !isArray(value)),
  )

  useEffect(() => persist(STORAGE_KEYS.favorites, favorites), [favorites])
  useEffect(() => persist(STORAGE_KEYS.orders, orders), [orders])
  useEffect(() => persist(STORAGE_KEYS.conversations, conversations), [conversations])
  useEffect(() => persist(STORAGE_KEYS.notifications, notifications), [notifications])
  useEffect(() => persist(STORAGE_KEYS.briefs, briefs), [briefs])
  useEffect(() => persist(STORAGE_KEYS.profiles, profiles), [profiles])
  useEffect(() => persist(STORAGE_KEYS.paymentMethods, paymentMethods), [paymentMethods])
  useEffect(() => persist(STORAGE_KEYS.reviews, reviews), [reviews])
  useEffect(() => persist(STORAGE_KEYS.supportRequests, supportRequests), [supportRequests])
  useEffect(() => persist(STORAGE_KEYS.sellerProfiles, sellerProfiles), [sellerProfiles])
  useEffect(() => persist(STORAGE_KEYS.sellerServices, sellerServices), [sellerServices])
  useEffect(() => persist(STORAGE_KEYS.sellerPortfolios, sellerPortfolios), [sellerPortfolios])
  useEffect(() => persist(STORAGE_KEYS.payoutSettings, payoutSettings), [payoutSettings])

  const serviceWithReviews = (service) => {
    if (!service?.isDemoSellerListing) return service
    const serviceReviewRatings = reviews
      .filter((review) => orders.some((order) => order.id === review.orderId && order.serviceId === service.id))
      .map((review) => Number(review.rating))
      .filter((rating) => Number.isFinite(rating) && rating >= 1 && rating <= 5)
    return serviceReviewRatings.length
      ? {
          ...service,
          rating: Number((serviceReviewRatings.reduce((sum, rating) => sum + rating, 0) / serviceReviewRatings.length).toFixed(1)),
          reviews: serviceReviewRatings.length,
        }
      : service
  }

  const value = useMemo(
    () => ({
      favorites,
      toggleFavorite: (id) => {
        if (typeof id !== "string" || !id) return false
        setFavorites((current) =>
          current.includes(id)
            ? current.filter((item) => item !== id)
            : [...current, id],
        )
        return true
      },
      orders,
      addOrder: (order) => {
        if (!order || !order.id || !order.serviceId || !order.freelancerId) {
          return { ok: false, error: "Order details are incomplete." }
        }
        const duplicate = orders.find(
          (item) =>
            item.id === order.id ||
            (order.checkoutKey && item.checkoutKey === order.checkoutKey),
        ) || (order.checkoutKey && orderKeys.current.get(order.checkoutKey))
        if (duplicate) return { ok: true, order: duplicate, duplicate: true }
        const next = normalizeOrder(order)
        if (orderIds.current.has(next.id)) {
          return { ok: false, error: "This demo order identifier has already been used." }
        }
        orderIds.current.add(next.id)
        if (next.checkoutKey) orderKeys.current.set(next.checkoutKey, next)
        orderStates.current.set(next.id, next.status)
        setOrders((current) => [next, ...current])
        return { ok: true, order: next, duplicate: false }
      },
      submitRequirements: (orderId, requirements) => {
        const order = orders.find((item) => item.id === orderId)
        if (!order) return { ok: false, error: "Order not found." }
        if (orderStates.current.get(orderId) !== "Requirements pending") {
          return { ok: false, error: "Requirements can only be submitted while they are pending." }
        }
        if (requirements.goal.trim().length < 20 || !requirements.audience.trim()) {
          return { ok: false, error: "Add a project goal of at least 20 characters and an audience." }
        }
        orderStates.current.set(orderId, "In progress")
        setOrders((current) =>
          current.map((item) =>
            item.id === orderId
              ? {
                  ...item,
                  requirements: {
                    ...requirements,
                    goal: requirements.goal.trim(),
                    audience: requirements.audience.trim(),
                    references: requirements.references.trim(),
                  },
                  requirementsSubmitted: true,
                  status: "In progress",
                }
              : item,
          ),
        )
        return { ok: true }
      },
      transitionOrder: (orderId, nextStatus, details = {}) => {
        const order = orders.find((item) => item.id === orderId)
        if (!order) return { ok: false, error: "Order not found." }
        const currentStatus = orderStates.current.get(orderId)
        if (!orderTransitions[currentStatus]?.includes(nextStatus)) {
          return { ok: false, error: `Cannot move this order from ${currentStatus || order.status} to ${nextStatus}.` }
        }
        if (nextStatus === "Revision requested" && details.feedback?.trim().length < 10) {
          return { ok: false, error: "Please provide at least 10 characters of revision feedback." }
        }
        orderStates.current.set(orderId, nextStatus)
        setOrders((current) =>
          current.map((item) =>
            item.id !== orderId
              ? item
              : {
                  ...item,
                  status: nextStatus,
                  ...(nextStatus === "Revision requested"
                    ? { revisionFeedback: details.feedback.trim() }
                    : {}),
                  ...(nextStatus === "Delivery submitted"
                    ? {
                        delivery: {
                          title: details.title || "Demo project delivery",
                          description:
                            details.description ||
                            "Illustrative files are available to preview in this demo.",
                          fileName: details.fileName || "demo-project-preview.pdf",
                          version: (item.delivery?.version || 0) + 1,
                        },
                      }
                    : {}),
                },
          ),
        )
        return { ok: true }
      },
      conversations,
      startConversation: (personId) => {
        const person = freelancers.find((item) => item.id === personId)
        if (!person) return null
        const existing = conversations.find(
          (conversation) =>
            conversation.personId === personId ||
            conversation.person === person.name,
        )
        if (existing) return existing
        const conversation = {
          id: `conversation-${person.id}`,
          personId: person.id,
          person: person.name,
          avatar: person.avatar,
          orderId: "",
          unread: 0,
          messages: [],
        }
        setConversations((current) => [conversation, ...current])
        return conversation
      },
      sendMessage: (conversationId, text) => {
        if (!text?.trim() || !conversations.some((item) => item.id === conversationId)) {
          return false
        }
        setConversations((current) =>
          current.map((conversation) =>
            conversation.id === conversationId
              ? {
                  ...conversation,
                  messages: [
                    ...conversation.messages,
                    { id: `m-${Date.now()}`, from: "me", text: text.trim(), time: "Now" },
                  ],
                }
              : conversation,
          ),
        )
        return true
      },
      notifications,
      markNotificationRead: (id) =>
        setNotifications((current) =>
          current.map((item) => item.id === id ? { ...item, unread: false } : item),
        ),
      markAllRead: () =>
        setNotifications((current) =>
          current.map((item) => ({ ...item, unread: false })),
        ),
      briefs,
      createBrief: (brief) => {
        const created = {
          ...brief,
          id: `BR-${Date.now()}`,
          status: "Open demo brief",
          createdAt: new Date().toISOString(),
        }
        setBriefs((current) => [created, ...current])
        return created
      },
      deleteBrief: (id) =>
        setBriefs((current) => current.filter((brief) => brief.id !== id)),
      getProfile: (email) =>
        profiles[email] || {
          firstName: email === "buyer@demo.com" ? "Riya" : email?.split("@")[0] || "Riya",
          lastName: "Sharma",
          email: email || "",
          bio: "Marketing lead building thoughtful consumer brands.",
          phone: "",
        },
      updateProfile: (email, profile) => {
        if (!email) return false
        setProfiles((current) => ({ ...current, [email]: profile }))
        return true
      },
      paymentMethods,
      addDemoPaymentMethod: (methodId) => {
        const demos = {
          "demo-card-4242": { id: "demo-card-4242", label: "Demo Visa ending in 4242", type: "Card" },
          "demo-upi": { id: "demo-upi", label: "demo@upi · simulated", type: "UPI" },
        }
        const method = demos[methodId]
        if (!method || paymentMethods.some((item) => item.id === method.id)) {
          return { ok: false, error: "Choose a demo payment method that is not already saved." }
        }
        setPaymentMethods((current) => [...current, { ...method, isDefault: current.length === 0 }])
        return { ok: true }
      },
      removePaymentMethod: (methodId) =>
        setPaymentMethods((current) => {
          const next = current.filter((item) => item.id !== methodId)
          return next.length && !next.some((item) => item.isDefault)
            ? next.map((item, index) => ({ ...item, isDefault: index === 0 }))
            : next
        }),
      setDefaultPaymentMethod: (methodId) =>
        setPaymentMethods((current) =>
          current.map((item) => ({ ...item, isDefault: item.id === methodId })),
        ),
      reviews,
      submitReview: (review) => {
        if (reviews.some((item) => item.orderId === review.orderId)) {
          return { ok: false, error: "A demo review has already been saved for this order." }
        }
        if (!orders.some((item) => item.id === review.orderId && item.status === "Completed")) {
          return { ok: false, error: "Only completed orders can be reviewed." }
        }
        const created = { ...review, id: `review-${Date.now()}`, createdAt: new Date().toISOString() }
        setReviews((current) => [created, ...current])
        return { ok: true, review: created }
      },
      supportRequests,
      submitSupportRequest: (request) => {
        const created = { ...request, id: `support-${Date.now()}`, createdAt: new Date().toISOString() }
        setSupportRequests((current) => [created, ...current])
        return created
      },
      getSellerProfile: (email) =>
        sellerProfiles[email] || {
          name: "Aarav Mehta",
          city: "Ahmedabad",
          headline: "Brand identity designer for ambitious new ventures",
          bio: "I help ambitious teams turn complex ideas into clear, high-quality creative work.",
          category: "graphic-design",
          skills: ["Brand strategy", "Logo design", "Canva", "Illustrator"],
          languages: ["English", "Hindi", "Gujarati"],
          experience: "5–8 years",
          available: true,
          onboardingComplete: false,
          freelancerId: "freelancer-1",
        },
      sellerProfileForFreelancerId: (freelancerId) => {
        const entry = Object.entries(sellerProfiles).find(([, profile]) => profile.freelancerId === freelancerId)
        return entry ? { email: entry[0], ...entry[1] } : null
      },
      saveSellerProfile: (email, profile) => {
        if (!email) return false
        setSellerProfiles((current) => ({ ...current, [email]: profile }))
        return true
      },
      servicesForSeller: (email, freelancerId = "freelancer-1") => [
        ...services
          .filter((service) => service.freelancerId === freelancerId)
          .map((service) => sellerServices.find((saved) => saved.id === service.id) || ({ ...service, sellerEmail: email, status: "Published", isSeeded: true })),
        ...sellerServices.filter((service) => service.sellerEmail === email && !services.some((seed) => seed.id === service.id)),
      ].map(serviceWithReviews),
      publishedServices: [
        ...sellerServices.filter((service) => service.status === "Published" && !services.some((seed) => seed.id === service.id)),
        ...services
          .map((service) => sellerServices.find((saved) => saved.id === service.id) || service)
          .filter((service) => service.status !== "Archived" && service.status !== "Paused" && service.status !== "Draft"),
      ].map(serviceWithReviews),
      getService: (serviceId) => {
        const service = sellerServices.find((item) => item.id === serviceId) ||
          services.find((item) => item.id === serviceId)
        return serviceWithReviews(service)
      },
      saveSellerService: (email, service) => {
        if (!email || !service?.title?.trim()) {
          return { ok: false, error: "A seller account and service title are required." }
        }
        const savedService = {
          ...service,
          id: service.id || `seller-service-${Date.now()}`,
          sellerEmail: email,
          freelancerId: service.freelancerId || sellerProfiles[email]?.freelancerId || "freelancer-1",
          status: service.status || "Draft",
          rating: service.rating || 0,
          reviews: service.reviews || 0,
          level: service.level || "New seller",
          available: (service.status || "Draft") === "Published",
          isDemoSellerListing: true,
        }
        setSellerServices((current) => {
          const index = current.findIndex((item) => item.id === savedService.id)
          return index === -1
            ? [savedService, ...current]
            : current.map((item) => item.id === savedService.id ? savedService : item)
        })
        return { ok: true, service: savedService }
      },
      updateSellerServiceStatus: (email, serviceId, status) => {
        if (!["Draft", "Published", "Paused", "Archived"].includes(status)) {
          return { ok: false, error: "Invalid demo service state." }
        }
        const service = sellerServices.find((item) => item.id === serviceId && item.sellerEmail === email) ||
          (services.some((item) => item.id === serviceId) ? { ...services.find((item) => item.id === serviceId), sellerEmail: email } : null)
        if (!service) return { ok: false, error: "This service cannot be changed from the current seller account." }
        setSellerServices((current) => {
          const existing = current.find((item) => item.id === serviceId)
          const base = existing || services.find((item) => item.id === serviceId)
          const updated = { ...base, sellerEmail: email, status, available: status === "Published", isDemoSellerListing: true }
          return existing
            ? current.map((item) => item.id === serviceId ? updated : item)
            : [updated, ...current]
        })
        return { ok: true }
      },
      removeSellerService: (email, serviceId) => {
        const exists = sellerServices.some((item) => item.id === serviceId && item.sellerEmail === email) ||
          services.some((item) => item.id === serviceId)
        if (!exists) return { ok: false, error: "This service cannot be removed from the current seller account." }
        setSellerServices((current) => {
          const existing = current.find((item) => item.id === serviceId)
          const base = existing || services.find((item) => item.id === serviceId)
          const updated = { ...base, sellerEmail: email, status: "Archived", available: false, isDemoSellerListing: true }
          return existing
            ? current.map((item) => item.id === serviceId ? updated : item)
            : [updated, ...current]
        })
        return { ok: true }
      },
      sellerPortfolioFor: (email) =>
        sellerPortfolios.filter((project) => project.sellerEmail === email),
      addSellerPortfolio: (email, project) => {
        const created = { ...project, id: `seller-portfolio-${Date.now()}`, sellerEmail: email }
        setSellerPortfolios((current) => [created, ...current])
        return created
      },
      updateSellerPortfolio: (email, projectId, project) => {
        const exists = sellerPortfolios.some((item) => item.id === projectId && item.sellerEmail === email)
        if (!exists) return false
        setSellerPortfolios((current) =>
          current.map((item) =>
            item.id === projectId && item.sellerEmail === email
              ? { ...item, ...project, title: project.title.trim() }
              : item,
          ),
        )
        return true
      },
      removeSellerPortfolio: (email, projectId) =>
        setSellerPortfolios((current) =>
          current.filter((project) => !(project.sellerEmail === email && project.id === projectId)),
        ),
      getPayoutSettings: (email) =>
        payoutSettings[email] || { method: "Demo bank transfer", accountLabel: "Demo account ending in 4242" },
      savePayoutSettings: (email, settings) => {
        if (!email) return false
        setPayoutSettings((current) => ({ ...current, [email]: settings }))
        return true
      },
    }),
    [
      favorites,
      orders,
      conversations,
      notifications,
      briefs,
      profiles,
      paymentMethods,
      reviews,
      supportRequests,
      sellerProfiles,
      sellerServices,
      sellerPortfolios,
      payoutSettings,
    ],
  )
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const store = useContext(StoreContext)
  if (!store) throw new Error("useStore must be used inside StoreProvider")
  return store
}
