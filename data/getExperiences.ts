import { FILE_EXTENSIONS, getFileExtension } from "@/constants/fileExtensions";
import type { Experience } from "@/types/experience";

// Raw imports are bundled at build time; experience source is never executed here.
const sources = import.meta.glob<string>("../experiences/*/*.{html,css,js}", {
  query: "?raw",
  import: "default",
  eager: true,
});

const collections = {
  [FILE_EXTENSIONS.JS]: "scripts",
  [FILE_EXTENSIONS.CSS]: "stylesheets",
  [FILE_EXTENSIONS.HTML]: "htmls",
  [FILE_EXTENSIONS.STRUDEL]: "strudels",
  [FILE_EXTENSIONS.HYDRA]: "hydras",
} as const;

export function getExperiences(): Experience[] {
  const experiences = new Map<string, Experience>();

  for (const [sourcePath, contents] of Object.entries(sources).sort(
    ([a], [b]) => a.localeCompare(b),
  )) {
    const [, , name, fileName] = sourcePath.split("/");
    const extension = getFileExtension(fileName);
    if (!extension) continue;

    let experience = experiences.get(name);
    if (!experience) {
      experience = {
        name,
        path: `experiences/${name}`,
        fileNames: [],
        scripts: [],
        stylesheets: [],
        htmls: [],
        strudels: [],
        hydras: [],
      };
      experiences.set(name, experience);
    }

    experience.fileNames.push(fileName);
    experience[collections[extension]].push({
      name: fileName,
      path: `${experience.path}/${fileName}`,
      contents,
    });
  }

  return [...experiences.values()];
}
