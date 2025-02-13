import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { EditorView } from "@codemirror/view";
import { tags } from "@lezer/highlight";

const rose = "#e11d48",
  pink = "#db2777",
  fuchsia = "#c026d3",
  purple = "#9333ea",
  violet = "#7c3aed",
  indigo = "#4f46e5",
  blue = "#2563eb",
  sky = "#0284c7",
  cyan = "#0891b2",
  teal = "#0d9488",
  emerald = "#059669",
  green = "#16a34a",
  lime = "#65a30d",
  yellow = "#ca8a04",
  amber = "#d97706",
  red = "#dc2626",
  lightgray1 = "#fafafa",
  lightgray2 = "#f4f4f5",
  lightgray3 = "#e4e4e7",
  lightgray4 = "#d4d4d8",
  darkgray4 = "#52525b",
  darkgray3 = "#3f3f46",
  darkgray2 = "#27272a",
  darkgray1 = "#18181b";

const theme = EditorView.theme({
  "&": {
    color: violet,
  },
  ".cm-content": {
    caretColor: fuchsia,
  },
  "&.cm-focused .cm-cursor": { borderLeftColor: darkgray1 },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection":
    { backgroundColor: darkgray4 },
  ".cm-panels": { backgroundColor: lightgray3, color: darkgray2 },
  ".cm-button": {
    backgroundColor: lightgray2,
    color: darkgray3,
  },
  ".cm-panels.cm-panels-top": { borderBottomColor: "white" },
  ".cm-panels.cm-panels-bottom": { borderTopColor: "white" },
  ".cm-searchMatch": {
    backgroundColor: "#72a1ff59",
    outlineColor: "#457dff",
  },
  ".cm-searchMatch.cm-searchMatch-selected": {
    backgroundColor: "#6199ff2f",
  },
  ".cm-line": {
    backgroundColor: lightgray2,
  },
  // ".cm-selectionMatch": { backgroundColor: "#aafe661a" },
  ".cm-matchingBracket, .cm-nonmatchingBracket": {
    color: rose,
    backgroundColor: "#bad0f847 !important",
    outlineColor: "#515a6b !important",
  },
  ".cm-gutters": {
    background: "none",
    color: lightgray1,
  },
  ".cm-lineNumbers": {
    backgroundColor: lightgray4,
  },
  ".cm-activeLineGutter": {
    color: darkgray1,
    backgroundColor: lightgray4,
  },
  ".cm-fold": {
    color: darkgray1,
    backgroundColor: lightgray2,
  },
  ".cm-foldPlaceholder": {
    backgroundColor: "transparent",
    color: "#ddd",
  },
  ".cm-tooltip": {
    borderColor: "#181a1f",
    backgroundColor: lightgray4,
  },
  ".cm-tooltip-autocomplete": {
    "& > ul > li[aria-selected]": {
      backgroundColor: lightgray2,
      color: darkgray4,
    },
  },
});

const highlight = HighlightStyle.define([
  { tag: tags.keyword, color: violet },
  {
    tag: [tags.deleted, tags.character, tags.propertyName, tags.macroName],
    color: red,
  },
  {
    tag: [tags.function(tags.variableName), tags.labelName],
    color: sky,
  },
  {
    tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)],
    color: amber,
  },
  {
    tag: [tags.definition(tags.name), tags.separator, tags.name],
    color: darkgray4,
  },
  {
    tag: [
      tags.typeName,
      tags.className,
      tags.number,
      tags.changed,
      tags.annotation,
      tags.modifier,
      tags.self,
      tags.namespace,
    ],
    color: amber,
  },
  {
    tag: [
      tags.operator,
      tags.operatorKeyword,
      tags.url,
      tags.escape,
      tags.regexp,
      tags.link,
      tags.special(tags.string),
    ],
    color: violet,
  },
  { tag: [tags.meta, tags.comment], color: darkgray4, fontStyle: "italic" },
  { tag: tags.strong, fontWeight: "bold" },
  { tag: tags.emphasis, fontStyle: "italic" },
  { tag: tags.link, color: lightgray4, textDecoration: "underline" },
  { tag: tags.heading, fontWeight: "bold", color: red },
  {
    tag: [tags.atom, tags.bool, tags.special(tags.variableName)],
    color: amber,
  },
  {
    tag: [tags.processingInstruction, tags.string, tags.inserted],
    color: emerald,
  },
  { tag: tags.invalid, color: lightgray1 },
]);

const lightHighliting = syntaxHighlighting(highlight, { fallback: true });

export const lightTheme = [theme, lightHighliting];
