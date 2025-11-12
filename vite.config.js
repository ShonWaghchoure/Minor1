import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { readFile } from "node:fs/promises";

const BASE_ACCOUNT_CONSTANTS_REGEX =
  /@base-org\/account[/\\]dist[/\\]core[/\\]constants\.js$/;

const replaceJsonImportAttributes = (code) =>
  code.includes("with { type: 'json' }")
    ? code.replace("with { type: 'json' }", "assert { type: 'json' }")
    : null;

const baseAccountEsbuildFix = () => ({
  name: "base-account-json-import-fix",
  setup(build) {
    build.onLoad({ filter: BASE_ACCOUNT_CONSTANTS_REGEX }, async (args) => {
      const contents = await readFile(args.path, "utf8");
      const transformed = replaceJsonImportAttributes(contents);

      if (!transformed) {
        return undefined;
      }

      return {
        contents: transformed,
        loader: "js",
      };
    });
  },
});

const baseAccountViteFix = () => ({
  name: "vite-base-account-json-import-fix",
  enforce: "pre",
  transform(code, id) {
    if (!BASE_ACCOUNT_CONSTANTS_REGEX.test(id)) {
      return null;
    }

    const transformed = replaceJsonImportAttributes(code);
    return transformed ?? null;
  },
});

// ✅ Full configuration for React + Privy + Clerk + ethers.js
export default defineConfig({
  plugins: [baseAccountViteFix(), react()],

  // Fix for Node built-ins (Buffer, process, etc.) when using ethers in browser
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      plugins: [
        baseAccountEsbuildFix(),
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
      ],
    },
  },

  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },

  // Optional: resolves "with { type: 'json' }" issues from Privy dependencies
  resolve: {
    alias: {
      // Ensure compatibility if needed later
      buffer: "buffer/",
    },
  },

  // Optional: remove overlay error popup
  server: {
    hmr: {
      overlay: true, // set to false if you want to hide error overlay
    },
  },
});
