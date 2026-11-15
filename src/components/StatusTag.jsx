import { STATUS_COLORS, STATUS_LABELS } from "@/constants/testStatus";

// "ඉදිරියට / දැන් පවතී / අවසන්" පාට ලේබලය
export default function StatusTag({ status }) {
  return (
    <span className="tag" style={{ background: STATUS_COLORS[status] }}>
      {STATUS_LABELS[status]}
    </span>
  );
}
