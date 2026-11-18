import Logo from "@/components/Logo";
import { formatDateTime } from "@/utils/format";
import "./reportSheet.css";

// Shared A4 layout for every PDF export.
export default function ReportSheet({ title, subtitle, children }) {
  return (
    <div className="rs">
      <header className="rs-head" data-pdf-block>
        <div className="rs-brand">
          <Logo size={54} />
          <div>
            <div className="rs-brand-name">
              QUIZ MASTER <em>5</em>
            </div>
            <div className="rs-brand-sub">Grade 5 Scholarship Learning Platform · චාමර සර්</div>
          </div>
        </div>
        <div className="rs-title">
          <h1>{title}</h1>
          {subtitle && <div>{subtitle}</div>}
        </div>
      </header>
      {children}
      <footer className="rs-foot" data-pdf-block>
        සකස් කළේ: {formatDateTime(new Date())} · QUIZ MASTER 5
      </footer>
    </div>
  );
}

export function SheetStats({ items }) {
  return (
    <div className="rs-stats" data-pdf-block>
      {items.map(([label, value]) => (
        <div key={label}>
          <b>{value}</b>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
