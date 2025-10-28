"use client";

import { PlayIcon, StopIcon } from "@heroicons/react/20/solid";
import { useExperience } from "@/contexts/ExperienceContext";

export default function Pause() {
  const experience = useExperience();

  return (
    <button
      className="relative z-30 h-full bg-zinc-900 hover:cursor-pointer hover:text-zinc-200"
      onClick={experience.toggleIframePaused}
      type="button"
    >
      {experience.isIframePaused ? (
        <PlayIcon className="mx-1 size-[24px]" />
      ) : (
        <StopIcon className="mx-1 size-[24px]" />
      )}
    </button>
  );
}
