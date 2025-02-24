import "server-only";

import { Experience, Script, Stylesheet } from "@/types/experience";
import fs from "fs";
import { readdir } from "fs/promises";
import path from "path";

export async function getExperiences(): Promise<Experience[]> {
  const experiencesDirectory = path.join(process.cwd(), "experiences");

  try {
    const dirs = await readdir(experiencesDirectory);
    const experiences = [] as Experience[];

    for (const dir of dirs) {
      const experience = {} as Experience;

      experience.name = dir;
      experience.fileNames = [] as string[];
      experience.scripts = [] as Script[];
      experience.stylesheets = [] as Stylesheet[];

      experience.path = path.join(
        process.cwd(),
        "experiences",
        decodeURIComponent(dir),
      );

      const files = await readdir(experience.path);
      for (const file of files) {
        experience.fileNames.push(file);

        if (file.endsWith(".js")) {
          const script = {} as Script;
          script.name = file;
          script.path = path.join(experience.path, file);
          script.contents = fs.readFileSync(script.path, "utf-8");

          experience.scripts.push(script);
        } else if (file.endsWith(".css")) {
          const stylesheet = {} as Stylesheet;
          stylesheet.name = file;
          stylesheet.path = path.join(experience.path, file);
          stylesheet.contents = fs.readFileSync(stylesheet.path, "utf-8");

          experience.stylesheets.push(stylesheet);
        }
      }
      experiences.push(experience);
    }

    return experiences;
  } catch (error) {
    console.error("Error reading scripts directory:", error);
    return [] as Experience[];
  }
}
