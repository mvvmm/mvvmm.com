export type ScriptContents = string;

export type ScriptContext = {
  script: string;
  css: string;
  srcDoc: string;
  updateScript: (script: string) => void;
};
