import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// කලින් login වෙච්ච ළමයෙක් app එක open කරද්දී, ළමයාගේ පැත්තේ JS කොටස් ප්‍රධාන file එකත් එක්කම
// එකවර download වෙන්න index.html එකට කුඩා script එකක් දානවා. නැත්නම් ප්‍රධාන file එක run වුණාට පස්සේ
// තමයි ඒවා ඉල්ලන්නේ, slow network එකක ඒකට අමතර round trip එකක් (තත්පර 1-2ක්) යනවා.
// අලුතෙන් එන කෙනෙක්ට (localStorage එකේ "me" නැති) මේ script එක කිසිවක් කරන්නේ නැහැ
function preloadStudentChunks() {
  return {
    name: "preload-student-chunks",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html, { bundle }) {
        const entry = Object.values(bundle).find(
          (c) => c.type === "chunk" && c.facadeModuleId?.endsWith("StudentApp.jsx"),
        );
        if (!entry) return html;
        // StudentApp chunk එක සහ ඒකට ඕන අනෙක් chunks (supabase වගේ) ඔක්කොම හොයනවා
        const files = new Set();
        const walk = (f) => {
          if (files.has(f)) return;
          files.add(f);
          bundle[f]?.imports?.forEach(walk);
        };
        walk(entry.fileName);
        const urls = JSON.stringify([...files].map((f) => "/" + f));
        const script = `<script>try{if(localStorage.getItem("me"))${urls}.forEach(function(u){var l=document.createElement("link");l.rel="modulepreload";l.href=u;l.crossOrigin="";document.head.appendChild(l)})}catch(e){}</script>`;
        return html.replace("</head>", script + "</head>");
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), preloadStudentChunks()],
  resolve: {
    // "@" කියන්නේ src folder එක. "../../lib/supabase" වෙනුවට "@/lib/supabase" ලියන්න පුළුවන්
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  build: {
    // අලුත් phone browsers වලට ගැළපෙන කුඩා code එකක් හදනවා
    target: "es2020",
    rollupOptions: {
      output: {
        // libraries වෙනම files වලට. අපේ code එක වෙනස් කරලා deploy කළාට ඒවා වෙනස් වෙන්නේ නැති නිසා
        // ළමයාගේ phone එකේ cache එකේ තියෙන එකම පාවිච්චි වෙනවා, ආයෙත් download කරන්න ඕන නැහැ
        manualChunks(id) {
          if (/node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return "react";
          if (id.includes("node_modules/@supabase")) return "supabase";
        },
      },
    },
  },
});
