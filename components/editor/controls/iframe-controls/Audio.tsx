"use client";

import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/20/solid";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useExperience } from "@/contexts/ExperienceContext";

export default function Audio() {
  const experience = useExperience();

  // Show whether audio is enabled (not whether it's currently playing)
  // When iframe is stopped, this shows what state audio will be in when iframe resumes
  // Audio is considered disabled if user paused it OR if AudioContext is suspended
  const isAudioEnabled =
    !experience.isAudioPaused && !experience.isAudioContextSuspended;

  const handleClick = async () => {
    // If audio is suspended, enable it (this will resume AudioContext)
    if (experience.isAudioContextSuspended) {
      await experience.enableAudio();
      // If it was also paused, unpause it
      if (experience.isAudioPaused) {
        experience.toggleAudioPaused();
      }
      // If not paused, we're done - audio is now enabled
      return;
    }
    // Otherwise, just toggle the paused state
    experience.toggleAudioPaused();
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className="relative z-30 h-full bg-zinc-900 hover:cursor-pointer hover:text-zinc-200"
          onClick={handleClick}
          type="button"
        >
          {isAudioEnabled ? (
            <SpeakerWaveIcon className="mx-1 size-[24px]" />
          ) : (
            <SpeakerXMarkIcon className="mx-1 size-[24px]" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {experience.isAudioContextSuspended
            ? "Audio Suspended - Click to Enable"
            : isAudioEnabled
            ? "Disable Audio"
            : "Enable Audio"}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
