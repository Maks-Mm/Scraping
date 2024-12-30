import { execSync, exec } from "child_process"; // Импорт для выполнения команд
import os from "os"; // Импорт для определения ОС


/*wir brauchen etwas ein Prozess zum beispil der die Duplikaten von start loswerden,anstopen,gesparren */


// Установка уникального имени процесса
const processName = "auto-scraping-and-analysis";
process.title = processName;

// Функция для проверки, запущен ли процесс
const isProcessRunning = (processName) => {
  try {
    // Определение команды в зависимости от ОС
    const platform = os.platform();
    let command;

    if (platform === "win32") {
      // Команда для Windows с добавлением .exe
      command = `tasklist /FI "IMAGENAME eq ${processName}.exe"`;
    } else if (platform === "darwin" || platform === "linux") {
      // Команда для macOS и Linux
      command = `ps -A | grep -w "${processName}"`;
    } else {
      throw new Error(`Неподдерживаемая платформа: ${platform}`);
    }

    const result = execSync(command); // Выполнение команды
    console.log(result.toString()); // Вывод результата для отладки
    return result.toString().includes(processName); // Проверка наличия процесса
  } catch {
    return false; // Процесс не найден
  }
};

// Проверка, запущен ли процесс
if (isProcessRunning(processName)) {
  console.log("Процесс уже запущен.");
  process.exit(0); // Завершение, если уже есть запущенный экземпляр
}

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
    "npm run clean-up"
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
