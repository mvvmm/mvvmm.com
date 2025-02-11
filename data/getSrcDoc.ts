export const getSrcDoc = ({ script, css }: { script: string; css: string }) => {
  return `
  <html>
    <script src="https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.js">
    </script>
    <style>${css}</style>
    <script>${script}</script>
  <html>
  `;
};
