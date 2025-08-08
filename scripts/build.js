#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Frontend path constant
const FRONTEND_PATH = path.join(__dirname, "../../omln4-overlay-front");

// Cross-platform command execution
function execCommand(command, options = {}) {
  try {
    console.log(`Executing: ${command}`);
    execSync(command, { stdio: "inherit", ...options });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    process.exit(1);
  }
}

// Cross-platform file writing
function writeFile(filePath, content) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content);
    console.log(`Created: ${filePath}`);
  } catch (error) {
    console.error(`Error writing file: ${filePath}`, error);
    process.exit(1);
  }
}

// Copy directory recursively
function copyDirectory(source, destination) {
  try {
    console.log(`Copying from ${source} to ${destination}`);

    // Remove destination if it exists
    if (fs.existsSync(destination)) {
      fs.rmSync(destination, { recursive: true, force: true });
    }

    // Create destination directory
    fs.mkdirSync(destination, { recursive: true });

    // Copy files recursively
    const items = fs.readdirSync(source);

    for (const item of items) {
      const sourcePath = path.join(source, item);
      const destPath = path.join(destination, item);

      if (fs.statSync(sourcePath).isDirectory()) {
        copyDirectory(sourcePath, destPath);
      } else {
        fs.copyFileSync(sourcePath, destPath);
      }
    }

    console.log(`Successfully copied to ${destination}`);
  } catch (error) {
    console.error(`Error copying directory: ${error.message}`);
    process.exit(1);
  }
}

// Main build process
function build() {
  console.log("Starting build process...");

  // Build frontend first
  console.log("Building frontend...");

  // Check if frontend directory exists
  if (!fs.existsSync(FRONTEND_PATH)) {
    console.error(`Frontend directory not found at: ${FRONTEND_PATH}`);
    process.exit(1);
  }

  // Install frontend dependencies
  console.log("Installing frontend dependencies...");
  execCommand("npm install", { cwd: FRONTEND_PATH });

  // Build frontend
  console.log("Building frontend...");
  execCommand("npm run build", { cwd: FRONTEND_PATH });

  // Copy frontend build output to src/public
  const frontendDistPath = path.join(FRONTEND_PATH, "dist");
  const publicPath = path.join(process.cwd(), "src", "public");

  if (!fs.existsSync(frontendDistPath)) {
    console.error(`Frontend build output not found at: ${frontendDistPath}`);
    process.exit(1);
  }

  console.log("Copying frontend build to src/public...");
  copyDirectory(frontendDistPath, publicPath);

  // Clean dist directory
  console.log("Cleaning dist directory...");
  execCommand("npm run clean");

  // Run pkg build
  console.log("Building executable...");
  execCommand("pkg --compress GZip .");

  // Create Windows launcher (since Windows is the only target)
  console.log("Creating Windows launcher...");
  const distDir = path.join(process.cwd(), "dist");
  const cmdContent = `@echo off\r\n"omln4-overlay.exe"\r\npause`;
  writeFile(path.join(distDir, "_Start omln4-overlay.cmd"), cmdContent);

  // Create mappoolgen launcher
  const mappoolgenCmdContent = `@echo off\r\n"omln4-overlay.exe" mappoolgen\r\npause`;
  writeFile(path.join(distDir, "_Create mappool.json.cmd"), mappoolgenCmdContent);

  // Ensure public is copied next to the exe for runtime serving
  const exePublicPath = path.join(distDir, "public");
  console.log("Copying frontend build next to the executable (dist/public)...");
  copyDirectory(publicPath, exePublicPath);

  console.log("Build completed successfully!");
}

// Run build
build();
