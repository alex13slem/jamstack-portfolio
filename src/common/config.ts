import rawConfig from "./config.json";
import { SiteConfigSchema } from "@/lib/schemas/site";

// Validate CMS settings once, with field paths in any build-time error.
const config = SiteConfigSchema.parse(rawConfig);
export default config;
