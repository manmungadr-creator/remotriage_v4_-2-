// src/pages/Results.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { triageAPI } from "../services/api";

const LEVEL_CONFIG = {
  EMERGENCY: {
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
    icon: "🚨",
    label: "EMERGENCY",
    labelSw: "DHARURA",
  },
  MODERATE: {
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    icon: "⚠️",
    label: "MODERATE",
    labelSw: "WASTANI",
  },
  LOW: {
    color: "#059669",
    bg: "#ecfdf5",
    border: "#a7f3d0",
    icon: "✅",
    label: "LOW RISK",
    labelSw: "HATARI NDOGO",
  },
};

export default function Results() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [lang, setLang] = useState("en");
  const [rating, setRating] = useState(0);
  const [rated, setRated] = useState(false);

  useEffect(() => {
    const cached = sessionStorage.getItem("remo_last_result");
    if (!cached) {
      navigate("/assessment");
      return;
    }
    setData(JSON.parse(cached));
  }, [navigate]);

  const submitRating = async (stars) => {
    setRating(stars);
    try {
      await triageAPI.submitFeedback({
        requestId: data.requestId,
        rating: stars,
        level: data.triage.level,
      });
      setRated(true);
    } catch {
      setRated(true); // Don't block UX
    }
  };

  if (!data) return <div className="page"><p>Loading...</p></div>;

  const { triage, aiGuidance, facilities, emergency } = data;
  const config = LEVEL_CONFIG[triage.level];
  const action = triage.action?.[lang] || triage.action?.en || "";
  const reason = triage.reason?.[lang] || triage.reason?.en || "";
  const disclaimer = triage.disclaimer?.[lang] || triage.disclaimer?.en || "";

  return (
    <div className="page page--results">
      <header className="nav">
        <Link to="/" className="nav__brand"><span className="nav__cross">+</span> RemoTriage</Link>
        <div className="nav__actions">
          <button className="btn btn--ghost" onClick={() => setLang(lang === "en" ? "sw" : "en")}>
            {lang === "en" ? "SW" : "EN"}
          </button>
        </div>
      </header>

      <main className="container">
        {/* Triage Level Banner */}
        <div
          className="result-banner"
          style={{ background: config.bg, border: `2px solid ${config.border}` }}
        >
          <div className="result-banner__level" style={{ color: config.color }}>
            {config.icon} {lang === "en" ? config.label : config.labelSw}
          </div>
          <div className="result-banner__suspect">{triage.suspect}</div>
          <div className="result-banner__protocol">Protocol: {triage.protocol}</div>
        </div>

        {/* EMERGENCY call-out */}
        {triage.callEmergency && (
          <div className="emergency-call-out">
            <strong>🚨 Call emergency NOW:</strong>
            <div className="emergency-numbers">
              {Object.values(emergency || {}).map((e) => (
                <a key={e.number} href={`tel:${e.number.replace(/\s/g, "")}`} className="emergency-btn">
                  📞 {e.name}: <strong>{e.number}</strong>
                  {e.free && <span className="free-badge">FREE</span>}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Reason */}
        <section className="card">
          <h2>{lang === "en" ? "Why this result" : "Kwa nini matokeo haya"}</h2>
          <p>{reason}</p>
        </section>

        {/* Action */}
        <section className="card card--action">
          <h2>{lang === "en" ? "What to do now" : "Cha kufanya sasa"}</h2>
          <p className="action-text">{action}</p>
        </section>

        {/* AI Guidance */}
        {aiGuidance && (
          <section className="card card--ai">
            <div className="ai-badge">AI Guidance <span className="supplementary">(supplementary)</span></div>
            <p>{aiGuidance}</p>
            <p className="muted small">{data.aiSafetyNote}</p>
          </section>
        )}

        {/* Other findings */}
        {triage.otherFindings?.length > 0 && (
          <section className="card">
            <h2>{lang === "en" ? "Other findings" : "Matokeo mengine"}</h2>
            {triage.otherFindings.map((f) => (
              <div key={f.id} className="finding-row">
                <span className={`level-pill level-pill--${f.level.toLowerCase()}`}>{f.level}</span>
                {f.suspect}
              </div>
            ))}
          </section>
        )}

        {/* Facilities */}
        {facilities && (
          <section className="card">
            <h2>{lang === "en" ? "Nearest health facilities" : "Vituo vya afya vilivyo karibu"}</h2>
            {facilities.referralHospital && (
              <div className="facility-card facility-card--primary">
                <strong>🏥 {facilities.referralHospital.name}</strong>
                <div className="muted">{facilities.referralHospital.level} County Referral</div>
                <a href={`tel:${facilities.referralHospital.phone}`}>
                  📞 {facilities.referralHospital.phone}
                </a>
              </div>
            )}
          </section>
        )}

        {/* Malaria note */}
        {triage.malariaEndemicCounty && (
          <div className="info-banner">
            ℹ️ {lang === "en"
              ? "You are in a malaria-endemic county. Free malaria testing available at all government health facilities."
              : "Uko katika kaunti ya malaria. Upimaji wa malaria bila malipo unapatikana katika vituo vyote vya afya vya serikali."}
          </div>
        )}

        {/* Disclaimer */}
        <p className="disclaimer">{disclaimer}</p>

        {/* Rating */}
        {!rated ? (
          <div className="rating-section">
            <p>{lang === "en" ? "Was this guidance helpful?" : "Je, mwongozo huu ulikuwa wa msaada?"}</p>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  className={`star ${n <= rating ? "star--active" : ""}`}
                  onClick={() => submitRating(n)}
                  type="button"
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="muted text-center">Thank you for your feedback.</p>
        )}

        {/* Actions */}
        <div className="result-actions">
          <Link to="/assessment" className="btn btn--outline">
            {lang === "en" ? "New Assessment" : "Tathmini Mpya"}
          </Link>
          <Link to="/" className="btn btn--ghost">Home</Link>
        </div>
      </main>
    </div>
  );
}