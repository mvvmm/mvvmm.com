import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

// Test the real builder without requiring Astro's alias resolution.
function moduleURL(source) {
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });
  return `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
}
const captureURL = moduleURL(
  await readFile(
    new URL("../data/getErrorCaptureScript.ts", import.meta.url),
    "utf8",
  ),
);
const source = await readFile(
  new URL("../data/getSrcDoc.ts", import.meta.url),
  "utf8",
);
const { getSrcDoc } = await import(
  moduleURL(
    source.replace('"./getErrorCaptureScript"', JSON.stringify(captureURL)),
  )
);
const file = (name, contents) => ({ name, contents, path: name });

test("classic scripts stay classic, import maps precede modules, and errors are captured", () => {
  const document = getSrcDoc({
    scripts: [
      file("legacy.js", "window.legacy = true;"),
      file(
        "scene.module.js",
        "import * as THREE from 'three'; await Promise.resolve();",
      ),
    ],
    stylesheets: [],
    htmls: [
      file(
        "scripts.html",
        '<script type="importmap">{"imports":{"three":"https://example.com/three.js"}}</script>',
      ),
    ],
  });
  assert.ok(document.includes("<script>window.legacy = true;</script>"));
  assert.ok(document.includes('<script type="module">import * as THREE'));
  assert.ok(
    document.indexOf('type="importmap"') < document.indexOf('type="module"'),
  );
  assert.ok(
    document.indexOf("window.onunhandledrejection") <
      document.indexOf('type="module"'),
  );
});

test("module contents cannot close the embedding script tag", () => {
  const document = getSrcDoc({
    scripts: [file("scene.module.js", 'const value = "</script>";')],
    stylesheets: [],
    htmls: [],
  });
  assert.ok(document.includes('const value = "<\\/script>";'));
  assert.ok(!document.includes('const value = "</script>";'));
});

test("Hydra initializes and Strudel stays outside the iframe", () => {
  const document = getSrcDoc({
    scripts: [],
    stylesheets: [],
    htmls: [],
    hydras: [file("scene.hydra.js", "osc(10).out();")],
    strudels: [file("scene.strudel.js", "STRUDEL_ONLY_SENTINEL")],
  });
  assert.ok(document.includes("new Hydra()"));
  assert.ok(document.includes("osc(10).out();"));
  assert.ok(!document.includes("STRUDEL_ONLY_SENTINEL"));
});
