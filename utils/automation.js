import { exec } from "child_process"; // Импорт для выполнения команд
import SingleInstance from "single-instance"; 

// Установка уникального имени процесса
const processName = "auto-scraping-and-analysis";
const locker = new SingleInstance(processName);

// Функция для выполнения команды
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

let isRunning = false; // Флаг для отслеживания выполнения задач

// Функция для выполнения задач
const runTasks = async () => {
  if (isRunning) {
    console.log("Задачи уже выполняются. Пропуск этого интервала.");
    return; // Предотвращение наложения выполнения
  }

  isRunning = true; // Установка флага, что задачи выполняются

  // Список команд для выполнения
  const commands = [
    "npm run refresh-list",
    "npm run get-article",
    "npm run ai",
    "npm run ai-full",
    "npm run clean-up",
  ];

  try {
    for (const command of commands) {
      console.log(`Запуск: ${command}`); // Лог текущей команды
      await runCommand(command); // Выполнение команды
      console.log(`Команда "${command}" успешно выполнена!`); // Лог успеха
    }
  } catch (error) {
    console.error("Произошла ошибка при выполнении задач:", error); // Лог ошибки
  } finally {
    isRunning = false; // Сброс флага после завершения задач
  }
};

// Проверка, является ли процесс единственным экземпляром
locker.lock()
  .then(() => {
    console.log("Запущено одно приложение!");
    runTasks(); // Запуск задач
    // Установка интервала 30 минут
    setInterval(runTasks, 1000 * 60 * 30);
  })
  .catch((err) => {
    console.log("Процесс уже запущен.");
    process.exit(0); // Завершение, если экземпляр уже существует
  });
