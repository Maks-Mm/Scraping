import { exec } from "child_process";
import SingleInstance from "single-instance";

const processName = "auto-scraping-and-analysis";
const locker = new SingleInstance(processName);

// Configuration for tasks
const taskConfig = {
  'refresh-list': { interval: 30 * 60 * 1000, retries: 3, priority: 1 }, // 30 minutes
  'get-article': { interval: 60 * 60 * 1000, retries: 3, priority: 2 }, // 1 hour
  'ai': { interval: 2 * 60 * 60 * 1000, retries: 2, priority: 3 }, // 2 hours
  'ai-full': { interval: 4 * 60 * 60 * 1000, retries: 2, priority: 4 }, // 4 hours
  'clean-up': { interval: 12 * 60 * 60 * 1000, retries: 1, priority: 5 }, // 12 hours
  'sync': { interval: 60 * 60 * 1000, retries: 3, priority: 1 } // 1 hour
};

// Task state management
const taskState = new Map();

const runCommand = async (command, retries = 0) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command "${command}":`, error.message);
        if (stderr) console.error('stderr:', stderr);
        reject({ error, stderr });
        return;
      }
      console.log(`Command "${command}" output:\n`, stdout);
      resolve(stdout);
    });
  });
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const runTaskWithRetry = async (command, maxRetries) => {
  let attempts = 0;
  while (attempts <= maxRetries) {
    try {
      console.log(`Running "${command}" (Attempt ${attempts + 1}/${maxRetries + 1})`);
      await runCommand(`npm run ${command}`);
      console.log(`Task "${command}" completed successfully!`);
      
      // Update task state
      taskState.set(command, {
        lastRun: Date.now(),
        status: 'success',
        nextRun: Date.now() + taskConfig[command].interval
      });
      
      return true;
    } catch (error) {
      attempts++;
      console.error(`Attempt ${attempts} failed for "${command}":`, error);
      
      if (attempts <= maxRetries) {
        const backoffTime = Math.min(1000 * Math.pow(2, attempts), 30000);
        console.log(`Retrying in ${backoffTime/1000} seconds...`);
        await sleep(backoffTime);
      } else {
        taskState.set(command, {
          lastRun: Date.now(),
          status: 'failed',
          nextRun: Date.now() + taskConfig[command].interval,
          error: error.message
        });
        throw new Error(`All ${maxRetries + 1} attempts failed for "${command}"`);
      }
    }
  }
};

let isRunning = false;

const runTasks = async () => {
  if (isRunning) {
    console.log("Tasks are already running. Skipping this interval.");
    return;
  }

  isRunning = true;
  console.log("Starting task execution cycle...");

  try {
    // Get tasks that need to run
    const now = Date.now();
    const tasksToRun = Object.entries(taskConfig)
      .filter(([taskName]) => {
        const state = taskState.get(taskName);
        return !state || now >= state.nextRun;
      })
      .sort((a, b) => a[1].priority - b[1].priority);

    if (tasksToRun.length === 0) {
      console.log("No tasks need to run at this time.");
      return;
    }

    // Execute tasks in priority order
    for (const [taskName, config] of tasksToRun) {
      try {
        await runTaskWithRetry(taskName, config.retries);
      } catch (error) {
        console.error(`Task "${taskName}" failed after all retry attempts:`, error);
        // Continue with other tasks even if one fails
      }
    }
  } catch (error) {
    console.error("Error in task execution cycle:", error);
  } finally {
    isRunning = false;
  }
};

// Initialize task state
Object.keys(taskConfig).forEach(taskName => {
  taskState.set(taskName, {
    lastRun: 0,
    status: 'pending',
    nextRun: Date.now()
  });
});

// Set up recurring task check
const TASK_CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes
setInterval(runTasks, TASK_CHECK_INTERVAL);

// Initial run
locker.lock()
  .then(() => {
    console.log("Single instance lock acquired - starting automation");
    runTasks();
  })
  .catch(err => {
    console.error("Failed to acquire lock - another instance may be running:", err);
    process.exit(1);
  });
