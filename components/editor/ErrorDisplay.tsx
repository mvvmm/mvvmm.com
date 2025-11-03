"use client";

import { useExperience } from "@/contexts/ExperienceContext";
import type { ExperienceError } from "@/types/experience";

const getErrorMessage = (errorMessage: ExperienceError) => {
  const msg = errorMessage.message;
  const colonIndex = msg.indexOf(":");
  return colonIndex !== -1 ? msg.slice(colonIndex + 1).trim() : msg;
};

export default function ErrorDisplay() {
  const experience = useExperience();
  if (experience.errors.length === 0) {
    return null;
  }

  return (
    <div className="bg-zinc-900 h-max-content mt-2 flex flex-col text-red-400 text-sm">
      {experience.errors[0] && (
        <div className="border-red-500 border">
          <div className="px-2">{getErrorMessage(experience.errors[0])}</div>
        </div>
      )}
    </div>
  );
}
