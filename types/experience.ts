export type File = Script | Stylesheet | Html | Strudel | Hydra;

export type ExperienceError = {
  message: string;
  filename: string;
  lineno: number;
  colno: number;
  stack: string | null;
};

export type ExperienceContext = {
  experience: Experience;
  editorRef: React.RefObject<HTMLDivElement | null>;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  activeFile: File;
  iframeScale: number;
  hiddenOpacity: React.RefObject<number>;
  iframeOpacity: number;
  isIframePaused: boolean;
  isIframeInView: boolean;
  isIframePlaying: boolean;
  isPointerEventsEnabled: boolean;
  isAudioContextSuspended: boolean;
  isAudioPaused: boolean;
  srcDoc: string;
  errors: ExperienceError[];
  toggleIframeOpacity: () => void;
  toggleIframePaused: () => void;
  setIframePaused: (paused: boolean) => void;
  setIframeInView: (inView: boolean) => void;
  togglePointerEvents: () => void;
  updateIframeOpacity: (opacity: number) => void;
  enableAudio: () => Promise<void>;
  toggleAudioPaused: () => void;
  updateExperience: ({
    fileName,
    updatedFileContents,
  }: {
    fileName: string;
    updatedFileContents: string;
  }) => void;
  updateActiveFile: ({ fileName }: { fileName: string }) => void;
  clearErrors: () => void;
  addError: (error: ExperienceError) => void;
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

export type Strudel = {
  contents: string;
  path: string;
  name: string;
};

export type Hydra = {
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
  strudels: Strudel[];
  hydras: Hydra[];
  fileNames: string[];
};
