// Image files dropped into ../art/ are picked up at build time (no 404s for missing ones).
const files = import.meta.glob("../art/*.{webp,png,jpg,jpeg,svg}", {
  eager: true,
  query: "?url",
  import: "default",
});
const ART = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.split("/").pop().replace(/\.\w+$/, ""), url]),
);

export const hasArt = (name) => Boolean(ART[name]);

// Shows art/<name>.* when it exists, otherwise the drawn SVG fallback.
// fit="cover" fills the box (e.g. a round avatar); the default keeps the whole image visible.
export default function Art({ name, size, width, height, fallback, className, fit = "contain", position }) {
  const url = ART[name];
  if (!url) return fallback;
  return (
    <img
      src={url}
      alt=""
      aria-hidden="true"
      className={className}
      width={width ?? size}
      height={height ?? size}
      decoding="async"
      loading="lazy"
      style={{ display: "block", objectFit: fit, objectPosition: position, maxWidth: "100%", height: "auto" }}
    />
  );
}
