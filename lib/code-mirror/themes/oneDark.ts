import { syntaxHighlighting } from "@codemirror/language";
import {
  oneDarkTheme as _oneDarkTheme,
  oneDarkHighlightStyle,
} from "@codemirror/theme-one-dark";

const oneDarkHighlighting = syntaxHighlighting(oneDarkHighlightStyle, {
  fallback: true,
});

export const oneDarkTheme = [_oneDarkTheme, oneDarkHighlighting];
