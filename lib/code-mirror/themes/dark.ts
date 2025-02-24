import { dark } from "@/constants/colors";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { EditorView } from "@codemirror/view";
import { tags } from "@lezer/highlight";

const theme = EditorView.theme({
  "&": {
    color: dark.violet,
  },
  ".cm-content": {
    caretColor: dark.fuchsia,
  },
  "&.cm-focused .cm-cursor": { borderLeftColor: dark.lightgray4 },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection":
    { backgroundColor: dark.selection },
  ".cm-panels": { backgroundColor: dark.darkgray2, color: dark.lightgray3 },
  ".cm-button": {
    backgroundColor: dark.darkgray3,
    color: dark.lightgray2,
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
    backgroundColor: dark.darkgray1,
  },
  ".cm-matchingBracket, .cm-nonmatchingBracket": {
    color: dark.rose,
    backgroundColor: "#bad0f847 !important",
    outlineColor: "#515a6b !important",
  },
  ".cm-gutters": {
    background: "none",
    color: dark.darkgray4,
  },
  ".cm-lineNumbers": {
    backgroundColor: dark.darkgray1,
  },
  ".cm-activeLineGutter": {
    color: dark.lightgray4,
    backgroundColor: dark.darkgray1,
  },
  ".cm-fold": {
    color: dark.lightgray3,
    backgroundColor: dark.darkgray1,
  },
  ".cm-foldPlaceholder": {
    backgroundColor: "transparent",
    color: "#ddd",
  },
  ".cm-tooltip": {
    borderColor: "#181a1f",
    backgroundColor: dark.darkgray1,
  },
  ".cm-tooltip-autocomplete": {
    "& > ul > li[aria-selected]": {
      backgroundColor: dark.darkgray3,
      color: dark.lightgray1,
    },
  },
});

const highlight = HighlightStyle.define([
  { tag: tags.keyword, color: dark.violet },
  {
    tag: [tags.deleted, tags.character, tags.propertyName, tags.macroName],
    color: dark.red,
  },
  {
    tag: [tags.function(tags.variableName), tags.labelName],
    color: dark.sky,
  },
  {
    tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)],
    color: dark.amber,
  },
  {
    tag: [tags.definition(tags.name), tags.separator, tags.name],
    color: dark.lightgray3,
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
    color: dark.amber,
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
    color: dark.violet,
  },
  {
    tag: [tags.meta, tags.comment],
    color: dark.darkgray4,
    fontStyle: "italic",
  },
  { tag: tags.strong, fontWeight: "bold" },
  { tag: tags.emphasis, fontStyle: "italic" },
  { tag: tags.link, color: dark.lightgray4, textDecoration: "underline" },
  { tag: tags.heading, fontWeight: "bold", color: dark.red },
  {
    tag: [tags.atom, tags.bool, tags.special(tags.variableName)],
    color: dark.amber,
  },
  {
    tag: [tags.processingInstruction, tags.string, tags.inserted],
    color: dark.emerald,
  },
  { tag: tags.invalid, color: dark.lightgray1 },
]);

const darkHighlighting = syntaxHighlighting(highlight, { fallback: true });

export const darkTheme = [theme, darkHighlighting];
