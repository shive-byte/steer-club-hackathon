import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";
import { handleApiRequest } from "./src/lib/api-handler";

function devApiPlugin(): Plugin {
  return {
    name: "dev-api-routes",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/")) {
          return next();
        }
        let body: any = undefined;
        if (req.method !== "GET" && req.method !== "HEAD") {
          try {
            body = await new Promise((resolve, reject) => {
              let str = "";
              req.on("data", (c) => (str += c));
              req.on("end", () => {
                try {
                  resolve(str ? JSON.parse(str) : undefined);
                } catch (e) {
                  reject(e);
                }
              });
              req.on("error", reject);
            });
          } catch {
            body = undefined;
          }
        }

        try {
          const result = await handleApiRequest({
            url: req.url,
            method: req.method || "GET",
            body,
          });
          res.statusCode = result.status;
          for (const [k, v] of Object.entries(result.headers)) {
            res.setHeader(k, v);
          }
          res.end(JSON.stringify(result.data));
        } catch (err: any) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ success: false, error: "Saving is temporarily unavailable." }));
        }
      });
    },
  };
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
    prerender: {
      enabled: true,
    },
  },
  vite: {
    base: process.env.BASE_URL || "/",
    plugins: [devApiPlugin()],
  },
});


