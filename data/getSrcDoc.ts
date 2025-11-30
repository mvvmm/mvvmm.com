import type {
  Html,
  Hydra,
  Script,
  Strudel,
  Stylesheet,
} from "@/types/experience";
import { getErrorCaptureScript } from "./getErrorCaptureScript";

/**
 * Escapes content for safe embedding in HTML tags.
 * Prevents XSS by escaping sequences that could break out of tags.
 * Escapes closing script and style tags - we use string concatenation instead of
 * template literals to avoid needing to escape ${ and backticks.
 */
function escapeScriptContent(content: string): string {
  return content.replace(/<\/script>/gi, "<\\/script>");
}

/**
 * Escapes CSS content for safe embedding in style tags.
 * Prevents XSS by escaping sequences that could break out of style tags.
 */
function escapeStyleContent(content: string): string {
  return content.replace(/<\/style>/gi, "<\\/style>");
}

export const getSrcDoc = ({
  scripts,
  stylesheets,
  htmls,
  strudels = [],
  hydras = [],
}: {
  scripts: Script[];
  stylesheets: Stylesheet[];
  htmls: Html[];
  strudels?: Strudel[];
  hydras?: Hydra[];
}) => {
  // Note: strudels are intentionally excluded from the srcdoc.
  // They are handled separately in the client-side code via the Strudel REPL.
  const hasHydra = hydras.length > 0;
  const hydraCode = hasHydra
    ? "<script>\n" +
      "      (function() {\n" +
      "        function initHydra() {\n" +
      "          if (typeof Hydra !== 'undefined' && document.body) {\n" +
      "            new Hydra();\n" +
      hydras
        .map((hydra) => escapeScriptContent(hydra.contents.trim()))
        .join("\n") +
      "\n" +
      "          } else {\n" +
      "            // Wait for both Hydra library and DOM to be ready\n" +
      "            requestAnimationFrame(initHydra);\n" +
      "          }\n" +
      "        }\n" +
      "        \n" +
      "        if (document.readyState === 'loading') {\n" +
      "          document.addEventListener('DOMContentLoaded', initHydra);\n" +
      "        } else {\n" +
      "          initHydra();\n" +
      "        }\n" +
      "      })();\n" +
      "    </script>"
    : "";

  return `
  <!DOCTYPE html>
  <html>
    <head>
      ${stylesheets
        .map(
          (stylesheet) =>
            "<style>" + escapeStyleContent(stylesheet.contents) + "</style>"
        )
        .join("")}
    </head>
    <body>
      ${htmls.map((html) => `${html.contents}`).join("")}
      ${getErrorCaptureScript()}
      ${scripts
        .map(
          (script) =>
            "<script>" + escapeScriptContent(script.contents) + "</script>"
        )
        .join("")}
      ${hydraCode}
    </body>
  </html>
  `;
};
