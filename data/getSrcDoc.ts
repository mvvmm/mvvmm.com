import { Html, Script, Stylesheet } from "@/types/experience";

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
    ${scripts.map((script) => `<script>${script.contents}</script>`).join("")}
    ${stylesheets.map((stylesheet) => `<style>${stylesheet.contents}</style>`).join("")}
  <html>
  `;
};
