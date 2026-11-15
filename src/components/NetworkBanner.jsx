import { useOnline } from "@/hooks/useOnline";

export default function NetworkBanner() {
  const online = useOnline();
  if (online) return null;
  return (
    <div className="net-banner" role="status">
      📶 Internet සම්බන්ධතාවය නැත. ඔබේ පිළිතුරු සුරැකී ඇත, සම්බන්ධ වූ පසු ස්වයංක්‍රීයව යවනු ලැබේ.
    </div>
  );
}
