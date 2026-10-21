import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { PageShell } from "./SharedComponents.jsx"

export default function AuthLayout({ children }) {
  return (
    <PageShell compact>
      <div className="auth-layout">
        <div className="auth-art">
          <div>
            <span className="eyebrow light">Create without limits</span>
            <h2>One calm place for ambitious creative work.</h2>
            <p>
              Discover talent, align on scope, and keep every project moving.
            </p>
          </div>
          <div className="auth-quote">
            <p>
              ?The best creative partnerships begin with a clear brief and a
              shared sense of possibility.?
            </p>
            <span>FreeLancerGraphic ? Demo experience</span>
          </div>
        </div>
        <div className="auth-form-wrap">
          <Link to="/" className="back-link">
            <ArrowLeft /> Back home
          </Link>
          {children}
        </div>
      </div>
    </PageShell>
  )
}
