import "server-only";

import {
  Experience,
  Html,
  Script,
  Strudel,
  Stylesheet,
} from "@/types/experience";
import { FILE_EXTENSIONS, getFileExtension } from "@/constants/fileExtensions";
import fs from "fs";
import { readdir } from "fs/promises";
import path from "path";

export async function getExperience({
  experienceName,
}: {
  experienceName: string;
}): Promise<Experience> {
  try {
    const experience = {} as Experience;

    experience.path = path.join(
      process.cwd(),
      "experiences",
      decodeURIComponent(experienceName)
    );
    experience.name = experienceName;
    experience.fileNames = [] as string[];
    experience.scripts = [] as Script[];
    experience.stylesheets = [] as Stylesheet[];
    experience.htmls = [] as Html[];
    experience.strudels = [] as Strudel[];

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

    return experience;
  } catch (error) {
    console.error("Error reading scripts directory:", error);
    return {} as Experience;
  }
}
