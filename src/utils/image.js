// Downscale to 800px and re-encode as JPEG so uploads stay small for students on mobile data.
export async function compressImage(file, max = 800) {
  const bm = await createImageBitmap(file),
    r = Math.min(1, max / Math.max(bm.width, bm.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bm.width * r);
  c.height = Math.round(bm.height * r);
  c.getContext("2d").drawImage(bm, 0, 0, c.width, c.height);
  return new Promise((res) => c.toBlob((b) => res(b), "image/jpeg", 0.7));
}
