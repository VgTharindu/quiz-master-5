import { formatCountdown, formatDateTime } from "@/utils/format";
import { ENDED, LIVE, UPCOMING, getTestStatus } from "@/constants/testStatus";
import { BookIcon, CalendarIcon, ChecklistIcon, ClockIcon, MedalIcon, TrophyIcon } from "./ui/icons";

const TILES = [
  ["yellow", TrophyIcon],
  ["pink", MedalIcon],
  ["green", ChecklistIcon],
  ["blue", BookIcon],
];

export default function StudentTestCard({ test, now, index = 0, onOpen }) {
  const start = new Date(test.start_at),
    end = new Date(test.end_at),
    status = getTestStatus(test, now);
  const [tone, Icon] = TILES[index % TILES.length];
  return (
    <article className={"st-test" + (status === LIVE ? " live" : "")}>
      <div className={"st-test-tile " + tone}>
        <Icon size={50} />
      </div>
      <div className="st-test-body">
        <h3>{test.name}</h3>
        <div className="st-test-when">
          <CalendarIcon /> {formatDateTime(start)} සිට
        </div>
        <div className="st-test-when">
          <ClockIcon /> {formatDateTime(end)} දක්වා
        </div>
        {status === UPCOMING && (
          <span className="st-chip amber">⏳ ආරම්භ වීමට {formatCountdown((start - now) / 1000)}</span>
        )}
        {status === LIVE && (
          <>
            <span className="st-chip green">● දැන් පවතී · අවසන් වීමට {formatCountdown((end - now) / 1000)}</span>
            <button className="st-pill green" onClick={() => onOpen(test, "test")}>
              ආරම්භ කරන්න ▶
            </button>
          </>
        )}
        {status === ENDED && (
          <button className="st-pill blue" onClick={() => onOpen(test, "result")}>
            ප්‍රතිඵල බලන්න
          </button>
        )}
      </div>
    </article>
  );
}
