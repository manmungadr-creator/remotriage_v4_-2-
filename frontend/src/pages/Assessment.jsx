// src/pages/Assessment.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTriage } from "../hooks/useTriage";

const SYMPTOM_LIST = [
  // Emergency-tier symptoms
  { id: "difficulty_breathing", label: "Difficulty breathing", labelSw: "Ugumu kupumua", tier: "danger" },
  { id: "convulsions", label: "Convulsions/Seizures", labelSw: "Degedege", tier: "danger" },
  { id: "altered_consciousness", label: "Loss of consciousness", labelSw: "Kupoteza fahamu", tier: "danger" },
  { id: "chest_pain", label: "Severe chest pain", labelSw: "Maumivu makali ya kifua", tier: "danger" },
  // Moderate-tier
  { id: "fever", label: "Fever", labelSw: "Homa", tier: "moderate" },
  { id: "high_fever", label: "High fever (≥39°C)", labelSw: "Homa kali sana", tier: "moderate" },
  { id: "severe_headache", label: "Severe headache", labelSw: "Maumivu makali ya kichwa", tier: "moderate" },
  { id: "stiff_neck", label: "Stiff neck", labelSw: "Shingo ngumu", tier: "moderate" },
  { id: "diarrhea", label: "Diarrhea", labelSw: "Kuhara", tier: "moderate" },
  { id: "vomiting", label: "Vomiting", labelSw: "Kutapika", tier: "moderate" },
  { id: "confusion", label: "Confusion", labelSw: "Mkanganyiko", tier: "moderate" },
  { id: "persistent_cough", label: "Persistent cough (2+ weeks)", labelSw: "Kikohozi cha muda mrefu", tier: "moderate" },
  // Lower risk
  { id: "mild_fever", label: "Mild fever", labelSw: "Homa ndogo", tier: "low" },
  { id: "mild_cough", label: "Mild cough", labelSw: "Kikohozi kidogo", tier: "low" },
  { id: "mild_headache", label: "Mild headache", labelSw: "Maumivu madogo ya kichwa", tier: "low" },
  { id: "runny_nose", label: "Runny nose", labelSw: "Pua inayotiririka", tier: "low" },
  { id: "sore_throat", label: "Sore throat", labelSw: "Koo inayouma", tier: "low" },
  { id: "fatigue", label: "Fatigue/Weakness", labelSw: "Uchovu/Udhaifu", tier: "low" },
  { id: "abdominal_pain", label: "Abdominal pain", labelSw: "Maumivu ya tumbo", tier: "low" },
  { id: "weight_loss", label: "Unexplained weight loss", labelSw: "Kupungua uzito bila sababu", tier: "low" },
  { id: "night_sweats", label: "Night sweats", labelSw: "Jasho usiku", tier: "low" },
  { id: "vaginal_bleeding", label: "Vaginal bleeding (pregnancy)", labelSw: "Kutoka damu (ukiwa mjamzito)", tier: "danger" },
];

const COUNTIES = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Uasin Gishu", "Kiambu", "Nyeri",
  "Meru", "Machakos", "Kisii", "Kakamega", "Kilifi", "Kwale", "Garissa",
  "Wajir", "Mandera", "Homa Bay", "Migori", "Siaya", "Bungoma", "Embu",
  "Kitui", "Makueni", "Laikipia", "Narok", "Kajiado", "Kericho", "Turkana",
  "Tana River", "Lamu", "Marsabit", "Isiolo", "Baringo", "Vihiga", "Busia",
  "Nyamira", "Nandi", "Trans Nzoia", "West Pokot", "Samburu",
  "Nyandarua", "Kirinyaga", "Murang'a", "Taita-Taveta", "Tharaka-Nithi",
  "Elgeyo-Marakwet", "Bomet",
];

export default function Assessment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { runAssessment, loading, error } = useTriage();

  const [lang, setLang] = useState("en");
  const [selected, setSelected] = useState(new Set());
  const [form, setForm] = useState({
    ageGroup: "adult",
    isPregnant: false,
    county: "Nairobi",
    season: "dry",
  });

  const toggleSymptom = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (selected.size === 0) {
      alert("Please select at least one symptom.");
      return;
    }
    const payload = {
      symptoms: [...selected],
      ...form,
      language: lang,
      requestAI: true,
    };
    const result = await runAssessment(payload);
    if (result) navigate("/results");
  };

  const label = (s) => (lang === "sw" ? s.labelSw : s.label);
  const tierSymptoms = (tier) => SYMPTOM_LIST.filter((s) => s.tier === tier);

  return (
    <div className="page page--assessment">
      {/* Nav */}
      <header className="nav">
        <Link to="/" className="nav__brand"><span className="nav__cross">+</span> RemoTriage</Link>
        <div className="nav__actions">
          <button className="btn btn--ghost" onClick={() => setLang(lang === "en" ? "sw" : "en")}>
            {lang === "en" ? "SW" : "EN"}
          </button>
          {user && <span className="muted">{user.name}</span>}
        </div>
      </header>

      <main className="container">
        <div className="page-header">
          <h1>{lang === "en" ? "Symptom Assessment" : "Tathmini ya Dalili"}</h1>
          <p className="muted">
            {lang === "en"
              ? "Select all symptoms present. More detail = better guidance."
              : "Chagua dalili zote zilizopo. Maelezo zaidi = mwongozo bora."}
          </p>
        </div>

        {error && <div className="alert alert--error">{error}</div>}

        {/* Danger symptoms */}
        <section className="card card--danger">
          <h2>
            {lang === "en" ? "⚠️ Danger Signs (Select if present)" : "⚠️ Dalili za Hatari"}
          </h2>
          <p className="muted">{lang === "en" ? "These require urgent attention" : "Hizi zinahitaji huduma ya haraka"}</p>
          <div className="chip-grid">
            {tierSymptoms("danger").map((s) => (
              <button
                key={s.id}
                className={`chip chip--danger ${selected.has(s.id) ? "chip--active" : ""}`}
                onClick={() => toggleSymptom(s.id)}
                type="button"
              >
                {label(s)}
              </button>
            ))}
          </div>
        </section>

        {/* Moderate symptoms */}
        <section className="card">
          <h2>{lang === "en" ? "Common Symptoms" : "Dalili za Kawaida"}</h2>
          <div className="chip-grid">
            {tierSymptoms("moderate").map((s) => (
              <button
                key={s.id}
                className={`chip ${selected.has(s.id) ? "chip--active" : ""}`}
                onClick={() => toggleSymptom(s.id)}
                type="button"
              >
                {label(s)}
              </button>
            ))}
          </div>
        </section>

        {/* Mild symptoms */}
        <section className="card">
          <h2>{lang === "en" ? "Mild Symptoms" : "Dalili Ndogo"}</h2>
          <div className="chip-grid">
            {tierSymptoms("low").map((s) => (
              <button
                key={s.id}
                className={`chip ${selected.has(s.id) ? "chip--active" : ""}`}
                onClick={() => toggleSymptom(s.id)}
                type="button"
              >
                {label(s)}
              </button>
            ))}
          </div>
        </section>

        {/* Patient context */}
        <section className="card">
          <h2>{lang === "en" ? "Patient Information" : "Taarifa za Mgonjwa"}</h2>
          <div className="form__row">
            <div className="form__group">
              <label>{lang === "en" ? "Age Group" : "Kundi la Umri"}</label>
              <select
                className="form__input"
                value={form.ageGroup}
                onChange={(e) => setForm((f) => ({ ...f, ageGroup: e.target.value }))}
              >
                <option value="infant">{lang === "en" ? "Infant (<1 yr)" : "Mtoto mchanga (<1 mwaka)"}</option>
                <option value="child">{lang === "en" ? "Child (1–12)" : "Mtoto (1–12)"}</option>
                <option value="adult">{lang === "en" ? "Adult" : "Mtu mzima"}</option>
                <option value="elderly">{lang === "en" ? "Elderly (60+)" : "Mzee (60+)"}</option>
              </select>
            </div>
            <div className="form__group">
              <label>{lang === "en" ? "County" : "Kaunti"}</label>
              <select
                className="form__input"
                value={form.county}
                onChange={(e) => setForm((f) => ({ ...f, county: e.target.value }))}
              >
                {COUNTIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form__row">
            <div className="form__group">
              <label>{lang === "en" ? "Season" : "Msimu"}</label>
              <select
                className="form__input"
                value={form.season}
                onChange={(e) => setForm((f) => ({ ...f, season: e.target.value }))}
              >
                <option value="dry">{lang === "en" ? "Dry season" : "Kiangazi"}</option>
                <option value="rainy">{lang === "en" ? "Rainy season" : "Masika"}</option>
              </select>
            </div>
            <div className="form__group form__group--checkbox">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={form.isPregnant}
                  onChange={(e) => setForm((f) => ({ ...f, isPregnant: e.target.checked }))}
                />
                {lang === "en" ? "Currently pregnant" : "Ni mjamzito"}
              </label>
            </div>
          </div>
        </section>

        {/* Selected count */}
        {selected.size > 0 && (
          <p className="selected-count">
            {selected.size} symptom{selected.size !== 1 ? "s" : ""} selected
          </p>
        )}

        <button
          className="btn btn--primary btn--full btn--lg"
          onClick={handleSubmit}
          disabled={loading || selected.size === 0}
        >
          {loading
            ? (lang === "en" ? "Analysing..." : "Inachambua...")
            : (lang === "en" ? "Get Triage Result →" : "Pata Matokeo →")}
        </button>

        <p className="disclaimer">
          {lang === "en"
            ? "⚠️ Guidance only. Not a diagnosis. Always confirm with a health worker."
            : "⚠️ Mwongozo tu. Si uchunguzi. Daima thibitisha na mtaalamu wa afya."}
        </p>
      </main>
    </div>
  );
}