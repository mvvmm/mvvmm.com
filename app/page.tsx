import ExperienceIFrame from "@/components/ExperienceIFrame";
import { ExperienceProvider } from "@/contexts/ExperienceContext";
import { getExperiences } from "@/data/getExperiences";
import Link from "next/link";

export default async function Home() {
  const experiences = await getExperiences();

  return (
    <>
      <div className="w-full grid grid-cols-auto-fit-300">
        {experiences.map((experience, i) => (
          <Link
            href={`/editor/${experience.name}`}
            key={experience.name}
            className="relative w-full h-80 transition-transform hover:scale-[1.01] hover:z-10"
          >
            <ExperienceProvider experience={experience} iframeScale={0.33}>
              <ExperienceIFrame className="pointer-events-none" />
            </ExperienceProvider>
          </Link>
        ))}
      </div>
    </>
  );
}
