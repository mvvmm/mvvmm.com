"use client";

import { javascript } from "@codemirror/lang-javascript";
import type { ViewUpdate } from "@codemirror/view";
import { EditorView } from "codemirror";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { getSrcDoc } from "@/data/getSrcDoc";
import { setup } from "@/lib/code-mirror/setup";
import { baseTheme } from "@/lib/code-mirror/themes/base";
import { darkTheme } from "@/lib/code-mirror/themes/dark";
import type {
  Experience,
  ExperienceContext,
  ExperienceError,
  File,
  Script,
  Stylesheet,
} from "@/types/experience";

const DEBOUNCE_THRESHOLD = 500; // ms

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
  const editorRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [_experience, _setExperience] = useState(experience);
  const [_activeFileName, _setActiveFileName] = useState(
    experience.scripts[0].name,
  );
  const [iframeOpacity, setIframeOpacity] = useState(1);
  const hiddenOpacity = useRef(0.25);
  const [isIframePaused, setIsIframePaused] = useState(false);
  const [isIframeInView, setIsIframeInView] = useState(false);
  const [isPointerEventsEnabled, setIsPointerEventsEnabled] = useState(true);
  const [errors, setErrors] = useState<ExperienceError[]>([]);

  const isIframePlaying = !isIframePaused && isIframeInView;

  const toggleIframePaused = () => {
    setIsIframePaused((prev) => !prev);
  };

  const setIframePaused = (paused: boolean) => {
    setIsIframePaused(paused);
  };

  const setIframeInView = (inView: boolean) => {
    setIsIframeInView(inView);
  };

  const togglePointerEvents = () => {
    setIsPointerEventsEnabled((prev) => !prev);
  };

  const toggleIframeOpacity = () => {
    if (iframeOpacity === 1) {
      setIframeOpacity(hiddenOpacity.current);
    } else {
      hiddenOpacity.current = iframeOpacity;
      setIframeOpacity(1);
    }
  };

  const updateIframeOpacity = (opacity: number) => {
    setIframeOpacity(opacity);
  };

  const srcDoc = getSrcDoc({
    scripts: _experience.scripts,
    stylesheets: _experience.stylesheets,
    htmls: _experience.htmls,
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
      case ".html":
        return (
          _experience.htmls.find((html) => html.name === _activeFileName) ||
          ({} as Stylesheet)
        );
      default:
        return {} as File;
    }
  })();

  const updateActiveFile = ({ fileName }: { fileName: string }) => {
    _setActiveFileName(fileName);
  };

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const addError = useCallback((error: ExperienceError) => {
    setErrors((prev) => [...prev, error]);
  }, []);

  const updateExperience = useCallback(
    ({
      fileName,
      updatedFileContents,
    }: {
      fileName: string;
      updatedFileContents: string;
    }) => {
      // Clear errors when code is updated
      clearErrors();

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
          case ".html":
            return {
              ...prev,
              htmls: prev.htmls.map((html) =>
                html.name === fileName
                  ? { ...html, contents: updatedFileContents }
                  : html,
              ),
            };
          default:
            return prev;
        }
      });
    },
    [clearErrors],
  );

  // Update iframe content
  // biome-ignore lint/correctness/useExhaustiveDependencies: just want to update the editor when the active file changes
  useEffect(() => {
    if (!editorRef.current) return;

    const updateListener = EditorView.updateListener.of((v: ViewUpdate) => {
      if (v.docChanged) {
        const newCode = v.state.doc.toString();

        // Clear the previous timeout
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        // Set a new timeout
        timeoutRef.current = setTimeout(() => {
          updateExperience({
            fileName: activeFile.name,
            updatedFileContents: newCode,
          });
        }, DEBOUNCE_THRESHOLD);
      }
    });

    const view = new EditorView({
      doc: activeFile.contents,
      extensions: [
        ...setup,
        javascript(),
        baseTheme,
        // ...oneDarkTheme,
        ...darkTheme,

        updateListener,
      ],
      parent: editorRef.current,
    });

    return () => view.destroy(); // Cleanup on unmount
  }, [activeFile.name]);

  return (
    <experienceContext.Provider
      value={{
        experience: _experience,
        editorRef,
        iframeRef,
        activeFile,
        iframeOpacity,
        hiddenOpacity,
        isIframePaused,
        isIframeInView,
        isIframePlaying,
        isPointerEventsEnabled,
        srcDoc,
        iframeScale,
        errors,
        toggleIframeOpacity,
        updateIframeOpacity,
        toggleIframePaused,
        setIframePaused,
        setIframeInView,
        togglePointerEvents,
        updateExperience,
        updateActiveFile,
        clearErrors,
        addError,
      }}
    >
      {children}
    </experienceContext.Provider>
  );
};

export const useExperience = () => {
  return useContext(experienceContext);
};
