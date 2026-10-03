import { getExperiences } from "./getExperiences";
import type { Experience } from "@/types/experience";

export function getExperience({
  experienceName,
}: {
  experienceName: string;
}): Experience {
  const experience = getExperiences().find(
    ({ name }) => name === experienceName,
  );
  if (!experience) {
    throw new Error(`Unknown experience: ${experienceName}`);
  }
  return experience;
}
