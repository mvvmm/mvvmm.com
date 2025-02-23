import { Script, Stylesheet } from "@/types/experience";

export const getSrcDoc = ({
  scripts,
  stylesheets,
}: {
  scripts: Script[];
  stylesheets: Stylesheet[];
}) => {
  return `
  <html>
    <script src="https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.js"></script>
    ${scripts.map((script) => `<script>${script.contents}</script>`).join("")}
    ${stylesheets.map((stylesheet) => `<style>${stylesheet.contents}</style>`).join("")}
  <html>
  `;
};
