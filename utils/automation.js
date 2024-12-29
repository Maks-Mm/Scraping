import { exec } from "child_process"; // Import exec for executing commands
import fs from "fs"; // Import fs for filesystem operations
import path from "path"; // Import path for path operations
import { fileURLToPath } from 'url'; // Import for converting URL to path

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the lock file
const lockFilePath = path.join(__dirname, 'lockfile.tmp');

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

// Function to check if locked
const isLocked = () => {
  return fs.existsSync(lockFilePath); // Check if the lock file exists
};

// Function to set the lock
const setLock = () => {
  fs.writeFileSync(lockFilePath, "locked"); // Create the lock file
};

// Function to release the lock
const releaseLock = () => {
    console.log("releaseLock is started");
  if (fs.existsSync(lockFilePath)) {
    fs.unlinkSync(lockFilePath); // Delete the lock file
  }
};

// Function to run tasks
const runTasks = async () => {
  if (isLocked()) {
    console.log("Process is already running. Cannot start again."); // If locked
    return; // Exit
  }

  setLock(); // Set lock before starting tasks

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
      releaseLock();
    }
  } catch (error) {
    console.error("An error occurred while executing tasks:", error); // Log error
  } finally {
    releaseLock(); // Release the lock at the end
  }
};

// Function to start the automation
const startAutomation = () => {
  runTasks(); // Execute tasks immediately at start

  // Set an interval of 2 minutes 
  // (120,000 milliseconds)
  setInterval(runTasks, 1000*60*30);
 // setInterval(runTasks, 1000*60*2);
};
/*
wir brauchen eine Pfand ,der aus anderem Platz kommt ,und wir konnen nicht die Befehle aufstraten in Node Ordner

wir mussen neue Pfande schaffen die den Prozess ermoglichen 
*/
// Start the automation
startAutomation();
