import { useEffect, useState } from "react";

// phone එක internet එකට සම්බන්ධද කියලා දන්වනවා. සම්බන්ධතාවය නැති වුණාම / ආපහු ආවම browser එක event එකක් යවනවා
export function useOnline() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true),
      off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  return online;
}
