"use client";

import { useExperience } from "@/contexts/ExperienceContext";
import Controls from "./controls/Controls";

export const Editor = () => {
  const experience = useExperience();

  return (
    <div
      className="absolute inset-0 z-10 flex flex-col p-2"
      style={{
        pointerEvents: experience.isPointerEventsEnabled ? "auto" : "none",
      }}
    >
      <div style={{ pointerEvents: "auto" }}>
        <Controls />
      </div>
      <div
        ref={experience.editorRef}
        className="no-scrollbar flex-1 overflow-auto"
      />
    </div>
  );
};
