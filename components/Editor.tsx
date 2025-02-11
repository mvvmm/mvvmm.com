"use client";

import { useScript } from "@/contexts/ScriptContext";
import { setup } from "@/lib/code-mirror/setup";
import { baseTheme } from "@/lib/code-mirror/themes/base";
import { darkTheme } from "@/lib/code-mirror/themes/dark";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView, ViewUpdate } from "@codemirror/view";
import { useEffect, useRef } from "react";

export const Editor = () => {
  const script = useScript();
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const updateListener = EditorView.updateListener.of((v: ViewUpdate) => {
      if (v.docChanged) {
        const newCode = v.state.doc.toString();
        script.updateScript(newCode);
      }
    });

    const view = new EditorView({
      doc: script.script,
      extensions: [
        ...setup,
        javascript(),
        baseTheme,
        ...darkTheme,
        updateListener,
      ],
      parent: editorRef.current,
    });

    return () => view.destroy(); // Cleanup on unmount
  }, []);

  return (
    <div className="w-full h-full p-4 absolute inset-0 z-10 no-scrollbar">
      <div ref={editorRef} />
    </div>
  );
};
