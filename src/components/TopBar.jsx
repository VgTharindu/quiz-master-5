// පිටුවේ උඩ තියෙන නිල් තීරුව. left සහ right කියන්නේ දෙපැත්තේ පෙන්වන දේ
export default function TopBar({ left, right }) {
  return (
    <div className="bar row">
      <span>{left}</span>
      {right}
    </div>
  );
}
