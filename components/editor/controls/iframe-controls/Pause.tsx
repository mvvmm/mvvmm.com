"use client";

import { useExperience } from "@/contexts/ExperienceContext";
import { PlayIcon, StopIcon } from "@heroicons/react/20/solid";

export default function Pause() {
  const experience = useExperience();

  return (
    <button
      className="relative z-30 h-full bg-zinc-900 hover:cursor-pointer hover:text-zinc-200"
      onClick={experience.toggleIframePlaying}
    >
      {experience.isIframePlaying ? (
        <StopIcon className="mx-1 size-[24px]" />
      ) : (
        <PlayIcon className="mx-1 size-[24px]" />
      )}
    </button>
  );
}
