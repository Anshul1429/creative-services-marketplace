import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function CreatePremiumProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: "Expert Graphic Designer",
    skills: "Logo Design, Branding, Social Media",
    delivery: "24 Hours",
    price: "4999",
    description: "I specialize in delivering high-quality designs at lightning speed."
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Demo: Save to local storage (taaki list me dikhe)
    const existing = JSON.parse(localStorage.getItem("premiumSellers") || "[]");
    localStorage.setItem("premiumSellers", JSON.stringify([...existing, { ...user, ...formData, id: Date.now() }]));
    
    setIsSubmitted(true);
    setTimeout(() => {
      navigate("/premium-sellers");
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="section" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", background: "#fffbeb" }}>
        <div style={{ background: "white", padding: "50px", borderRadius: "24px", textAlign: "center", maxWidth: "500px" }}>
          <div style={{ display: "inline-flex", background: "var(--mint)", color: "var(--green)", padding: "20px", borderRadius: "50%", marginBottom: "20px" }}>
            <CheckCircle2 size={40} />
          </div>
          <h2 style={{ color: "var(--navy)", marginBottom: "10px" }}>Profile Created!</h2>
          <p style={{ color: "var(--muted)" }}>Your premium profile is now live. Redirecting to the premium marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section" style={{ background: "#fffbeb", minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        
        <button onClick={() => navigate(-1)} className="button button-ghost" style={{ marginBottom: "20px", paddingLeft: 0 }}>
          <ArrowLeft size={16} /> Back to Premium
        </button>

        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "24px", padding: "40px", boxShadow: "var(--shadow-md)" }}>
          
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ display: "inline-flex", background: "var(--mint)", color: "var(--green)", padding: "16px", borderRadius: "50%", marginBottom: "16px" }}>
              <Zap size={32} />
            </div>
            <h1 style={{ fontFamily: "Manrope", fontSize: "32px", color: "var(--navy)", marginBottom: "8px" }}>Setup Your Premium Profile</h1>
            <p style={{ color: "var(--muted)" }}>Fill in your details. Clients looking for urgent graphic design work will see this.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            <div className="field">
              <label>Profile Title</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            </div>

            <div className="field">
              <label>Premium Skills (comma separated)</label>
              <input type="text" value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})} required />
            </div>

            <div className="two-fields">
              <div className="field">
                <label>Delivery Time</label>
                <select value={formData.delivery} onChange={(e) => setFormData({...formData, delivery: e.target.value})}>
                  <option>12 Hours (Super Fast)</option>
                  <option>24 Hours (Express)</option>
                  <option>48 Hours (Standard)</option>
                </select>
              </div>
              <div className="field">
                <label>Rush Starting Price (₹)</label>
                <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
              </div>
            </div>

            <div className="field">
              <label>About Your Premium Service</label>
              <textarea rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
            </div>

            <button type="submit" className="button button-primary" style={{ marginTop: "20px", height: "52px", fontSize: "16px" }}>
              Publish Premium Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}