import "server-only";

import {
  Experience,
  Html,
  Hydra,
  Script,
  Strudel,
  Stylesheet,
} from "@/types/experience";
import { FILE_EXTENSIONS, getFileExtension } from "@/constants/fileExtensions";
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
      experience.htmls = [] as Html[];
      experience.strudels = [];
      experience.hydras = [];

      experience.path = path.join(
        process.cwd(),
        "experiences",
        decodeURIComponent(dir)
      );

      const files = await readdir(experience.path);
      for (const file of files) {
        experience.fileNames.push(file);

        const fileExtension = getFileExtension(file);
        if (!fileExtension) continue;

        const filePath = path.join(experience.path, file);
        const contents = fs.readFileSync(filePath, "utf-8");

        switch (fileExtension) {
          case FILE_EXTENSIONS.STRUDEL:
            const strudel = {} as Strudel;
            strudel.name = file;
            strudel.path = filePath;
            strudel.contents = contents;
            experience.strudels.push(strudel);
            break;

          case FILE_EXTENSIONS.HYDRA:
            const hydra = {} as Hydra;
            hydra.name = file;
            hydra.path = filePath;
            hydra.contents = contents;
            experience.hydras.push(hydra);
            break;

          case FILE_EXTENSIONS.JS:
            const script = {} as Script;
            script.name = file;
            script.path = filePath;
            script.contents = contents;
            experience.scripts.push(script);
            break;

          case FILE_EXTENSIONS.CSS:
            const stylesheet = {} as Stylesheet;
            stylesheet.name = file;
            stylesheet.path = filePath;
            stylesheet.contents = contents;
            experience.stylesheets.push(stylesheet);
            break;

          case FILE_EXTENSIONS.HTML:
            const html = {} as Html;
            html.name = file;
            html.path = filePath;
            html.contents = contents;
            experience.htmls.push(html);
            break;
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
