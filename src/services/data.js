const images = [
  "https://images.unsplash.com/photo-1622960668894-75d014c9bf83?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1739283540544-e4cba8bc0f7e?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1614963326505-843868e1d83a?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1655213675468-19558613ff75?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1696834137457-8872b6c525f4?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1545022825-88f1c1565aa5?auto=format&fit=crop&w=1200&q=85",
]
const portraits = [
  "https://images.unsplash.com/photo-1630821816375-248e9e483742?auto=format&fit=crop&w=300&q=85",
  "https://images.unsplash.com/photo-1548057407-b022b3f5b6ab?auto=format&fit=crop&w=300&q=85",
  "https://images.unsplash.com/photo-1686249959385-ee6c7dcdf0ec?auto=format&fit=crop&w=300&q=85",
  "https://images.unsplash.com/photo-1647613115780-52b9b5bf61da?auto=format&fit=crop&w=300&q=85",
]
export const categories = [
  {
    slug: "graphic-design",
    name: "Graphic Design",
    description: "Brand identities and visuals that make businesses memorable.",
    icon: "PenTool",
    subcategories: [
      "Logo & Brand Identity",
      "Social Media Design",
      "Print & Packaging",
      "Presentation Design",
    ],
  },
  {
    slug: "video-editing",
    name: "Video Editing",
    description: "Story-led edits for campaigns, creators, and growing brands.",
    icon: "Clapperboard",
    subcategories: [
      "YouTube Videos",
      "Reels & Shorts",
      "Commercial Ads",
      "Color Grading & VFX",
    ],
  },
  {
    slug: "animation",
    name: "Animation",
    description: "Motion and character work that turns ideas into stories.",
    icon: "Sparkles",
    subcategories: [
      "2D Animation",
      "3D Animation",
      "Motion Graphics",
      "Explainer Videos",
    ],
  },
  {
    slug: "web-development",
    name: "Web Development",
    description: "Fast, thoughtful websites built for real business outcomes.",
    icon: "Code2",
    subcategories: [
      "Business Websites",
      "E-commerce",
      "Landing Pages",
      "Full-Stack Apps",
    ],
  },
  {
    slug: "app-development",
    name: "App Development",
    description: "Polished mobile products from prototype to production.",
    icon: "Smartphone",
    subcategories: [
      "Android Apps",
      "iOS Apps",
      "Flutter Development",
      "App Prototypes",
    ],
  },
  {
    slug: "ui-ux-design",
    name: "UI/UX Design",
    description: "Research-backed interfaces people understand and enjoy.",
    icon: "PanelsTopLeft",
    subcategories: [
      "Website UI/UX",
      "Mobile App Design",
      "Wireframing",
      "Design Systems",
    ],
  },
]
const people = [
  ["Aarav Mehta", "Brand identity designer", "Ahmedabad"],
  ["Nisha Kapoor", "Product and UI/UX designer", "Bengaluru"],
  ["Kabir Malhotra", "Film editor & colourist", "Mumbai"],
  ["Diya Iyer", "Motion graphics artist", "Chennai"],
  ["Arjun Rao", "Full-stack web developer", "Hyderabad"],
  ["Meera Sethi", "Mobile product engineer", "Pune"],
  ["Rohan Das", "Packaging designer", "Kolkata"],
  ["Ishita Shah", "Presentation specialist", "Surat"],
  ["Vikram Nair", "3D animator", "Kochi"],
  ["Ananya Bose", "UX researcher & designer", "Delhi"],
  ["Samar Singh", "E-commerce developer", "Jaipur"],
  ["Tara Menon", "Social content designer", "Goa"],
]
export const freelancers = people.map((person, index) => ({
  id: `freelancer-${index + 1}`,
  name: person[0],
  role: person[1],
  location: `${person[2]}, India`,
  languages:
    index % 2 ? ["English", "Hindi"] : ["English", "Hindi", "Gujarati"],
  rating: Number((4.7 + (index % 3) * 0.1).toFixed(1)),
  reviews: 48 + index * 17,
  projects: 72 + index * 23,
  response: index % 3 === 0 ? "Within 1 hour" : "Within 3 hours",
  verified: index < 8,
  avatar: portraits[index % portraits.length],
  bio: `I help ambitious teams turn complex ideas into clear, high-quality creative work. My process is collaborative, structured, and focused on outcomes.`,
  skills: [
    "Creative direction",
    "Canva",
    "Adobe Creative Cloud",
    "Client collaboration",
  ].slice(0, 3 + (index % 2)),
}))
const serviceBlueprints = [
  [
    "Distinctive brand identity and logo system",
    "graphic-design",
    "Logo & Brand Identity",
  ],
  [
    "Social media campaign kit for your launch",
    "graphic-design",
    "Social Media Design",
  ],
  [
    "Premium packaging design for consumer brands",
    "graphic-design",
    "Print & Packaging",
  ],
  ["High-retention YouTube video editing", "video-editing", "YouTube Videos"],
  [
    "Scroll-stopping reels and short-form edits",
    "video-editing",
    "Reels & Shorts",
  ],
  [
    "Cinematic colour grade and VFX polish",
    "video-editing",
    "Color Grading & VFX",
  ],
  ["Expressive 2D explainer animation", "animation", "2D Animation"],
  ["Premium product motion graphics", "animation", "Motion Graphics"],
  ["3D product animation for campaigns", "animation", "3D Animation"],
  [
    "Conversion-focused Webflow landing page",
    "web-development",
    "Landing Pages",
  ],
  [
    "Fast React website for your business",
    "web-development",
    "Business Websites",
  ],
  ["Scalable e-commerce storefront build", "web-development", "E-commerce"],
  [
    "Cross-platform Flutter mobile app",
    "app-development",
    "Flutter Development",
  ],
  ["Native iOS application experience", "app-development", "iOS Apps"],
  [
    "Clickable app prototype for your pitch",
    "app-development",
    "App Prototypes",
  ],
  ["Research-led mobile app UX design", "ui-ux-design", "Mobile App Design"],
  ["Complete SaaS dashboard design system", "ui-ux-design", "Design Systems"],
  ["Accessible website UI and prototype", "ui-ux-design", "Website UI/UX"],
]
export const services = serviceBlueprints.map((item, index) => {
  const base = 2499 + index * 450
  return {
    id: `service-${index + 1}`,
    title: `I will create a ${item[0].toLowerCase()}`,
    category: item[1],
    subcategory: item[2],
    freelancerId: `freelancer-${(index % 12) + 1}`,
    image: images[index % images.length],
    rating: Number((4.7 + (index % 3) * 0.1).toFixed(1)),
    reviews: 38 + index * 11,
    tags: [item[2], index % 2 ? "Fast delivery" : "Top rated", "English"],
    level:
      index % 4 === 0
        ? "Top Rated"
        : index % 3 === 0
          ? "Rising Talent"
          : "Level 2",
    available: index % 7 !== 0,
    description:
      "A collaborative, outcome-focused service with a clear process, thoughtful creative direction, and production-ready deliverables. You will receive regular updates and organized source files.",
    packages: [
      {
        name: "Basic",
        price: base,
        delivery: 5,
        revisions: 2,
        description: "A focused starter package",
        includes: ["Creative consultation", "One core concept", "Source files"],
      },
      {
        name: "Standard",
        price: base + 3500,
        delivery: 8,
        revisions: 4,
        description: "Best for growing teams",
        includes: [
          "Creative consultation",
          "Three concepts",
          "Source files",
          "Usage guide",
        ],
      },
      {
        name: "Premium",
        price: base + 7500,
        delivery: 12,
        revisions: 6,
        description: "The complete creative partnership",
        includes: [
          "Strategy workshop",
          "Five concepts",
          "Source files",
          "Usage guide",
          "Priority support",
        ],
      },
    ],
  }
})
export const portfolios = services.slice(0, 12).map((service, index) => ({
  id: `portfolio-${index + 1}`,
  title:
    ["Nila Wellness", "Orbit Finance", "Mango Studios", "Katha Coffee"][
      index % 4
    ] +
    " — " +
    service.subcategory,
  category: service.category,
  freelancerId: service.freelancerId,
  image: images[(index + 2) % images.length],
  overview:
    "A demo portfolio project exploring a clear visual system, confident storytelling, and a polished multi-channel rollout.",
  tools: ["Canva", "Illustrator", "After Effects"].slice(0, 2 + (index % 2)),
}))
export const initialOrders = [
  {
    id: "FLG-2048",
    serviceId: "service-1",
    freelancerId: "freelancer-1",
    packageName: "Standard",
    total: 6449,
    status: "In progress",
    requirementsSubmitted: true,
    requirements: {
      goal: "Create a clear, modern identity that feels warm and culturally grounded without relying on visual clichés.",
      audience: "Independent founders and small teams across India.",
      references: "Demo brand references shared in the project brief.",
    },
    due: "18 Jun",
  },
  {
    id: "FLG-1982",
    serviceId: "service-5",
    freelancerId: "freelancer-5",
    packageName: "Premium",
    total: 11799,
    status: "Delivery submitted",
    due: "12 Jun",
    requirementsSubmitted: true,
    requirements: {
      goal: "Create a polished product experience for a growing digital brand.",
      audience: "Founders and product teams in India.",
      references: "Illustrative demo reference links.",
    },
    delivery: {
      title: "Product design handoff",
      description: "Illustrative product screens and handoff notes for buyer review.",
      fileName: "demo-product-handoff.pdf",
      version: 1,
    },
  },
  {
    id: "FLG-1764",
    serviceId: "service-10",
    freelancerId: "freelancer-10",
    packageName: "Basic",
    total: 6599,
    status: "Completed",
    due: "02 Jun",
    requirementsSubmitted: true,
    requirements: {
      goal: "Build a clear landing page concept for a new product.",
      audience: "Early-stage product customers.",
      references: "",
    },
    delivery: {
      title: "Landing page delivery",
      description: "Illustrative completed landing page preview.",
      fileName: "demo-landing-page.pdf",
      version: 1,
    },
  },
]
export const initialConversations = [
  {
    id: "conversation-1",
    personId: "freelancer-1",
    person: "Aarav Mehta",
    avatar: portraits[0],
    orderId: "FLG-2048",
    unread: 2,
    messages: [
      {
        id: "m1",
        from: "them",
        text: "Thanks for sharing the brief. I have reviewed the brand references.",
        time: "10:24",
      },
      {
        id: "m2",
        from: "me",
        text: "Great. I would love the identity to feel warm, modern, and distinctly Indian.",
        time: "10:28",
      },
      {
        id: "m3",
        from: "them",
        text: "Perfect. I will share the first direction tomorrow afternoon.",
        time: "10:31",
      },
    ],
  },
  {
    id: "conversation-2",
    personId: "freelancer-2",
    person: "Nisha Kapoor",
    avatar: portraits[1],
    orderId: "FLG-1982",
    unread: 0,
    messages: [
      {
        id: "m4",
        from: "them",
        text: "Your final prototype and handoff notes are ready for review.",
        time: "Yesterday",
      },
    ],
  },
]
