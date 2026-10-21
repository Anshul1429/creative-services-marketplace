import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Zap, User, Briefcase, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function PremiumAuth() {
  const [role, setRole] = useState("client"); // default client
  const navigate = useNavigate();
  const { login } = useAuth(); // Aapke AuthContext ka login method

  const handleLogin = (e) => {
    e.preventDefault();
    // Demo login logic
    login({ name: "Demo Premium User", role: role, isPremium: true });
    
    // Role ke hisaab se redirect karein
    if (role === "client") {
      navigate("/premium-sellers");
    } else {
      navigate("/dashboard"); // Seller dashboard
    }
  };

  return (
    <div className="auth-layout" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fffbeb" }}>
      <div className="auth-form-wrap" style={{ background: "white", padding: "40px", borderRadius: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.1)", maxWidth: "450px", width: "100%" }}>
        
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ display: "inline-flex", background: "#fef3c7", color: "#d97706", padding: "16px", borderRadius: "50%", marginBottom: "16px" }}>
            <Zap size={32} />
          </div>
          <h1 style={{ fontSize: "28px", color: "var(--navy)" }}>Rush Priority Access</h1>
          <p style={{ color: "var(--muted)" }}>Enter the premium portal to get your work done same-day.</p>
        </div>

        <form onSubmit={handleLogin}>
          {/* Role Selection */}
          <div className="role-options" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
            <label style={{ border: role === "client" ? "2px solid #d97706" : "1px solid var(--border)", padding: "16px", borderRadius: "12px", cursor: "pointer", textAlign: "center" }}>
              <input type="radio" name="role" value="client" checked={role === "client"} onChange={() => setRole("client")} style={{ display: "none" }} />
              <User size={24} style={{ margin: "0 auto 8px", color: role === "client" ? "#d97706" : "var(--muted)" }} />
              <strong style={{ display: "block", color: "var(--navy)" }}>I'm a Client</strong>
              <small style={{ color: "var(--muted)" }}>Hire fast</small>
            </label>

            <label style={{ border: role === "seller" ? "2px solid #d97706" : "1px solid var(--border)", padding: "16px", borderRadius: "12px", cursor: "pointer", textAlign: "center" }}>
              <input type="radio" name="role" value="seller" checked={role === "seller"} onChange={() => setRole("seller")} style={{ display: "none" }} />
              <Briefcase size={24} style={{ margin: "0 auto 8px", color: role === "seller" ? "#d97706" : "var(--muted)" }} />
              <strong style={{ display: "block", color: "var(--navy)" }}>I'm a Seller</strong>
              <small style={{ color: "var(--muted)" }}>Deliver fast</small>
            </label>
          </div>

          {/* Demo Login Button */}
          <button type="submit" className="button" style={{ width: "100%", background: "#d97706", color: "white", height: "48px", fontSize: "16px", fontWeight: "bold" }}>
            Enter Premium Portal <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}