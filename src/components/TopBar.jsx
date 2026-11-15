export default function TopBar({ left, right }) {
  return (
    <div className="bar row">
      <span>{left}</span>
      {right}
    </div>
  );
}
