// සරල SVG icons. name එක අනුව අදාළ path එක ඇඳෙනවා
export default function Icon({ name }) {
  const P = {
    clock: (
      <>
        <circle cx="12" cy="13" r="8" fill="none" stroke="currentColor" strokeWidth="2.4" />
        <path d="M12 9v4l3 2M9 2h6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </>
    ),
    star: (
      <path
        d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"
        fill="currentColor"
      />
    ),
    trophy: (
      <path
        d="M7 3h10v5a5 5 0 0 1-10 0zM7 5H3v2a4 4 0 0 0 4 4M17 5h4v2a4 4 0 0 1-4 4M12 13v4M8 21h8M9 17h6v4H9z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    ),
    hourglass: (
      <path
        d="M6 2h12M6 22h12M7 2c0 5 10 6 10 10S7 17 7 22M17 2c0 5-10 6-10 10s10 5 10 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    ),
    phone: (
      <path
        fill="currentColor"
        d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"
      />
    ),
  };
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
      {P[name]}
    </svg>
  );
}
