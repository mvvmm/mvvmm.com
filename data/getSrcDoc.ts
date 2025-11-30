import type { Html, Script, Strudel, Stylesheet } from "@/types/experience";
import { getErrorCaptureScript } from "./getErrorCaptureScript";

export const getSrcDoc = ({
  scripts,
  stylesheets,
  htmls,
  strudels = [],
}: {
  scripts: Script[];
  stylesheets: Stylesheet[];
  htmls: Html[];
  strudels?: Strudel[];
}) => {
  // Note: strudels are intentionally excluded from the srcdoc.
  // They are handled separately in the client-side code via the Strudel REPL.
  return `
  <html>
    ${htmls.map((html) => `${html.contents}`).join("")}
    ${getErrorCaptureScript()}
    ${scripts.map((script) => `<script>${script.contents}</script>`).join("")}
    ${stylesheets
      .map((stylesheet) => `<style>${stylesheet.contents}</style>`)
      .join("")}
  </html>
  `;
};
