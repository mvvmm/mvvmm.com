/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require("fs");
const path = require("path");

const directory = process.cwd(); // Always use the current working directory

// Recursively process all files in the directory
function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Recursively process subdirectories
      processDirectory(fullPath);
    } else if (entry.isFile()) {
      // Attempt to delete the Zone.Identifier ADS if it exists
      removeZoneIdentifier(fullPath);
    }
  }
}

// Function to remove the Zone.Identifier file
function removeZoneIdentifier(filePath) {
  try {
    const zoneFile = `${filePath}:Zone.Identifier`;

    // Check if Zone.Identifier exists by attempting to access it
    if (fs.statSync(zoneFile)) {
      fs.unlinkSync(zoneFile); // Remove the Zone.Identifier ADS
      console.log(`Zone.Identifier removed from: ${filePath}`);
    }
  } catch (err) {
    // Ignore errors for non-existing Zone.Identifier files
    if (err.code !== "ENOENT") {
      console.error(
        `Error removing Zone.Identifier for ${filePath}:`,
        err.message,
      );
    }
  }
}

// Start processing the current directory
console.log(`Cleaning Zone.Identifier files in: ${directory}`);
processDirectory(directory);
