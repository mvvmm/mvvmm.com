"use client";

import { useExperience } from "@/contexts/ExperienceContext";
import Controls from "./controls/Controls";

export const Editor = () => {
  const experience = useExperience();

  return (
    <div className="absolute inset-0 flex flex-col z-10 p-2">
      <Controls />
      <div
        ref={experience.editorRef}
        className="flex-1 overflow-auto no-scrollbar"
      />
    </div>
  );
};
