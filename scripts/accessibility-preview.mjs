// Local acceptance fixture. Never imported by the site or included in dist.
// Run after npm run build: node scripts/accessibility-preview.mjs
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";

const root = resolve("dist");
const basePort = Number(process.argv[2] ?? 4350);
console.log(`Local QA process: ${process.pid}`);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};
const forcedMotion = `<script>
  const originalMatchMedia = window.matchMedia.bind(window);
  window.matchMedia = (query) => {
    const media = originalMatchMedia(query);
    if (/prefers-reduced-motion/.test(query)) {
      Object.defineProperty(media, 'matches', { value: !query.includes('no-preference') });
      document.documentElement.dataset.qaMotionQueries = String(Number(document.documentElement.dataset.qaMotionQueries || 0) + 1);
      document.documentElement.dataset.qaAppMotion = String(media.matches);
    }
    return media;
  };
  document.documentElement.dataset.qaMotion = 'forced-reduce';
</script>`;
const noWebGL = `<script>
  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function(type, ...args) {
    if (/^(webgl2?|experimental-webgl)$/.test(type)) {
      document.documentElement.dataset.qaBlockedContexts = String(Number(document.documentElement.dataset.qaBlockedContexts || 0) + 1);
      return null;
    }
    return originalGetContext.call(this, type, ...args);
  };
</script>`;

// A deterministic API rejection exercises error feedback even when browser
// automation grants clipboard access independently of Permissions-Policy.
const clipboardDenied = `<script>
  Object.defineProperty(navigator.clipboard, 'writeText', {
    value: async () => { throw new DOMException('Clipboard denied by QA fixture', 'NotAllowedError'); }
  });
</script>`;

for (const [index, mode] of [
  "normal",
  "no-js",
  "no-webgl",
  "reduced-motion",
  "no-clipboard",
].entries()) {
  createServer(async (req, res) => {
    try {
      let file = resolve(
        root,
        "." + decodeURIComponent(new URL(req.url, "http://localhost").pathname),
      );
      if (file !== root && !file.startsWith(root + sep)) {
        res.writeHead(403).end();
        return;
      }
      if (!extname(file)) file = resolve(file, "index.html");
      let data = await readFile(file);
      const extension = extname(file);
      if (mode === "no-js")
        res.setHeader(
          "Content-Security-Policy",
          "script-src 'none'; object-src 'none'",
        );
      if (mode === "no-clipboard")
        res.setHeader("Permissions-Policy", "clipboard-write=()");
      if (extension === ".html") {
        const fixture =
          mode === "no-webgl"
            ? noWebGL
            : mode === "reduced-motion"
              ? forcedMotion
              : mode === "no-clipboard"
                ? clipboardDenied
                : "";
        data = Buffer.from(
          data
            .toString()
            .replace(
              "<head>",
              `<head><meta name="qa-mode" content="${mode}">${fixture}`,
            ),
        );
      }
      // Exercise the real reduced-motion declarations and JS branch. This is
      // forced test input, not native OS/browser preference emulation.
      if (mode === "reduced-motion" && [".html", ".css"].includes(extension)) {
        data = Buffer.from(
          data
            .toString()
            .replace(
              /\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/g,
              "(min-width: 0px)",
            )
            .replace(
              /\(\s*prefers-reduced-motion\s*:\s*no-preference\s*\)/g,
              "(max-width: -1px)",
            ),
        );
      }
      res
        .writeHead(200, {
          "Content-Type": types[extension] || "application/octet-stream",
          "Cache-Control": "no-store",
        })
        .end(data);
    } catch {
      res.writeHead(404).end("Not found");
    }
  }).listen(basePort + index, "127.0.0.1", () =>
    console.log(`${mode}: http://127.0.0.1:${basePort + index}`),
  );
}
