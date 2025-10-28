"use client";

import { CursorArrowRippleIcon } from "@heroicons/react/20/solid";
import { Type } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useExperience } from "@/contexts/ExperienceContext";

export default function PointerEvents() {
  const experience = useExperience();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="relative z-30 h-full bg-zinc-900 hover:cursor-pointer hover:text-zinc-200"
          onClick={experience.togglePointerEvents}
        >
          {experience.isPointerEventsEnabled ? (
            <Type className="mx-1 size-[24px]" />
          ) : (
            <CursorArrowRippleIcon className="mx-1 size-[24px]" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Toggle pointer events</p>
      </TooltipContent>
    </Tooltip>
  );
}
