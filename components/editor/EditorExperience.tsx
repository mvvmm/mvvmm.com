import ExperienceIFrame from "@/components/ExperienceIFrame";
import { Editor } from "@/components/editor/Editor";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ExperienceProvider } from "@/contexts/ExperienceContext";
import type { Experience } from "@/types/experience";

export default function EditorExperience({
  experience,
}: {
  experience: Experience;
}) {
  return (
    <TooltipProvider>
      <ExperienceProvider experience={experience}>
        <Editor />
        <ExperienceIFrame />
      </ExperienceProvider>
    </TooltipProvider>
  );
}
