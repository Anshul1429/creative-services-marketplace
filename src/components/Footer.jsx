import { useState } from "react"
import {
  Globe2,
  ShieldCheck,
} from "lucide-react"
import { FaTiktok, FaInstagram, FaLinkedin, FaFacebook, FaPinterest, FaXTwitter } from "react-icons/fa6"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { Logo } from "./Navbar.jsx"

export function Footer() {
  const groups = [
    {
      title: "For clients",
      links: [
        ["Explore services", "/explore"],
        ["How it works", "/how-it-works"],
        ["Favorites", "/dashboard/favorites"],
        ["Client dashboard", "/dashboard"],
      ],
    },
    {
      title: "For freelancers",
      links: [
        ["Join as a freelancer", "/become-a-freelancer"],
        ["Seller dashboard", "/seller/dashboard"],
        ["Create a service", "/seller/services/new"],
        ["Earnings", "/seller/earnings"],
      ],
    },
    {
      title: "Company",
      links: [
        ["About", "/about"],
        ["Contact", "/contact"],
        ["Help center", "/help"],
        ["Privacy", "/privacy"],
      ],
    },
  ]

  return (
    <footer className="footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <Logo />
          <p>
            India’s thoughtful marketplace for exceptional creative and digital
            talent.
          </p>
          <span className="demo-label">Demo marketplace experience</span>
        </div>
        {groups.map((group) => (
          <div className="footer-group" key={group.title}>
            <h4>{group.title}</h4>
            {group.links.map(([label, path]) => (
              <Link key={path} to={path}>
                {label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      
      {/* Footer Bottom - Fiverr Style */}
      <div className="container footer-bottom fiverr-style-footer">
        <span className="footer-copyright">© 2026 FreeLancerGraphic. Demo content.</span>
        
        <div className="footer-bottom-right">
          
          {/* Social Icons */}
          <div className="social-links">
            <a href="#" aria-label="TikTok"><FaTiktok size={18} /></a>
            <a href="#" aria-label="Instagram"><FaInstagram size={18} /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedin size={18} /></a>
            <a href="#" aria-label="Facebook"><FaFacebook size={18} /></a>
            <a href="#" aria-label="Pinterest"><FaPinterest size={18} /></a>
            <a href="#" aria-label="X"><FaXTwitter size={18} /></a>
          </div>

          <span className="social-dot">•</span>

          {/* Language, Currency, Accessibility */}
          <div className="footer-preferences">
            <button type="button" className="pref-btn">
              <Globe2 size={16} /> English
            </button>
            <button type="button" className="pref-btn">
              ₹ INR
            </button>
            <button type="button" className="pref-btn accessibility-btn">
              <ShieldCheck size={18} />
            </button>
          </div>

        </div>
      </div>
    </footer>
  )
}

export default Footer