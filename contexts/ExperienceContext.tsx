"use client";

import { getSrcDoc } from "@/data/getSrcDoc";
import {
  Experience,
  ExperienceContext,
  File,
  Script,
  Stylesheet,
} from "@/types/experience";
import { createContext, ReactNode, useContext, useState } from "react";

const experienceContext = createContext({} as ExperienceContext);

export const ExperienceProvider = ({
  experience,
  iframeScale = 1,
  children,
}: {
  experience: Experience;
  iframeScale?: number;
  children: Readonly<ReactNode>;
}) => {
  const [_experience, _setExperience] = useState(experience);
  const [_activeFileName, _setActiveFileName] = useState(
    experience.scripts[0].name,
  );
  const srcDoc = getSrcDoc({
    scripts: _experience.scripts,
    stylesheets: _experience.stylesheets,
  });

  const activeFile = (() => {
    switch (_activeFileName.substring(_activeFileName.lastIndexOf("."))) {
      case ".js":
        return (
          _experience.scripts.find(
            (script) => script.name === _activeFileName,
          ) || ({} as Script)
        );
      case ".css":
        return (
          _experience.stylesheets.find(
            (stylesheet) => stylesheet.name === _activeFileName,
          ) || ({} as Stylesheet)
        );
      default:
        return {} as File;
    }
  })();

  const updateExperience = ({
    fileName,
    updatedFileContents,
  }: {
    fileName: string;
    updatedFileContents: string;
  }) => {
    _setExperience((prev) => {
      switch (fileName.substring(fileName.lastIndexOf("."))) {
        case ".js":
          return {
            ...prev,
            scripts: prev.scripts.map((script) =>
              script.name === fileName
                ? { ...script, contents: updatedFileContents }
                : script,
            ),
          };
        case ".css":
          return {
            ...prev,
            stylesheets: prev.stylesheets.map((stylesheet) =>
              stylesheet.name === fileName
                ? { ...stylesheet, contents: updatedFileContents }
                : stylesheet,
            ),
          };
        default:
          return prev;
      }
    });
  };

  return (
    <experienceContext.Provider
      value={{
        experience: _experience,
        activeFile,
        srcDoc,
        iframeScale,
        updateExperience,
      }}
    >
      {children}
    </experienceContext.Provider>
  );
};

export const useExperience = () => {
  return useContext(experienceContext);
};
