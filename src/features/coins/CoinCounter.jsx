import { forwardRef } from "react";
import CoinIcon from "./CoinIcon";
import "./coins.css";

// The ref points at the icon so flying coins can aim at it.
const CoinCounter = forwardRef(function CoinCounter({ value }, ref) {
  return (
    <span className="coin-counter" aria-label={`රන් කාසි ${value ?? 0}`}>
      <span ref={ref} className="coin-counter-icon">
        <CoinIcon size={22} />
      </span>
      {/* Remounting on every change replays the bump animation. */}
      <b key={value} className="coin-counter-value">
        {value ?? 0}
      </b>
    </span>
  );
});

export default CoinCounter;
