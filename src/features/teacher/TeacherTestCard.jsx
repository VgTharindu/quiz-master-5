import StatusTag from "@/components/StatusTag";
import { getTestStatus } from "@/constants/testStatus";
import { formatDateTime } from "@/utils/format";

// සර්ගේ ලැයිස්තුවේ එක් පරීක්ෂණයක කාඩ් එක. click කළාම විස්තර පිටුව open වෙනවා
export default function TeacherTestCard({ test, onOpen }) {
  const status = getTestStatus(test);
  return (
    <div
      className={"card st" + status}
      style={{ cursor: "pointer" }}
      onClick={() => onOpen(test)}
    >
      <b style={{ fontSize: 18 }}>{test.name}</b> <StatusTag status={status} />
      <br />
      {test.grade} වසර · {formatDateTime(test.start_at)}
    </div>
  );
}
