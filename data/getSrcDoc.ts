import type { Html, Script, Stylesheet } from "@/types/experience";
import { getErrorCaptureScript } from "./getErrorCaptureScript";

export const getSrcDoc = ({
  scripts,
  stylesheets,
  htmls,
}: {
  scripts: Script[];
  stylesheets: Stylesheet[];
  htmls: Html[];
}) => {
  return `
  <html>
    ${htmls.map((html) => `${html.contents}`).join("")}
    ${getErrorCaptureScript()}
    ${scripts.map((script) => `<script>${script.contents}</script>`).join("")}
    ${stylesheets.map((stylesheet) => `<style>${stylesheet.contents}</style>`).join("")}
  </html>
  `;
};
