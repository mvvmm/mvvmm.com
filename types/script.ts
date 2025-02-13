export type ScriptContents = string;

export type ScriptContext = {
  script: string;
  css: string;
  scale: number;
  srcDoc: string;
  updateScript: (script: string) => void;
};
