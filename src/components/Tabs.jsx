export default function Tabs({ items, active, onChange }) {
  return (
    <div className="row tabs">
      {items.map((label, i) => (
        <button
          key={i}
          className={active === i ? "on" : ""}
          onClick={() => onChange(i)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
