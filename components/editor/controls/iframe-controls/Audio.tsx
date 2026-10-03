import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/20/solid";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useExperience } from "@/contexts/ExperienceContext";

export default function Audio() {
  const experience = useExperience();

  const hasAudio = experience.experience.strudels.length > 0;
  const label = !hasAudio
    ? "No audio in this experience"
    : experience.isAudioPaused
      ? "Enable Audio"
      : experience.isAudioContextSuspended
        ? "Click to start audio"
        : experience.isAudioPlaying
          ? "Mute audio"
          : "Mute audio (waiting for playback)";

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
          aria-label={label}
          aria-pressed={experience.isAudioPlaying}
          disabled={!hasAudio}
        >
          {experience.isAudioPlaying ? (
            <SpeakerWaveIcon className="mx-1 size-[24px]" />
          ) : (
            <SpeakerXMarkIcon className="mx-1 size-[24px]" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}
