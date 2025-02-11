import "server-only";

import { readdir } from "fs/promises";
import path from "path";

export async function getScripts(): Promise<string[]> {
  const scriptsDirectory = path.join(process.cwd(), "scripts");

  try {
    const files = await readdir(scriptsDirectory);
    return files;
  } catch (error) {
    console.error("Error reading scripts directory:", error);
    return [];
  }
}
