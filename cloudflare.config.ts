import { bindings, defineConfig } from "cf/config";
import * as entrypoint from "@astrojs/cloudflare/entrypoints/server" with { type: "cf-worker" };

export default defineConfig(({ isPreview }) => ({
  worker: {
    name: "mvvmm-com",
    compatibilityDate: "2026-10-03",
    compatibilityFlags: ["nodejs_compat", "global_fetch_strictly_public"],
    entrypoint,
    domains: isPreview ? [] : ["mvvmm.com"],
    workersDev: true,
    env: {
      ASSETS: bindings.assets(),
    },
    assets: {
      notFoundHandling: "404-page",
    },
    observability: {
      enabled: true,
      logs: { enabled: true },
      traces: { enabled: true },
    },
  },
}));
