import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, Star, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import { freelancers } from "../services/data.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function PremiumSellers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Check if user is a Seller
  const isSeller = user?.role === "seller" || user?.role === "freelancer";
  
  // Dummy premium sellers
  const premiumSellers = freelancers.slice(0, 6);

  return (
    <div className="section" style={{ background: "#fffbeb", minHeight: "100vh", paddingTop: "40px" }}>
      <div className="container">
        
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="button button-ghost" style={{ marginBottom: "20px", paddingLeft: 0 }}>
          <ArrowRight size={16} style={{ transform: "rotate(180deg)" }} /> Back
        </button>

        {/* --- SELLER VIEW (Create Profile) --- */}
        {isSeller ? (
          <div style={{ background: "white", padding: "60px 40px", borderRadius: "24px", textAlign: "center", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)", maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ display: "inline-flex", background: "var(--mint)", color: "var(--green)", padding: "20px", borderRadius: "50%", marginBottom: "24px" }}>
              <Zap size={40} />
            </div>
            <h1 style={{ fontSize: "36px", color: "var(--navy)", marginBottom: "16px", fontFamily: "Manrope" }}>Become a Premium Seller</h1>
            <p style={{ color: "var(--muted)", fontSize: "16px", maxWidth: "500px", margin: "0 auto 32px" }}>
              Create your premium graphic design profile to get urgent, high-paying orders from clients who need work done same-day.
            </p>
            <Link to="/create-premium-profile" className="button button-primary" style={{ padding: "0 40px", height: "54px", fontSize: "16px" }}>
              Create Your Premium Profile <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          /* --- CLIENT VIEW (Sellers List) --- */
          <>
            <div className="section-heading" style={{ marginBottom: "40px" }}>
              <div>
                <span className="eyebrow" style={{ color: "var(--warning)" }}>
                  <Zap size={14} style={{ display: "inline", marginRight: "4px" }} /> Premium Rush Delivery
                </span>
                <h2>Top Graphic Designers Available Now</h2>
                <p>Hire verified specialists for your urgent same-day projects.</p>
              </div>
            </div>

            <div className="service-grid">
              {premiumSellers.map((seller) => (
                <div key={seller.id} className="service-card" style={{ border: "1px solid var(--warning)", position: "relative" }}>
                  
                  {/* Available Badge */}
                  <div style={{ position: "absolute", top: "12px", right: "12px", background: "var(--warning)", color: "white", padding: "4px 10px", borderRadius: "20px", fontSize: "10px", fontWeight: "bold", zIndex: 10 }}>
                    Available Now
                  </div>

                  <div className="service-image-wrap" style={{ cursor: "pointer" }} onClick={() => navigate(`/freelancer/${seller.id}`)}>
                    <img src={seller.avatar} alt={seller.name} className="service-image" style={{ objectFit: "cover" }} />
                  </div>
                  
                  <div className="service-body">
                    <div className="freelancer-mini">
                      <ShieldCheck size={14} style={{ color: "var(--green)" }} /> Verified Premium Seller
                    </div>
                    <h3 className="service-title" style={{ cursor: "pointer" }} onClick={() => navigate(`/freelancer/${seller.id}`)}>
                      {seller.name} - {seller.role}
                    </h3>
                    
                    <div className="rating">
                      <Star size={14} fill="currentColor" /> <strong>{seller.rating}</strong>
                      <span className="dot"></span>
                      <span>{seller.projects} projects</span>
                    </div>
                    
                    <div className="service-price" style={{ paddingBottom: "12px" }}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span>Starting at</span>
                        <strong style={{ color: "var(--warning)" }}>₹4,999</strong>
                      </div>
                      <button 
                        onClick={() => navigate(`/freelancer/${seller.id}`)}
                        className="button button-primary" 
                        style={{ background: "var(--warning)", borderColor: "var(--warning)", padding: "0 20px" }}
                      >
                        Hire Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}