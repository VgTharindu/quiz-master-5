// tabs පේළිය. items = tab නම් array එක, active = තෝරපු tab එකේ index එක
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
