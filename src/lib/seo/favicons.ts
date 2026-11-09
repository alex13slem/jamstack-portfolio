import type { Options } from "astro-favicons";

export const faviconOptions = {
  input: "public/favicon.svg",
  name: "alex13slem",
  short_name: "alex13slem",
  withCapo: false,
  icons: {
    favicons: true,
    appleIcon: ["apple-touch-icon.png"],
    android: false,
    appleStartup: false,
    windows: false,
    yandex: false,
  },
  output: { images: true, files: false, html: true },
} satisfies Options;
