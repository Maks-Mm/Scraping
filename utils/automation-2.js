import { execSync } from "child_process"; // Import for executing shell commands


// Function to check if the process is already running
const isProcessRunning = (processName) => {
  try {
    const result = execSync(`ps -A | grep ${processName}`);
    return result.toString().includes(processName);
  } catch {
    return false; // Process not found
  }
};

// Set a unique process name
const processName = "auto-scraping-and-analysis";
process.title = processName;

// Check if the process is already running
if (isProcessRunning(processName)) {
  console.log("Process is already running.");
  process.exit(0); // Exit if another instance is running
}

// Function to execute a command
const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command "${command}":`, error.message);
        reject(stderr);
        return;
      }
      console.log(`Result of command "${command}":\n`, stdout);
      resolve(stdout);
    });
  });
};

let isRunning = false; // Flag to track if tasks are currently running

// Function to run tasks
const runTasks = async () => {
  if (isRunning) {
    console.log("Tasks are already running. Skipping this interval.");
    return; // Prevent overlapping executions
  }

  isRunning = true; // Set the flag to indicate tasks are running

  // List of commands to execute
  const commands = [
    "npm run refresh-list",
    "npm run get-article",
    "npm run ai",
    "npm run ai-full",
    "npm run clean-up"
  ];

  try {
    for (const command of commands) {
      console.log(`Starting: ${command}`); // Log the command being executed
      await runCommand(command); // Execute the command
      console.log(`Command "${command}" executed successfully!`); // Log success
    }
  } catch (error) {
    console.error("An error occurred while executing tasks:", error); // Log error
  } finally {
    isRunning = false; // Reset the flag after tasks are completed
  }
};

// Function to start the automation
const startAutomation = () => {
  runTasks(); // Execute tasks immediately at start

  // Set an interval of 30 minutes
  setInterval(runTasks, 1000 * 60 * 30);
};

/*
This script prevents multiple instances of itself from running
by checking the process name before starting. It also avoids
overlapping task execution by using a flag to track state.
*/

// Start the automation
startAutomation();
