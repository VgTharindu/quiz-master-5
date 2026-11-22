// Stickers in ./art are bundled with hashed names so they cache forever.
const files = import.meta.glob("./art/*.webp", { eager: true, query: "?url", import: "default" });
const ART = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.split("/").pop().replace(".webp", ""), url]),
);

// Decorative image: hidden from screen readers. `eager` is for artwork visible on first paint.
export default function Sticker({ name, width, className, eager = false }) {
  return (
    <img
      src={ART[name]}
      alt=""
      aria-hidden="true"
      className={className}
      width={width}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable="false"
    />
  );
}
