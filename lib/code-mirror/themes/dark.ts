import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { EditorView } from "@codemirror/view";
import { tags } from "@lezer/highlight";

const rose = "#fb7185",
  pink = "#f472b6",
  fuchsia = "#e879f9",
  purple = "#c084fc",
  violet = "#a78bfa",
  indigo = "#818cf8",
  blue = "#60a5fa",
  sky = "#38bdf8",
  cyan = "#22d3ee",
  teal = "#2dd4bf",
  emerald = "#34d399",
  green = "#4ade80",
  lime = "#a3e635",
  yellow = "#facc15",
  amber = "#fbbf24",
  red = "#f87171",
  lightgray1 = "#fafafa",
  lightgray2 = "#f4f4f5",
  lightgray3 = "#e4e4e7",
  lightgray4 = "#d4d4d8",
  darkgray4 = "#52525b",
  darkgray3 = "#3f3f46",
  darkgray2 = "#27272a",
  darkgray1 = "#18181b",
  selection = "rgba(82, 82, 91, .8)"; // darkgray4

const theme = EditorView.theme({
  "&": {
    color: violet,
  },
  ".cm-content": {
    caretColor: fuchsia,
  },
  "&.cm-focused .cm-cursor": { borderLeftColor: lightgray4 },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection":
    { backgroundColor: selection },
  ".cm-panels": { backgroundColor: darkgray2, color: lightgray3 },
  ".cm-button": {
    backgroundColor: darkgray3,
    color: lightgray2,
  },
  ".cm-panels.cm-panels-top": { borderBottomColor: "black" },
  ".cm-panels.cm-panels-bottom": { borderTopColor: "black" },
  ".cm-searchMatch": {
    backgroundColor: "#72a1ff59",
    outlineColor: "#457dff",
  },
  ".cm-searchMatch.cm-searchMatch-selected": {
    backgroundColor: "#6199ff2f",
  },
  ".cm-line": {
    backgroundColor: darkgray1,
  },
  ".cm-matchingBracket, .cm-nonmatchingBracket": {
    color: rose,
    backgroundColor: "#bad0f847 !important",
    outlineColor: "#515a6b !important",
  },
  ".cm-gutters": {
    background: "none",
    color: darkgray4,
  },
  ".cm-lineNumbers": {
    backgroundColor: darkgray1,
  },
  ".cm-activeLineGutter": {
    color: lightgray4,
    backgroundColor: darkgray1,
  },
  ".cm-fold": {
    color: lightgray3,
    backgroundColor: darkgray1,
  },
  ".cm-foldPlaceholder": {
    backgroundColor: "transparent",
    color: "#ddd",
  },
  ".cm-tooltip": {
    borderColor: "#181a1f",
    backgroundColor: darkgray1,
  },
  ".cm-tooltip-autocomplete": {
    "& > ul > li[aria-selected]": {
      backgroundColor: darkgray3,
      color: lightgray1,
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
    color: lightgray3,
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
      tags.literal,
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

const darkHighlighting = syntaxHighlighting(highlight, { fallback: true });

export const darkTheme = [theme, darkHighlighting];
