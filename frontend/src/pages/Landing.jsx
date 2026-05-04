// src/pages/Landing.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HOW_IT_WORKS = [
  {
    icon: "📋",
    title: "Select Symptoms",
    desc: "Choose from a clear list of symptoms in English or Kiswahili.",
  },
  {
    icon: "⚡",
    title: "Instant Analysis",
    desc: "Our WHO-based deterministic triage engine analyses your symptoms immediately.",
  },
  {
    icon: "🏥",
    title: "Clear Guidance",
    desc: "Get actionable next steps — home care, visit a clinic, or call emergency.",
  },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="page page--landing">
      {/* Nav */}
      <header className="nav">
        <div className="nav__brand">
          <span className="nav__cross">+</span> RemoTriage
        </div>
        <div className="nav__actions">
          {user ? (
            <Link to="/assessment" className="btn btn--primary">Start Assessment</Link>
          ) : (
            <>
              <Link to="/login" className="btn btn--ghost">Sign In</Link>
              <Link to="/register" className="btn btn--primary">Get Started</Link>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="hero">
          <div className="hero__copy">
            <p className="eyebrow">Trusted health guidance for Kenya</p>
            <h1 className="hero__title">Know when to seek care</h1>
            <p className="hero__desc">
              RemoTriage gives you safe, rule-based health guidance based on your symptoms.
              Used by individuals and community health workers across Kenya.
              No diagnosis — clear next steps.
            </p>
            <div className="hero__cta">
              <Link to="/assessment" className="btn btn--primary btn--lg">
                Start Free Assessment
              </Link>
              <a href="#how-it-works" className="btn btn--outline btn--lg">Learn More</a>
            </div>
            <p className="disclaimer">
              ⚠️ This is a triage guidance tool only. Not a diagnosis. Always confirm with a qualified health worker.
            </p>
          </div>
          <div className="hero__badge">
            <div className="badge-card">
              <div className="badge-card__icon">🏥</div>
              <div className="badge-card__text">
                <strong>WHO IMCI</strong>
                <span>Protocol-based</span>
              </div>
            </div>
            <div className="badge-card">
              <div className="badge-card__icon">📱</div>
              <div className="badge-card__text">
                <strong>USSD + Web</strong>
                <span>Works on any phone</span>
              </div>
            </div>
            <div className="badge-card">
              <div className="badge-card__icon">🇰🇪</div>
              <div className="badge-card__text">
                <strong>Kenya MoH</strong>
                <span>Aligned protocols</span>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="section">
          <h2 className="section__title">How it works</h2>
          <div className="steps">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="step-card">
                <span className="step-card__icon">{step.icon}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Emergency banner */}
        <section className="emergency-banner">
          <strong>🚨 Life-threatening emergency?</strong> Call{" "}
          <a href="tel:0800723253">0800 723 253</a> (free, 24/7) or dial{" "}
          <a href="tel:999">999</a>
        </section>
      </main>

      <footer className="footer">
        <p>RemoTriage © 2025 · Built for Kenya · Not a medical device</p>
        <p>
          Dial <strong>*384#</strong> for USSD access on any phone
        </p>
      </footer>
    </div>
  );
}