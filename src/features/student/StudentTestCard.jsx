import { formatCountdown, formatDateTime } from "@/utils/format";
import { ENDED, LIVE, UPCOMING, getTestStatus } from "@/constants/testStatus";

// ළමයාගේ ලැයිස්තුවේ එක් පරීක්ෂණයක කාඩ් එක
export default function StudentTestCard({ test, now, onOpen }) {
  const start = new Date(test.start_at),
    end = new Date(test.end_at),
    status = getTestStatus(test, now);
  return (
    <div className={"card st" + status}>
      <b style={{ fontSize: 19 }}>{test.name}</b>
      <br />
      <small>
        {formatDateTime(start)} සිට {formatDateTime(end)} දක්වා
      </small>
      <br />
      {status === UPCOMING && (
        <span className="tag" style={{ background: "#ca8a04" }}>
          ⏳ ආරම්භ වීමට: {formatCountdown((start - now) / 1000)}
        </span>
      )}
      {status === LIVE && (
        <>
          <span className="tag" style={{ background: "#16a34a" }}>
            ● දැන් පවතී
          </span>
          <br />
          <span className="tag" style={{ background: "#1d4ed8", marginTop: 6 }}>
            අවසන් වීමට: {formatCountdown((end - now) / 1000)}
          </span>
          <button
            className="g"
            style={{ marginTop: 10, width: "100%" }}
            onClick={() => onOpen(test, "test")}
          >
            පරීක්ෂණය ආරම්භ කරන්න ▶
          </button>
        </>
      )}
      {status === ENDED && (
        <button
          className="w"
          style={{ marginTop: 8, width: "100%" }}
          onClick={() => onOpen(test, "result")}
        >
          ප්‍රතිඵල බලන්න
        </button>
      )}
    </div>
  );
}
