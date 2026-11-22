import Logo from "@/components/Logo";
import Icon from "./Icon";
import SampleQuestion from "./SampleQuestion";
import Sticker from "./Sticker";
import { FEATURES, SIR } from "./landingData";
import "./landing.css";

export default function Landing({ onStudent, onTeacher }) {
  return (
    <div className="qm">
      <header className="qm-hero">
        <div className="qm-brand">
          <span className="qm-logo">
            <Logo size={68} />
          </span>
          <div>
            <h1>
              Quiz Master <em>5</em>
            </h1>
            <p className="qm-ribbon">Learn · Practice · Excel</p>
          </div>
        </div>

        <div className="qm-scene" aria-hidden="true">
          <Sticker name="sun" width={62} className="qm-sun" eager />
          <Sticker name="school" width={150} className="qm-school" eager />
          <div className="qm-owl">
            <Sticker name="owl" width={128} eager />
          </div>
          <p className="qm-bubble-say">
            ඔබේ දැනුම
            <br />
            පරීක්ෂා කරමු!
          </p>
          <div className="qm-kids">
            <Sticker name="boy" width={98} eager />
            <Sticker name="girl" width={104} eager />
          </div>
        </div>
        <p className="qm-tagline">Grade 5 Scholarship Learning Platform</p>
      </header>

      <main className="qm-body">
        <button className="qm-start" onClick={onStudent}>
          <Sticker name="notebook" width={74} className="qm-start-art" eager />
          <span className="qm-start-text">
            <b>පරීක්ෂණයට යන්න</b>
            <small>ඔබේ දැනුම පරීක්ෂා කරන්න</small>
          </span>
          <span className="qm-play" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="34" height="34">
              <path d="M8 5.5v13l10.5-6.5z" fill="#fff" />
            </svg>
          </span>
        </button>

        <h2 className="qm-pill">
          <Icon name="star" /> ඉගෙනුම් විශේෂාංග <Icon name="star" />
        </h2>
        <ul className="qm-features">
          {FEATURES.map((f) => (
            <li key={f.text} className={"qm-feature " + f.tone}>
              <Sticker name={f.art} width={64} />
              <span>{f.text}</span>
            </li>
          ))}
        </ul>

        <section className="qm-try">
          <h2 className="qm-pill purple">උත්සාහ කරලා බලන්න</h2>
          <SampleQuestion onStudent={onStudent} />
        </section>
      </main>

      <section className="qm-champion" aria-label="Be a Quiz Champion">
        <Sticker name="tree" width={120} className="qm-tree" />
        <Sticker name="books" width={84} className="qm-books" />
        <div className="qm-sign">
          <span>Be a</span>
          <b>Quiz Champion!</b>
        </div>
        <Sticker name="trophy" width={70} className="qm-cup" />
        <div className="qm-pals">
          <Sticker name="frog" width={66} />
          <Sticker name="cat" width={64} />
          <Sticker name="puppy" width={68} />
          <Sticker name="turtle" width={66} />
        </div>
        <Sticker name="flowers" width={90} className="qm-flowers left" />
        <Sticker name="bush" width={110} className="qm-flowers right" />
      </section>

      <section className="qm-sir-wrap">
        <div className="qm-sir">
          <div className="qm-sir-photo">
            <img src={SIR.photo} alt={SIR.name} width="132" height="132" loading="lazy" />
            <Sticker name="grad-cap" width={58} className="qm-sir-cap" />
          </div>
          <div className="qm-sir-text">
            <p className="qm-sir-label">ඔබේ ගුරුතුමා</p>
            <h2>{SIR.name}</h2>
            <p className="qm-sir-short">{SIR.short} · 5 වසර ශිෂ්‍යත්ව පන්තිය</p>
            <div className="qm-sir-actions">
              <a className="qm-call" href={"tel:" + SIR.tel}>
                <Icon name="phone" />
                <span>{SIR.phone}</span>
              </a>
              <button className="qm-teacher" onClick={onTeacher}>
                <Icon name="lock" />
                <span>සර් පිවිසුම</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="qm-foot">
        <svg className="qm-foot-wave" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 22C60 4 120 34 200 18S330 2 400 16V40H0z" fill="#1d4ed8" />
          <path d="M0 30C80 14 150 40 230 26S350 14 400 24V40H0z" fill="#123a8c" />
        </svg>
        <div className="qm-foot-body">
          <span>
            <Icon name="star" /> Quiz Master 5
          </span>
          <span>Learn Today… Lead Tomorrow…</span>
          <span>© {new Date().getFullYear()} චාමර සර්ගේ 5 වසර ශිෂ්‍යත්ව පන්තිය</span>
        </div>
      </footer>

      <div className="qm-dock">
        <button className="qm-cta" onClick={onStudent}>
          පරීක්ෂණයට යන්න
        </button>
      </div>
    </div>
  );
}
