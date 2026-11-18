import CoinIcon from "@/features/coins/CoinIcon";

export default function CoinValue({ value, size = 16 }) {
  return (
    <span className="coin-value">
      <CoinIcon size={size} />
      <b>{value ?? "–"}</b>
    </span>
  );
}
