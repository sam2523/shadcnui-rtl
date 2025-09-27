#!/usr/bin/env node

/**
 * shadcn-rtl-transform
 * 
 * A comprehensive utility for transforming shadcn/ui components to support RTL layouts
 * by converting Tailwind CSS classes from LTR to RTL logical properties.
 * 
 * @author Saleh7
 * @license MIT
 * @version 1.0.0
 */

import fs from "fs/promises";
import path from "path";
import minimist from "minimist";

// ========================
// Configuration Constants
// ========================

const DEFAULT_COMPONENTS_DIRECTORY = "src/components";
const FILE_EXTENSION_PATTERN = /\.(tsx|jsx)$/;
const DEFAULT_ENCODING = "utf-8";

// Global configuration
let CONFIG = {
  showIcons: true,
  rotateDirectionalIcons: true
};

/**
 * Mapping of LTR Tailwind classes to their RTL logical property equivalents
 * @type {Object.<string, string>}
 */
const TAILWIND_LTR_TO_RTL_MAPPINGS = {
  // Padding and Margin (Logical Properties)
  "pl-": "ps-",  // padding-left → padding-start
  "pr-": "pe-",  // padding-right → padding-end
  "ml-": "ms-",  // margin-left → margin-start
  "mr-": "me-",  // margin-right → margin-end
  
  // Positioning
  "left-": "start-",
  "right-": "end-",
  
  // Transforms and Spacing
  "translate-x-": "translate-x-",
  "space-x-": "space-x-",
  "space-y-": "space-y-",
  "gap-x-": "gap-x-",
  "gap-y-": "gap-y-",
  
  // Border Radius
  "rounded-l-": "rounded-s-",
  "rounded-l ": "rounded-s ",
  "rounded-r-": "rounded-e-",
  "rounded-r ": "rounded-e ",
  "rounded-tl-": "rounded-ts-",  // top-left → top-start
  "rounded-tr-": "rounded-te-",  // top-right → top-end
  "rounded-bl-": "rounded-bs-",  // bottom-left → bottom-start
  "rounded-br-": "rounded-be-",  // bottom-right → bottom-end
  
  // Border Width
  "border-l-": "border-s-",
  "border-l ": "border-s ",
  "border-r-": "border-e-",
  "border-r ": "border-e ",
  
  // Text Alignment
  "text-left": "text-start",
  "text-right": "text-end",
  
  // Animation Directions
  "slide-in-from-left": "slide-in-from-start",
  "slide-in-from-right": "slide-in-from-end",
  "slide-out-to-left": "slide-out-to-start",
  "slide-out-to-right": "slide-out-to-end",
};

/**
 * RTL-specific utility classes for bidirectional support
 * @type {Object.<string, string>}
 */
const RTL_SPECIFIC_UTILITIES = {
  "rtl:space-x-reverse": "rtl:space-x-reverse",
  "rtl:space-y-reverse": "rtl:space-y-reverse",
  "rtl:translate-x-reverse": "rtl:translate-x-reverse",
  "rtl:slide-in-from-start": "rtl:slide-in-from-end",
  "rtl:slide-in-from-end": "rtl:slide-in-from-start",
  "rtl:slide-out-to-start": "rtl:slide-out-to-end",
  "rtl:slide-out-to-end": "rtl:slide-out-to-start",
};

/**
 * Files that should be excluded from RTL transformation
 * @type {Set<string>}
 */
const FILES_TO_EXCLUDE = new Set([
  "dialog.tsx",
  // Add more files that shouldn't be transformed
]);

/**
 * Directional icon components that need rotation in RTL
 * @type {string[]}
 */
const DIRECTIONAL_ICON_COMPONENTS = [
  "ChevronLeft",
  "ChevronRight",
  "ChevronLeftIcon",
  "ChevronRightIcon",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeftIcon",
  "ArrowRightIcon",
  "CaretLeft",
  "CaretRight",
  "PanelLeftIcon",
  "PanelRightIcon",
];

// ========================
// Core Transformation Logic
// ========================

/**
 * Transform Tailwind classes from LTR to RTL logical properties
 * @param {string} content - The file content to transform
 * @returns {string} Transformed content with RTL support
 */
function transformTailwindClasses(content) {
  let transformedContent = content;

  // Transform data-side attributes for positioning
  transformedContent = transformDataSideAttributes(transformedContent);

  // Apply LTR to RTL class mappings
  transformedContent = applyClassMappings(transformedContent, TAILWIND_LTR_TO_RTL_MAPPINGS);

  // Add RTL-specific utility classes
  transformedContent = addRTLUtilities(transformedContent, RTL_SPECIFIC_UTILITIES);

  // Fix special components (Radio, Switch)
  transformedContent = fixRadioAndSwitchComponents(transformedContent);

  // Add rotation to directional icons (only if enabled)
  if (CONFIG.rotateDirectionalIcons) {
    transformedContent = fixDirectionalIcons(transformedContent);
  }

  return transformedContent;
}

/**
 * Transform data-side attributes from left/right to start/end
 * @param {string} content - Content to transform
 * @returns {string} Transformed content
 */
function transformDataSideAttributes(content) {
  // Handle both [data-side=left] and data-side="left" formats
  let result = content.replace(
    /\[data-side=(left|right)\]/g,
    (match, direction) => {
      const logicalDirection = direction === "left" ? "start" : "end";
      return `[data-side=${logicalDirection}]`;
    }
  );

  result = result.replace(
    /data-side=["'](left|right)["']/g,
    (match, direction) => {
      const logicalDirection = direction === "left" ? "start" : "end";
      return `data-side="${logicalDirection}"`;
    }
  );

  return result;
}

/**
 * Apply class mappings for RTL transformation
 * @param {string} content - Content to transform
 * @param {Object.<string, string>} mappings - Mapping of LTR to RTL classes
 * @returns {string} Transformed content
 */
function applyClassMappings(content, mappings) {
  let result = content;
  
  for (const [ltrClass, rtlClass] of Object.entries(mappings)) {
    const regex = new RegExp(`\\b${escapeRegExp(ltrClass)}`, "g");
    result = result.replace(regex, rtlClass);
  }
  
  return result;
}

/**
 * Add RTL-specific utility classes where needed
 * @param {string} content - Content to transform
 * @param {Object.<string, string>} utilities - RTL utility classes
 * @returns {string} Transformed content
 */
function addRTLUtilities(content, utilities) {
  let result = content;
  
  for (const [utilityClass] of Object.entries(utilities)) {
    if (result.includes(utilityClass)) {
      const regex = new RegExp(`\\b${escapeRegExp(utilityClass)}\\b`, "g");
      result = result.replace(regex, utilityClass);
    }
  }
  
  return result;
}

// ========================
// Component-Specific Fixes
// ========================

/**
 * Fix Radio and Switch components for RTL support
 * @param {string} content - Content to transform
 * @returns {string} Transformed content
 */
function fixRadioAndSwitchComponents(content) {
  // Apply fixes to class attributes (both string and expression values)
  content = processClassAttributes(content, applyRadioSwitchFixes);
  return content;
}

/**
 * Apply specific fixes for Radio and Switch component positioning
 * @param {string} classValue - Class string value
 * @returns {string} Fixed class value
 */
function applyRadioSwitchFixes(classValue) {
  // Fix Radio button positioning
  if (
    classValue.includes("start-1/2") &&
    classValue.includes("-translate-x-1/2") &&
    !classValue.includes("rtl:translate-x-1/2")
  ) {
    classValue = classValue.replace(
      "-translate-x-1/2",
      "-translate-x-1/2 rtl:translate-x-1/2"
    );
  }

  // Fix Switch component checked state
  const switchCheckedClass = "data-[state=checked]:translate-x-[calc(100%-2px)]";
  const rtlSwitchClass = "rtl:data-[state=checked]:-translate-x-[calc(100%-2px)]";
  
  if (classValue.includes(switchCheckedClass) && !classValue.includes(rtlSwitchClass)) {
    classValue = classValue.replace(
      switchCheckedClass,
      `${switchCheckedClass} ${rtlSwitchClass}`
    );
  }

  return classValue;
}

/**
 * Add RTL rotation to directional icon components
 * @param {string} content - Content to transform
 * @returns {string} Transformed content
 */
function fixDirectionalIcons(content) {
  const rtlRotationClass = "rtl:rotate-180";
  
  for (const iconComponent of DIRECTIONAL_ICON_COMPONENTS) {
    content = addClassToComponent(content, iconComponent, rtlRotationClass);
  }
  
  return content;
}

/**
 * Add a class to a React component
 * @param {string} content - Content containing the component
 * @param {string} componentName - Name of the component
 * @param {string} classToAdd - Class to add
 * @returns {string} Content with class added
 */
function addClassToComponent(content, componentName, classToAdd) {
  const safeComponentName = escapeRegExp(componentName);
  
  // Pattern 1: Component with string className
  content = content.replace(
    new RegExp(`<${safeComponentName}([^>]*?)\\sclassName\\s*=\\s*["']([^"']*)["']([^>]*?)\\/>`, "g"),
    (match, pre, existingClasses, post) => {
      if (existingClasses.includes(classToAdd)) return match;
      return `<${componentName}${pre} className="${existingClasses} ${classToAdd}"${post} />`;
    }
  );

  // Pattern 2: Component with cn() className
  content = content.replace(
    new RegExp(`<${safeComponentName}([^>]*?)\\sclassName\\s*=\\s*\\{\\s*cn\\(([^)]*)\\)\\s*\\}([^>]*?)\\/>`, "g"),
    (match, pre, cnContent, post) => {
      if (cnContent.includes(classToAdd)) return match;
      return `<${componentName}${pre} className={cn("${classToAdd}", ${cnContent})}${post} />`;
    }
  );

  // Pattern 3: Component without className
  content = content.replace(
    new RegExp(`<${safeComponentName}((?:(?!className)[^>])*)\\/>`, "g"),
    (match, attributes) => `<${componentName}${attributes} className="${classToAdd}" />`
  );

  return content;
}

// ========================
// Icon Management
// ========================

/**
 * Icon mappings for different message types
 * @type {Object.<string, Object>}
 */
const ICONS = {
  success: { icon: "✅", text: "[SUCCESS]" },
  error: { icon: "❌", text: "[ERROR]" },
  warning: { icon: "⚠️", text: "[WARNING]" },
  info: { icon: "ℹ️", text: "[INFO]" },
  skip: { icon: "⏭️", text: "[SKIP]" },
  process: { icon: "⚙️", text: "[PROCESS]" },
  file: { icon: "📁", text: "[FILE]" },
  folder: { icon: "📂", text: "[FOLDER]" },
  search: { icon: "🔍", text: "[SEARCH]" },
  rocket: { icon: "🚀", text: "[START]" },
  sparkle: { icon: "✨", text: "[DONE]" },
  backup: { icon: "💾", text: "[BACKUP]" },
  edit: { icon: "✏️", text: "[MODIFIED]" },
  check: { icon: "✅", text: "[OK]" },
  chart: { icon: "📊", text: "[SUMMARY]" },
  tip: { icon: "💡", text: "[TIP]" },
  docs: { icon: "📋", text: "[DOCS]" },
  test: { icon: "🔬", text: "[DRY-RUN]" },
  block: { icon: "🚫", text: "[EXCLUDE]" },
  pen: { icon: "📝", text: "[CHANGE]" },
};

/**
 * Get icon or text based on configuration
 * @param {string} type - Icon type
 * @returns {string} Icon or text representation
 */
function getIcon(type) {
  if (!ICONS[type]) return "";
  return CONFIG.showIcons ? ICONS[type].icon : ICONS[type].text;
}

/**
 * Format message with icon
 * @param {string} type - Icon type
 * @param {string} message - Message to display
 * @returns {string} Formatted message
 */
function formatMessage(type, message) {
  const icon = getIcon(type);
  return icon ? `${icon} ${message}` : message;
}

// ========================
// Utility Functions
// ========================

/**
 * Process class and className attributes in content
 * @param {string} content - Content to process
 * @param {Function} processor - Function to process class values
 * @returns {string} Processed content
 */
function processClassAttributes(content, processor) {
  // Process string literal class values
  content = content.replace(
    /\b(class|className)\s*=\s*(["'`])([\s\S]*?)\2/g,
    (match, attribute, quote, value) => {
      return `${attribute}=${quote}${processor(value)}${quote}`;
    }
  );

  // Process expression-based class values
  content = content.replace(
    /\b(class|className)\s*=\s*\{([\s\S]*?)\}/g,
    (match, attribute, expression) => {
      const processedExpression = expression.replace(
        /(["'`])([\s\S]*?)\1/g,
        (m, quote, innerValue) => quote + processor(innerValue) + quote
      );
      return `${attribute}={${processedExpression}}`;
    }
  );

  return content;
}

/**
 * Escape special regex characters in a string
 * @param {string} string - String to escape
 * @returns {string} Escaped string
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ========================
// File Processing
// ========================

/**
 * Process a single file for RTL transformation
 * @param {string} filePath - Path to the file
 * @param {Object} options - Processing options
 * @returns {Promise<Object>} Processing result
 */
async function processFile(filePath, options = {}) {
  const fileName = path.basename(filePath);

  // Check if file should be excluded
  if (FILES_TO_EXCLUDE.has(fileName)) {
    console.log(formatMessage("skip", `Skipping excluded file: ${filePath}`));
    return {
      filePath,
      wasModified: false,
      skipped: true,
    };
  }

  try {
    // Read file content
    const originalContent = await fs.readFile(filePath, DEFAULT_ENCODING);

    // Validate it looks like a React/JSX component
    if (!originalContent.includes('className') && !originalContent.includes('class=')) {
      if (options.verbose) {
        console.log(formatMessage("skip", `No className attributes found: ${filePath}`));
      }
      return {
        filePath,
        wasModified: false,
        skipped: true,
      };
    }
    
    // Skip if dry run
    if (options.dryRun) {
      const transformedContent = transformTailwindClasses(originalContent);
      const wouldChange = originalContent !== transformedContent;
      const icon = wouldChange ? getIcon("pen") : getIcon("check");
      const status = wouldChange ? "would be modified" : "no changes needed";
      console.log(`${icon} [DRY RUN] ${filePath} ${status}`);
      return {
        filePath,
        wasModified: false,
        wouldChange,
      };
    }
    
    // Transform content
    const transformedContent = transformTailwindClasses(originalContent);
    
    // Check if content was modified
    if (originalContent === transformedContent) {
      console.log(formatMessage("check", `No changes needed: ${filePath}`));
      return {
        filePath,
        wasModified: false,
      };
    }
    
    // Create backup if requested
    if (options.backup) {
      const backupPath = `${filePath}.backup`;
      await fs.writeFile(backupPath, originalContent, DEFAULT_ENCODING);
      console.log(formatMessage("backup", `Backup created: ${backupPath}`));
    }
    
    // Write transformed content
    await fs.writeFile(filePath, transformedContent, DEFAULT_ENCODING);
    console.log(formatMessage("sparkle", `Successfully transformed: ${filePath}`));
    
    return {
      filePath,
      wasModified: true,
    };
  } catch (error) {
    console.error(formatMessage("error", `Error processing ${filePath}: ${error.message}`));
    return {
      filePath,
      wasModified: false,
      error,
    };
  }
}

/**
 * Recursively find all files matching the pattern
 * @param {string} directory - Directory to search
 * @param {RegExp} pattern - Pattern to match files
 * @returns {Promise<string[]>} Array of file paths
 */
async function findFilesRecursively(directory, pattern) {
  const files = [];
  const entries = await fs.readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    
    if (entry.isDirectory()) {
      const subFiles = await findFilesRecursively(fullPath, pattern);
      files.push(...subFiles);
    } else if (entry.isFile() && pattern.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

// ========================
// CLI Interface
// ========================

/**
 * Display help information
 */
function displayHelp() {
  const divider = CONFIG.showIcons ? "═".repeat(60) : "=".repeat(60);
  const icon = CONFIG.showIcons ? "📋 " : "";

  const banner = `
${divider}
         ${icon}shadcn RTL Transform - Version 1.0.0
     Convert shadcn/ui components to RTL automatically
${divider}`;

  console.log(banner);
  console.log(`
USAGE:
  node index.js [options]

OPTIONS:
  --path, -p <dir>     Path to components directory 
                       (default: ${DEFAULT_COMPONENTS_DIRECTORY})
  
  --dry-run, -d        Preview changes without modifying files
  
  --backup, -b         Create backup files before transformation
  
  --verbose, -v        Enable verbose logging
  
  --no-icons           Disable emoji icons in output (use plain text)
  
  --no-rotate-icons    Skip rotating directional icons (ChevronLeft, ArrowRight, etc.)
  
  --exclude, -e <list> Comma-separated list of files to exclude
  
  --help, -h           Display this help message

EXAMPLES:
  # Transform all components in default directory
  node index.js

  # Transform with custom path
  node index.js --path ./src/components

  # Preview changes without modifying
  node index.js --dry-run

  # Create backups before transformation
  node index.js --backup

  # Plain text output (no emoji icons)
  node index.js --no-icons

  # Skip rotating directional icons
  node index.js --no-rotate-icons

  # Exclude specific files
  node index.js --exclude "dialog.tsx,modal.tsx"

ICON ROTATION:
  By default, the following icons will be rotated 180° in RTL:
  ${DIRECTIONAL_ICON_COMPONENTS.slice(0, 4).join(', ')}
  ${DIRECTIONAL_ICON_COMPONENTS.slice(4, 8).join(', ')}
  ${DIRECTIONAL_ICON_COMPONENTS.slice(8).join(', ')}
  
  Use --no-rotate-icons to disable this behavior.

DOCUMENTATION:
  https://github.com/Saleh7/shadcnui-rtl
  `);
}

/**
 * Parse and validate CLI arguments
 * @param {string[]} argv - Command line arguments
 * @returns {Object} Parsed arguments
 */
function parseArguments(argv) {
  return minimist(argv.slice(2), {
    string: ["path", "exclude"],
    boolean: ["dry-run", "backup", "verbose", "help", "no-icons", "no-rotate-icons"],
    alias: {
      p: "path",
      d: "dry-run",
      b: "backup",
      v: "verbose",
      h: "help",
      e: "exclude",
    },
    default: {
      path: DEFAULT_COMPONENTS_DIRECTORY,
      "dry-run": false,
      backup: false,
      verbose: false,
      "no-icons": false,
      "no-rotate-icons": false,
    },
  });
}

/**
 * Display processing summary
 * @param {Object} summary - Processing summary
 */
function displaySummary(summary) {
  const divider = "═".repeat(60);
  
  console.log("\n" + divider);
  console.log("                    📊 TRANSFORMATION SUMMARY");
  console.log(divider);
  
  // Display counts with proper alignment
  const stats = [
    { label: "Total files processed", value: summary.totalFilesProcessed, icon: "📁" },
    { label: "Files modified", value: summary.filesModified, icon: "✏️" },
    { label: "Files unchanged", value: summary.filesUnchanged, icon: "✅" },
    { label: "Files skipped", value: summary.filesSkipped, icon: "⏭️" },
  ];
  
  stats.forEach(({ label, value, icon }) => {
    console.log(`${icon}  ${label.padEnd(25, '.')} ${value}`);
  });
  
  if (summary.errors.length > 0) {
    console.log(`❌  ${"Errors encountered".padEnd(25, '.')} ${summary.errors.length}`);
    if (summary.verbose) {
      console.log("\n" + "─".repeat(60));
      console.log("ERROR DETAILS:");
      summary.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error.filePath}: ${error.message}`);
      });
    }
  }
  
  console.log(divider);
  
  // Display final status
  if (summary.errors.length === 0) {
    console.log("✨ RTL transformation completed successfully!");
  } else {
    console.log("⚠️  Transformation completed with errors.");
  }
  
  console.log(divider + "\n");
}

// ========================
// Main Application Entry
// ========================

/**
 * Main application entry point
 */
async function main() {
  const args = parseArguments(process.argv);

  // Apply configuration from arguments first (before displaying help)
  // Note: minimist converts --no-icons to { icons: false }
  CONFIG.showIcons = args.icons !== false && !args["no-icons"];
  CONFIG.rotateDirectionalIcons = args["rotate-icons"] !== false && !args["no-rotate-icons"];

  // Display help if requested
  if (args.help) {
    displayHelp();
    process.exit(0);
  }

  const componentsDirectory = path.resolve(args.path);
  
  // Update excluded files if provided
  if (args.exclude) {
    const excludedFiles = args.exclude.split(',').map(f => f.trim());
    excludedFiles.forEach(file => FILES_TO_EXCLUDE.add(file));
  }
  
  // Validate directory exists
  try {
    await fs.access(componentsDirectory);
  } catch {
    console.error(formatMessage("error", `Directory not found: ${componentsDirectory}`));
    console.log(formatMessage("tip", "Use --path to specify the correct components directory"));
    console.log(`   Example: node index.js --path ./src/components\n`);
    process.exit(1);
  }

  // Display startup banner
  const divider = CONFIG.showIcons ? "═".repeat(60) : "=".repeat(60);
  const subDivider = CONFIG.showIcons ? "─".repeat(60) : "-".repeat(60);
  
  console.log("\n" + divider);
  console.log(CONFIG.showIcons 
    ? "        🚀 Starting shadcn RTL Transformation"
    : "        Starting shadcn RTL Transformation");
  console.log(divider);
  console.log(formatMessage("folder", `Target directory: ${componentsDirectory}`));
  console.log(formatMessage("search", `File pattern: ${FILE_EXTENSION_PATTERN}`));
  
  if (args["dry-run"]) {
    console.log(formatMessage("test", "Mode: DRY RUN (no files will be modified)"));
  }
  if (args.backup) {
    console.log(formatMessage("backup", "Backup: ENABLED"));
  }
  if (!CONFIG.rotateDirectionalIcons) {
    console.log(formatMessage("info", "Icon rotation: DISABLED"));
  }
  if (args.exclude) {
    console.log(formatMessage("block", `Excluding: ${args.exclude}`));
  }
  
  console.log(subDivider + "\n");
  
  // Find all target files
  const targetFiles = await findFilesRecursively(
    componentsDirectory,
    FILE_EXTENSION_PATTERN
  );
  
  if (targetFiles.length === 0) {
    console.log(formatMessage("warning", `No files found matching pattern: ${FILE_EXTENSION_PATTERN}`));
    console.log("\n" + formatMessage("tip", "Tips:"));
    console.log("  - Check if the path is correct");
    console.log("  - Ensure your components use .tsx or .jsx extension");
    console.log("  - Try running from your project root directory\n");
    process.exit(0);
  }
  
  console.log(formatMessage("folder", `Found ${targetFiles.length} file${targetFiles.length !== 1 ? 's' : ''} to process\n`));
  
  // Process all files
  const summary = {
    totalFilesProcessed: 0,
    filesModified: 0,
    filesUnchanged: 0,
    filesSkipped: 0,
    errors: [],
    verbose: args.verbose,
  };

  for (const filePath of targetFiles) {
    const result = await processFile(filePath, {
      dryRun: args["dry-run"],
      backup: args.backup,
      verbose: args.verbose,
    });
    
    summary.totalFilesProcessed++;
    
    if (result.error) {
      summary.errors.push({
        filePath: result.filePath,
        message: result.error.message,
      });
    } else if (result.skipped) {
      summary.filesSkipped++;
    } else if (result.wasModified) {
      summary.filesModified++;
    } else {
      summary.filesUnchanged++;
    }
  }

  // Display final summary
  displaySummary(summary);
  
  // Exit with error code if there were errors
  if (summary.errors.length > 0) {
    process.exit(1);
  }
}

// ========================
// Error Handling
// ========================

process.on("unhandledRejection", (error) => {
  console.error("\n❌ Unhandled error:", error);
  console.error("\n💡 This might be a bug. Please report it at:");
  console.error("   https://github.com/Saleh7/shadcnui-rtl/issues\n");
  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("\n\n⚠️  Transformation interrupted by user");
  console.log("   Some files may have been partially processed.\n");
  process.exit(130);
});

// ========================
// Execute Application
// ========================

// Only run main if this file is executed directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("\n❌ Fatal error:", error.message);

    if (error.stack && process.env.DEBUG) {
      console.error("\nStack trace:");
      console.error(error.stack);
    }

    console.error("\n💡 For more details, run with DEBUG=1");
    process.exit(1);
  });
}

// ========================
// Exports for Library Usage
// ========================

export {
  transformTailwindClasses,
  processFile,
  findFilesRecursively,
  TAILWIND_LTR_TO_RTL_MAPPINGS,
  RTL_SPECIFIC_UTILITIES,
  DIRECTIONAL_ICON_COMPONENTS,
};