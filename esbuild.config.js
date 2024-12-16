import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["./src/index.ts"],
  bundle: true,
  minify: true,
  format: "esm",
  platform: "node",
  target: "node20",
  outfile: "./dist/index.js",
  external: ["aws-sdk", "@aws-sdk/*", "buffer", "crypto", "util"],
  banner: {
    js: `
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
    `,
  },
});
