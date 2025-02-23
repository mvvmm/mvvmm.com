import { Editor } from "@/components/Editor";
import ScriptIFrame from "@/components/ExperienceIFrame";
import { ExperienceProvider } from "@/contexts/ExperienceContext";
import { getExperience } from "@/data/getExperience";

export default async function Page({
  params,
}: {
  params: Promise<{ experienceName: string }>;
}) {
  const _params = await params;

  const experience = await getExperience({
    experienceName: _params.experienceName,
  });

  return (
    <ExperienceProvider experience={experience}>
      <Editor />
      <ScriptIFrame />
    </ExperienceProvider>
  );
}
