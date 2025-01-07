import { exec } from "child_process"; 
import SingleInstance from "single-instance"; 

const processName = "auto-scraping-and-analysis";
const locker = new SingleInstance(processName);

const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Ошибка при выполнении команды "${command}":`, error.message);
        reject(stderr);
        return;
      }
      console.log(`Результат команды "${command}":\n`, stdout);
      resolve(stdout);
    });
  });
};

let isRunning = false; 

const runTasks = async () => {
  if (isRunning) {
    console.log("Задачи уже выполняются. Пропуск этого интервала.");
    return; 
  }

  isRunning = true; 

  const commands = [
    "npm run refresh-list",
    "npm run get-article",
    "npm run ai",
    "npm run ai-full",
    "npm run clean-up",
    "npm run sync"
  ];

  try {
    for (const command of commands) {
      console.log(`Запуск: ${command}`); 
      await runCommand(command); 
      console.log(`Команда "${command}" успешно выполнена!`); 
    }
  } catch (error) {
    console.error("Произошла ошибка при выполнении задач:", error); 
  } finally {
    isRunning = false; 
  }
};

locker.lock()
  .then(() => {
    console.log("Запущено одно приложение!");
    runTasks(); 
    
    setInterval(runTasks, 1000 * 60 * 30);
  })
  .catch((err) => {
    console.log("Процесс уже запущен.");
    process.exit(0); 
  });
