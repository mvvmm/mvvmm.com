import ExperienceIFrame from "@/components/ExperienceIFrame";
import { ExperienceProvider } from "@/contexts/ExperienceContext";
import type { Experience } from "@/types/experience";

export default function ExperienceCard({
  experience,
}: {
  experience: Experience;
}) {
  return (
    <ExperienceProvider
      experience={experience}
      iframeScale={0.5}
      enableAudio={false}
    >
      <ExperienceIFrame className="pointer-events-none" />
    </ExperienceProvider>
  );
}
