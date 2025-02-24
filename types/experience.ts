export type File = Script | Stylesheet;

export type ExperienceContext = {
  experience: Experience;
  activeFile: File;
  iframeScale: number;
  srcDoc: string;
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

export type Experience = {
  path: string;
  name: string;
  scripts: Script[];
  stylesheets: Stylesheet[];
  fileNames: string[];
};
