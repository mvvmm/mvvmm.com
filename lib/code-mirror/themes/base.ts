import { EditorView } from "@codemirror/view";

export const baseTheme = EditorView.baseTheme({
  ".cm-selectionLayer": {
    pointerEvents: "none",
    zIndex: "100",
    opacity: 0.5,
  },
  "&.cm-editor": {
    outline: "2px solid transparent",
    outlineOffset: "2px",
    background: "none",
  },
  "&.cm-content": {
    padding: "0",
  },
  ".cm-scroller": {
    fontFamily: `"Fira Code", monospace !important`,
  },
  "&.cm-focused .cm-cursor": {
    borderLeftWidth: "2px",
  },
  ".cm-foldGutter": {
    width: "1rem",
  },
  ".cm-panels": {
    position: "absolute !important",
    top: "0 !important",
    right: "50% !important",
    bottom: "auto !important",
  },
  ".cm-button": {
    background: "none",
    backgroundImage: "none !important",
  },
  ".cm-panels.cm-panels-top": { borderBottom: "2px solid !important" },
  ".cm-panels.cm-panels-bottom": { borderTop: "2px solid !important" },
  ".cm-searchMatch": {
    backgroundColor: "#72a1ff59",
    outline: "1px solid !important",
  },
  ".cm-matchingBracket, .cm-nonmatchingBracket": {
    outline: "1px solid !important",
  },
  ".cm-gutters": {
    border: "none !important",
    fontSize: "inherit",
  },
  ".cm-line": {
    padding: "0",
    width: "max-content",
  },
  ".cm-lineNumbers, .cm-activeLineGutter": {
    backgroundColor: "transparent",
    fontWeight: "bold",
  },
  ".fold-line": {
    fontWeight: "normal",
  },
  ".cm-foldPlaceholder": {
    border: "none !important",
  },
  ".cm-tooltip": {
    border: "1px solid !important",
  },
});
