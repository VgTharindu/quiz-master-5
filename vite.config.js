import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Injects a tiny inline script that modulepreloads the student chunks alongside the entry file,
// so tapping "start" does not wait for a download. Returning students (localStorage "me" is set)
// get them at high priority; new visitors at low priority, after the landing page artwork.
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
        const files = new Set();
        const walk = (f) => {
          if (files.has(f)) return;
          files.add(f);
          bundle[f]?.imports?.forEach(walk);
        };
        walk(entry.fileName);
        const urls = JSON.stringify([...files].map((f) => "/" + f));
        const script = `<script>try{var r=localStorage.getItem("me");${urls}.forEach(function(u){var l=document.createElement("link");l.rel="modulepreload";l.href=u;l.crossOrigin="";if(!r)l.fetchPriority="low";document.head.appendChild(l)})}catch(e){}</script>`;
        return html.replace("</head>", script + "</head>");
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), preloadStudentChunks()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) }, // "@/lib/supabase" -> src/lib/supabase
  },
  build: {
    target: "es2020",
    rollupOptions: {
      output: {
        // Vendor chunks rarely change, so they stay cached on phones across deploys.
        manualChunks(id) {
          if (/node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return "react";
          if (id.includes("node_modules/@supabase")) return "supabase";
        },
      },
    },
  },
});
