"use client";

import { CursorArrowRippleIcon } from "@heroicons/react/20/solid";
import { Type } from "lucide-react";
import { useExperience } from "@/contexts/ExperienceContext";

export default function PointerEvents() {
  const experience = useExperience();

  return (
    <button
      type="button"
      className="relative z-30 h-full bg-zinc-900 hover:cursor-pointer hover:text-zinc-200"
      onClick={experience.togglePointerEvents}
      title={
        experience.isPointerEventsEnabled
          ? "Disable pointer events (click through editor)"
          : "Enable pointer events (interact with editor)"
      }
    >
      {experience.isPointerEventsEnabled ? (
        <Type className="mx-1 size-[24px]" />
      ) : (
        <CursorArrowRippleIcon className="mx-1 size-[24px]" />
      )}
    </button>
  );
}
