import { forwardRef } from "react";
import CoinCounter from "@/features/coins/CoinCounter";
import { KidAvatar } from "./icons";
import { CloudEdge, Sparkles } from "./Decor";

// Blue student header: avatar, name and grade, coin total.
// The ref points at the coin icon so the coin animation can fly into it.
const StudentHeader = forwardRef(function StudentHeader({ me, coins, onExit }, coinRef) {
  return (
    <header className="st-head">
      <Sparkles />
      <div className="st-head-inner">
        <KidAvatar size={66} />
        <div className="st-head-name">
          <b>{me.name}</b>
          <span>{me.grade} වසර</span>
        </div>
        <div className="st-head-side">
          <CoinCounter ref={coinRef} value={coins} />
          {onExit && (
            <button className="st-link" onClick={onExit}>
              ඉවත් වන්න
            </button>
          )}
        </div>
      </div>
      <CloudEdge />
    </header>
  );
});

export default StudentHeader;
