export default function Icon({ name }) {
  const P = {
    star: (
      <path
        d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"
        fill="currentColor"
      />
    ),
    phone: (
      <path
        fill="currentColor"
        d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"
      />
    ),
    lock: (
      <>
        <rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor" />
        <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
      </>
    ),
  };
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
      {P[name]}
    </svg>
  );
}
