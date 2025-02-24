"use client";

import { useExperience } from "@/contexts/ExperienceContext";
import { setup } from "@/lib/code-mirror/setup";
import { baseTheme } from "@/lib/code-mirror/themes/base";
import { darkTheme } from "@/lib/code-mirror/themes/dark";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView, ViewUpdate } from "@codemirror/view";
import { useEffect, useRef } from "react";
import Controls from "./controls/Controls";

export const Editor = () => {
  const experience = useExperience();
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const updateListener = EditorView.updateListener.of((v: ViewUpdate) => {
      if (v.docChanged) {
        const newCode = v.state.doc.toString();
        experience.updateExperience({
          fileName: experience.activeFile.name,
          updatedFileContents: newCode,
        });
      }
    });

    const view = new EditorView({
      doc: experience.activeFile.contents,
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
  }, [experience.activeFile.name]);

  return (
    <div className="absolute inset-0 flex flex-col z-10 p-2">
      <Controls />
      <div ref={editorRef} className="flex-1 overflow-auto no-scrollbar" />
    </div>
  );
};
