import { exec } from "child_process"; // Импорт для выполнения команд
import find from "find-process"; // Импорт для проверки процессов

// Установка уникального имени процесса
const processName = "auto-scraping-and-analysis";
process.title = processName;

// Функция для проверки, запущен ли процесс
const isProcessRunning = async (processName) => {
  try {
    // Поиск процессов по имени
    const processes = await find("name", processName);

    console.log(processes);

    // Проверяем, есть ли запущенные процессы с данным именем
    return processes.some((proc) => proc.name.includes(processName));
  } catch (error) {
    console.error("Ошибка при проверке процессов:", error);
    return false;
  }
};

// Проверка, запущен ли процесс
(async () => {
  if (await isProcessRunning(processName)) {
    console.log("Процесс уже запущен.");
    process.exit(0); // Завершение, если уже есть запущенный экземпляр
  }

  console.log("Запущено одно приложение!");

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

  // Функция для запуска автоматизации
  const startAutomation = () => {
    runTasks(); // Немедленный запуск задач при старте

    // Установка интервала 30 минут
    setInterval(runTasks, 1000 * 60 * 30);
  };

  // Запуск автоматизации
  startAutomation();
})();
