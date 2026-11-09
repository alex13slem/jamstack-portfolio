import type { Options } from "astro-favicons";

export const faviconOptions = {
  input: "public/favicon.svg",
  name: "alex13slem",
  short_name: "alex13slem",
  withCapo: false,
  icons: {
    favicons: [
      {
        name: "favicon.ico",
        transparent: true,
        rotate: false,
        sizes: [
          { width: 16, height: 16 },
          { width: 32, height: 32 },
        ],
      },
      "favicon-16x16.png",
      "favicon-32x32.png",
      "favicon-48x48.png",
      "favicon.svg",
    ],
    appleIcon: ["apple-touch-icon.png"],
    android: false,
    appleStartup: false,
    windows: false,
    yandex: false,
  },
  output: { images: true, files: false, html: true },
} satisfies Options;
