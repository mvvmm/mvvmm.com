"use client";

import { javascript } from "@codemirror/lang-javascript";
import type { ViewUpdate } from "@codemirror/view";
import {
  highlightExtension,
  highlightMiniLocations,
  updateMiniLocations,
} from "@strudel/codemirror";
import { repl } from "@strudel/core";
import { Drawer } from "@strudel/draw";
import { transpiler } from "@strudel/transpiler";
import { getAudioContext, webaudioOutput } from "@strudel/webaudio";
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
import { prebake } from "@/lib/strudel/prebake";
import type {
  Experience,
  ExperienceContext,
  ExperienceError,
  File,
  Html,
  Hydra,
  Script,
  Stylesheet,
} from "@/types/experience";

const DEBOUNCE_THRESHOLD = 500; // ms

const experienceContext = createContext({} as ExperienceContext);

export const ExperienceProvider = ({
  experience,
  iframeScale = 1,
  disableAudio = false,
  children,
}: {
  experience: Experience;
  iframeScale?: number;
  disableAudio?: boolean;
  children: Readonly<ReactNode>;
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const strudelReplRef = useRef<any>(null);
  const prebakePromiseRef = useRef<Promise<void> | null>(null);
  const editorViewRef = useRef<EditorView | null>(null);
  const drawerRef = useRef<any>(null);
  const lastStrudelCodeRef = useRef<string>("");
  const shouldRestartDrawerRef = useRef<boolean>(false);
  const lastEditorViewRef = useRef<EditorView | null>(null);

  const [_experience, _setExperience] = useState(experience);
  const [_activeFileName, _setActiveFileName] = useState(
    experience.strudels?.[0]?.name ||
      experience.hydras?.[0]?.name ||
      experience.scripts[0]?.name ||
      experience.stylesheets[0]?.name ||
      experience.htmls[0]?.name ||
      ""
  );
  const [iframeOpacity, setIframeOpacity] = useState(1);
  const hiddenOpacity = useRef(0.25);
  const [isIframePaused, setIsIframePaused] = useState(false);
  const [isIframeInView, setIsIframeInView] = useState(true); // Start as true so things play immediately
  const [isPointerEventsEnabled, setIsPointerEventsEnabled] = useState(true);
  const [errors, setErrors] = useState<ExperienceError[]>([]);
  const [strudelReplReady, setStrudelReplReady] = useState(false);
  const [isAudioContextSuspended, setIsAudioContextSuspended] = useState(false);
  const [isAudioPaused, setIsAudioPaused] = useState(false);

  const isIframePlaying = !isIframePaused && isIframeInView;

  const enableAudio = useCallback(async () => {
    try {
      const audioContext = getAudioContext();
      await audioContext.resume();
      setIsAudioContextSuspended(false);
    } catch (error) {
      console.error("[Audio] Failed to resume AudioContext:", error);
    }
  }, []);

  const toggleAudioPaused = useCallback(async () => {
    const newPaused = !isAudioPaused;
    setIsAudioPaused(newPaused);
    // If unpausing, also try to resume AudioContext
    if (!newPaused) {
      await enableAudio();
    }
  }, [enableAudio, isAudioPaused]);

  const toggleIframePaused = useCallback(async () => {
    const newPaused = !isIframePaused;
    setIsIframePaused(newPaused);
    // If unpausing, also try to resume AudioContext
    if (!newPaused) {
      await enableAudio();
    }
  }, [enableAudio, isIframePaused]);

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
    strudels: _experience.strudels || [],
    hydras: _experience.hydras || [],
  });

  const activeFile = (() => {
    // Ensure we have a valid file name
    if (!_activeFileName) {
      // Fallback to first available file
      return (
        _experience.strudels?.[0] ||
        _experience.hydras?.[0] ||
        _experience.scripts[0] ||
        _experience.stylesheets[0] ||
        _experience.htmls[0] ||
        ({ name: "", contents: "", path: "" } as File)
      );
    }

    // Check for .strudel.js first
    if (_activeFileName.endsWith(".strudel.js")) {
      return (
        _experience.strudels?.find(
          (strudel) => strudel.name === _activeFileName
        ) || ({ name: "", contents: "", path: "" } as File)
      );
    }

    // Check for .hydra.js
    if (_activeFileName.endsWith(".hydra.js")) {
      return (
        _experience.hydras?.find((hydra) => hydra.name === _activeFileName) ||
        ({ name: "", contents: "", path: "" } as File)
      );
    }

    switch (_activeFileName.substring(_activeFileName.lastIndexOf("."))) {
      case ".js":
        return (
          _experience.scripts.find(
            (script) => script.name === _activeFileName
          ) || ({ name: "", contents: "", path: "" } as Script)
        );

      case ".css":
        return (
          _experience.stylesheets.find(
            (stylesheet) => stylesheet.name === _activeFileName
          ) || ({ name: "", contents: "", path: "" } as Stylesheet)
        );
      case ".html":
        return (
          _experience.htmls.find((html) => html.name === _activeFileName) ||
          ({ name: "", contents: "", path: "" } as Html)
        );
      default:
        return { name: "", contents: "", path: "" } as File;
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

      // Guard against undefined/empty fileName
      if (!fileName) {
        return;
      }

      _setExperience((prev) => {
        // Check for .strudel.js first
        if (fileName.endsWith(".strudel.js")) {
          return {
            ...prev,
            strudels: (prev.strudels || []).map((strudel) =>
              strudel.name === fileName
                ? { ...strudel, contents: updatedFileContents }
                : strudel
            ),
          };
        }

        // Check for .hydra.js
        if (fileName.endsWith(".hydra.js")) {
          return {
            ...prev,
            hydras: (prev.hydras || []).map((hydra) =>
              hydra.name === fileName
                ? { ...hydra, contents: updatedFileContents }
                : hydra
            ),
          };
        }

        switch (fileName.substring(fileName.lastIndexOf("."))) {
          case ".js":
            return {
              ...prev,
              scripts: prev.scripts.map((script) =>
                script.name === fileName
                  ? { ...script, contents: updatedFileContents }
                  : script
              ),
            };
          case ".css":
            return {
              ...prev,
              stylesheets: prev.stylesheets.map((stylesheet) =>
                stylesheet.name === fileName
                  ? { ...stylesheet, contents: updatedFileContents }
                  : stylesheet
              ),
            };
          case ".html":
            return {
              ...prev,
              htmls: prev.htmls.map((html) =>
                html.name === fileName
                  ? { ...html, contents: updatedFileContents }
                  : html
              ),
            };
          default:
            return prev;
        }
      });
    },
    [clearErrors]
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
          // Guard against undefined fileName
          if (activeFile.name) {
            updateExperience({
              fileName: activeFile.name,
              updatedFileContents: newCode,
            });
          }
        }, DEBOUNCE_THRESHOLD);
      }
    });

    const isStrudelFile = activeFile.name?.endsWith(".strudel.js");

    const view = new EditorView({
      doc: activeFile.contents,
      extensions: [
        ...setup,
        javascript(),
        baseTheme,
        ...darkTheme,
        updateListener,
        ...(isStrudelFile ? highlightExtension : []),
      ],
      parent: editorRef.current,
    });

    editorViewRef.current = view;

    return () => {
      view.destroy();
      editorViewRef.current = null;
    };
  }, [activeFile.name]);

  // Restart drawer when switching back to a Strudel file
  useEffect(() => {
    const isStrudelFile = activeFile.name?.endsWith(".strudel.js");
    if (!isStrudelFile) return;
    if (!strudelReplReady) return;
    if (!drawerRef.current) return;
    if (!strudelReplRef.current?.scheduler) return;
    if (!editorViewRef.current) return;
    if (!isIframePlaying) return;

    // Check if editor view changed
    if (editorViewRef.current === lastEditorViewRef.current) return;
    // Don't update lastEditorViewRef yet - let onToggle detect the change and update it

    // Update mini locations for the new editor view
    const state = strudelReplRef.current.getState?.();
    if (state?.miniLocations) {
      updateMiniLocations(editorViewRef.current, state.miniLocations);
    }

    // Always restart REPL when editor view changes to trigger drawer restart
    // This ensures drawer reconnects to the new editor view via onToggle
    if (isIframePlaying) {
      const wasPlaying = strudelReplRef.current?.isPlaying?.() ?? false;
      if (wasPlaying) {
        strudelReplRef.current.stop();
      }
      // Restart REPL - this will trigger onToggle(true) which will detect editor view change and restart drawer
      const strudelCode = _experience.strudels
        .map((s) => s.contents)
        .join("\n\n");
      strudelReplRef.current.evaluate(strudelCode);
    }
  }, [
    activeFile.name,
    strudelReplReady,
    isIframePlaying,
    _experience.strudels,
  ]);

  // Initialize Strudel repl and drawer
  useEffect(() => {
    if (typeof window === "undefined") return; // Only run on client
    if (disableAudio) {
      return; // Don't initialize Strudel if audio is disabled
    }
    if (strudelReplRef.current) {
      return;
    }
    if (!_experience.strudels || _experience.strudels.length === 0) {
      return;
    }

    prebakePromiseRef.current = prebake();

    // Create drawer for pattern highlighting
    drawerRef.current = new Drawer(
      (haps: any, time: number) => {
        if (!editorViewRef.current) return;
        if (!haps || haps.length === 0) return;

        // Highlight patterns in CodeMirror (drawer already filters to visible haps)
        highlightMiniLocations(editorViewRef.current, time, haps);
      },
      [0, 0]
    ); // drawTime: [lookbehind, lookahead]

    strudelReplRef.current = repl({
      defaultOutput: webaudioOutput,
      getTime: () => getAudioContext().currentTime,
      transpiler,
      beforeEval: async () => {
        await prebakePromiseRef.current;
      },
      onUpdateState: (state: any) => {
        // Update mini locations in CodeMirror for pattern highlighting
        if (state.miniLocations && editorViewRef.current) {
          updateMiniLocations(editorViewRef.current, state.miniLocations);
        }
      },
      onToggle: (started: boolean) => {
        if (started && drawerRef.current && strudelReplRef.current?.scheduler) {
          // Always stop drawer first to ensure clean restart with current editor view
          // This handles both code changes and file switches
          const needsRestart =
            shouldRestartDrawerRef.current ||
            editorViewRef.current !== lastEditorViewRef.current;
          if (needsRestart) {
            drawerRef.current.stop();
            shouldRestartDrawerRef.current = false;
            if (editorViewRef.current) {
              lastEditorViewRef.current = editorViewRef.current;
            }
          }
          drawerRef.current.start(strudelReplRef.current.scheduler);
        } else if (!started && drawerRef.current) {
          drawerRef.current.stop();
        }
      },
    });

    // Mark REPL as ready immediately after creation
    setStrudelReplReady(true);

    return () => {
      // Don't cleanup here - let the unmount effect handle cleanup
      // The REPL should persist across code changes
    };
  }, [_experience.strudels?.length, disableAudio]); // Only re-run if number of strudel files changes or disableAudio changes

  // Check AudioContext state and update suspended state
  useEffect(() => {
    const checkAudioContextState = () => {
      const audioContext = getAudioContext();
      setIsAudioContextSuspended(audioContext.state === "suspended");
    };

    // Check initial state
    checkAudioContextState();

    // Listen for state changes
    const audioContext = getAudioContext();
    audioContext.addEventListener("statechange", checkAudioContextState);

    return () => {
      audioContext.removeEventListener("statechange", checkAudioContextState);
    };
  }, []);

  // Resume AudioContext on user interaction (for autoplay policy)
  useEffect(() => {
    const handleUserInteraction = async () => {
      const audioContext = getAudioContext();
      if (audioContext.state === "suspended") {
        try {
          await audioContext.resume();
          setIsAudioContextSuspended(false);
        } catch {
          // Silently fail - may already be resumed or user interaction not sufficient
        }
      }
    };

    // Listen for any user interaction to resume AudioContext
    // Using { once: true } means listeners auto-remove after first trigger
    window.addEventListener("click", handleUserInteraction, { once: true });
    window.addEventListener("keydown", handleUserInteraction, { once: true });
    window.addEventListener("touchstart", handleUserInteraction, {
      once: true,
    });

    // No cleanup needed - listeners with { once: true } remove themselves
  }, []);

  // Cleanup on unmount - ensure Strudel stops when navigating away
  useEffect(() => {
    return () => {
      // Stop the REPL
      if (strudelReplRef.current) {
        strudelReplRef.current.stop?.();
        strudelReplRef.current = null;
      }
      // Stop the drawer
      if (drawerRef.current) {
        drawerRef.current.stop?.();
        drawerRef.current = null;
      }
      // Reset ready state
      setStrudelReplReady(false);
    };
  }, []);

  // Handle Strudel play/pause with iframe state and audio state
  useEffect(() => {
    const shouldPlayAudio = isIframePlaying && !isAudioPaused && !disableAudio;

    if (disableAudio) {
      // Stop audio if disabled
      if (strudelReplRef.current) {
        strudelReplRef.current.stop();
      }
      return;
    }

    if (!strudelReplReady) {
      return;
    }
    if (!strudelReplRef.current) {
      return;
    }
    if (!_experience.strudels || _experience.strudels.length === 0) {
      return;
    }

    if (shouldPlayAudio) {
      // Concatenate all strudel code and evaluate
      const strudelCode = _experience.strudels
        .map((s) => s.contents)
        .join("\n\n");

      // Check if code changed or if this is initial load (lastStrudelCodeRef is empty)
      const codeChanged = strudelCode !== lastStrudelCodeRef.current;
      const wasAlreadyPlaying = strudelReplRef.current?.isPlaying?.() ?? false;

      // Always evaluate code when playing (even if unchanged)
      // This ensures audio starts when user clicks play
      if (codeChanged) {
        shouldRestartDrawerRef.current = true;
      }

      // If REPL is already playing, stop it first so onToggle fires when we evaluate
      // This ensures drawer gets restarted properly
      if (wasAlreadyPlaying) {
        strudelReplRef.current?.stop();
      }

      // Resume AudioContext first (browser autoplay policy)
      const audioContext = getAudioContext();

      // Always evaluate code - AudioContext resume will happen when user interacts
      // The REPL will handle autoplay policy and start when AudioContext is resumed
      strudelReplRef.current?.evaluate(strudelCode);
      lastStrudelCodeRef.current = strudelCode;

      // Try to resume AudioContext (may fail silently on refresh due to autoplay policy)
      // This will succeed once user interacts with the page
      audioContext.resume().catch(() => {
        // Silently fail - audio will start when user interacts
      });
    } else {
      strudelReplRef.current.stop();
      shouldRestartDrawerRef.current = false;
    }
  }, [
    strudelReplReady,
    isIframePlaying,
    isAudioPaused,
    _experience.strudels,
    disableAudio,
  ]);

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
        isAudioContextSuspended,
        isAudioPaused,
        srcDoc,
        iframeScale,
        errors,
        toggleIframeOpacity,
        updateIframeOpacity,
        toggleIframePaused,
        setIframePaused,
        setIframeInView,
        togglePointerEvents,
        enableAudio,
        toggleAudioPaused,
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
