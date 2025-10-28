export type File = Script | Stylesheet | Html;

export type ExperienceContext = {
  experience: Experience;
  editorRef: React.RefObject<HTMLDivElement | null>;
  activeFile: File;
  iframeScale: number;
  hiddenOpacity: React.RefObject<number>;
  iframeOpacity: number;
  isIframePlaying: boolean;
  isPointerEventsEnabled: boolean;
  srcDoc: string;
  toggleIframeOpacity: () => void;
  toggleIframePlaying: () => void;
  setIframePlaying: (playing: boolean) => void;
  togglePointerEvents: () => void;
  updateIframeOpacity: (opacity: number) => void;
  updateExperience: ({
    fileName,
    updatedFileContents,
  }: {
    fileName: string;
    updatedFileContents: string;
  }) => void;
  updateActiveFile: ({ fileName }: { fileName: string }) => void;
};

export type Script = {
  contents: string;
  path: string;
  name: string;
};

export type Stylesheet = {
  contents: string;
  path: string;
  name: string;
};

export type Html = {
  contents: string;
  path: string;
  name: string;
};

export type Experience = {
  path: string;
  name: string;
  scripts: Script[];
  stylesheets: Stylesheet[];
  htmls: Html[];
  fileNames: string[];
};
