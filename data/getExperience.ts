import "server-only";

import { Experience, Html, Script, Stylesheet } from "@/types/experience";
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
      decodeURIComponent(experienceName),
    );
    experience.name = experienceName;
    experience.fileNames = [] as string[];
    experience.scripts = [] as Script[];
    experience.stylesheets = [] as Stylesheet[];
    experience.htmls = [] as Html[];

    const files = await readdir(experience.path);
    for (const file of files) {
      experience.fileNames.push(file);

      switch (file.substring(file.lastIndexOf("."))) {
        case ".js":
          const script = {} as Script;
          script.name = file;
          script.path = path.join(experience.path, file);
          script.contents = fs.readFileSync(script.path, "utf-8");

          experience.scripts.push(script);
        case ".css":
          const stylesheet = {} as Stylesheet;
          stylesheet.name = file;
          stylesheet.path = path.join(experience.path, file);
          stylesheet.contents = fs.readFileSync(stylesheet.path, "utf-8");

          experience.stylesheets.push(stylesheet);
        case ".html":
          const html = {} as Html;
          html.name = file;
          html.path = path.join(experience.path, file);
          html.contents = fs.readFileSync(html.path, "utf-8");

          experience.htmls.push(html);
      }
    }

    return experience;
  } catch (error) {
    console.error("Error reading scripts directory:", error);
    return {} as Experience;
  }
}
