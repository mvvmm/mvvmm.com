import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://mvvmm.com",
  adapter: cloudflare({ imageService: "passthrough" }),
  session: false,
  integrations: [react()],
});
