/**
 * File extension mappings for different file types.
 * Keys are file type constants, values indicate how they should be handled.
 */
export const FILE_EXTENSIONS = {
  JS: ".js",
  CSS: ".css",
  HTML: ".html",
  STRUDEL: ".strudel.js",
  HYDRA: ".hydra.js",
} as const;

export const IFRAME_IGNORE_EXTENSIONS = [FILE_EXTENSIONS.STRUDEL];

/**
 * Check if a filename should be ignored based on its extension.
 */
export function shouldIgnoreFile(filename: string): boolean {
  return IFRAME_IGNORE_EXTENSIONS.some((ext) => filename.endsWith(ext));
}

/**
 * Get the file extension for a given filename.
 * Checks longer extensions first to avoid false matches (e.g., .strudel.js vs .js).
 */
export function getFileExtension(
  filename: string
): (typeof FILE_EXTENSIONS)[keyof typeof FILE_EXTENSIONS] | undefined {
  // Sort extensions by length (longest first) to check .strudel.js before .js
  const extensions = Object.values(FILE_EXTENSIONS).sort(
    (a, b) => b.length - a.length
  );

  for (const ext of extensions) {
    if (filename.endsWith(ext)) {
      return ext;
    }
  }
  return undefined;
}
