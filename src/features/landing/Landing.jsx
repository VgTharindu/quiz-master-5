import Logo from "@/components/Logo";
import Icon from "./Icon";
import SampleQuestion from "./SampleQuestion";
import { BENEFITS, DOODLES, SIR, STEPS } from "./landingData";
import "./landing.css";

export default function Landing({ onStudent, onTeacher }) {
  return (
    <div className="qm">
      <header className="qm-top">
        <div className="qm-brand">
          <Logo size={36} />
          <span>
            QUIZ MASTER <em>5</em>
          </span>
        </div>
        <button className="qm-link" onClick={onTeacher}>
          සර් පිවිසුම
        </button>
      </header>

      <section className="qm-hero">
        <div className="qm-doodles" aria-hidden="true">
          {DOODLES.map(([c, x, y, r], k) => (
            <span
              key={k}
              style={{ left: x + "%", top: y + "%", transform: `rotate(${r}deg)` }}
            >
              {c}
            </span>
          ))}
        </div>
        <div className="qm-hero-text">
          <div className="qm-logo-blob">
            <Logo size={112} />
          </div>
          <h1>
            QUIZ MASTER <em>5</em>
          </h1>
          <p className="qm-tag">Grade 5 Scholarship Learning Platform</p>
          <button className="qm-main qm-hero-cta" onClick={onStudent}>
            පරීක්ෂණයට යන්න
          </button>
        </div>
        <SampleQuestion onStudent={onStudent} />
      </section>

      <section className="qm-block">
        <h2 className="qm-title">QUIZ MASTER 5 මගින්</h2>
        <ul className="qm-benefits">
          {BENEFITS.map((b) => (
            <li key={b.text} className={"qm-benefit " + b.tone}>
              <span className="qm-benefit-icon">
                <Icon name={b.icon} />
              </span>
              <span>{b.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="qm-steps">
        <h2>පරීක්ෂණයක් කරන හැටි</h2>
        <ol>
          {STEPS.map(([t, d]) => (
            <li key={t}>
              <b>{t}</b>
              <span>{d}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="qm-block">
        <div className="qm-sir">
          <img
            src={SIR.photo}
            alt={SIR.name}
            width="160"
            height="160"
            loading="lazy"
          />
          <div className="qm-sir-text">
            <h2>{SIR.name}</h2>
            <p className="qm-sir-short">({SIR.short})</p>
            <a className="qm-call" href={"tel:" + SIR.tel}>
              <Icon name="phone" />
              <span>{SIR.phone}</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="qm-foot">
        <span>© {new Date().getFullYear()} QUIZ MASTER 5</span>
        <span>චාමර සර්ගේ 5 වසර ශිෂ්‍යත්ව පන්තිය</span>
      </footer>

      {/* Phone එකේ පමණක් පෙනෙන, පහළට ඇලී තියෙන බොත්තම */}
      <div className="qm-dock">
        <button className="qm-main" onClick={onStudent}>
          පරීක්ෂණයට යන්න
        </button>
      </div>
    </div>
  );
}
