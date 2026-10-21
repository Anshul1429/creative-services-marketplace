import { Component } from "react"
import { Link } from "react-router-dom"

export default class RouteErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error("A marketplace screen failed to render.", error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="route-error not-found" role="alert">
          <span>Something went wrong</span>
          <h1>This marketplace screen could not be loaded.</h1>
          <p>Refresh to try again, or return to discovery.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              className="button button-primary"
              onClick={() => window.location.reload()}
            >
              Refresh page
            </button>
            <Link className="button button-secondary" to="/explore">
              Browse services
            </Link>
          </div>
        </main>
      )
    }
    return this.props.children
  }
}
