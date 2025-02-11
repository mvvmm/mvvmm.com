import "server-only";

import { ScriptContents } from "@/types/script";
import fs from "fs";
import path from "path";

export async function getScriptContents(
  scriptSlug: string,
): Promise<ScriptContents> {
  try {
    const privateScriptsDirectory = path.join(
      process.cwd(),
      "scripts",
      decodeURIComponent(scriptSlug),
    );

    const privateScriptPath = path.join(privateScriptsDirectory, "script.js");

    const scriptFileContents = fs.readFileSync(privateScriptPath, "utf-8");

    return scriptFileContents;
  } catch (error) {
    console.error("Error reading script:", error);
    return {} as ScriptContents;
  }
}
