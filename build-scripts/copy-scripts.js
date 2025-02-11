/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require("fs");
const path = require("path");

// Define source and destination paths
const sourceDir = path.join(process.cwd(), "scripts");
const destDir = path.join(process.cwd(), "public", "scripts");

// Recursively copy the directory
function copyDirectory(source, destination) {
  // Check if the source directory exists
  if (!fs.existsSync(source)) {
    console.error(`Source directory does not exist: ${source}`);
    process.exit(1);
  }

  // Ensure the destination directory exists
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  // Read all files and directories in the source directory
  const entries = fs.readdirSync(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy subdirectories
      copyDirectory(sourcePath, destPath);
    } else if (entry.isFile()) {
      // Copy files
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

// Main function to copy the scripts directory
function copyScripts() {
  try {
    copyDirectory(sourceDir, destDir);
    console.log("Scripts directory copied successfully!");
  } catch (error) {
    console.error("Error copying Scripts directory:", error);
    process.exit(1);
  }
}

// Execute the copy function
copyScripts();
