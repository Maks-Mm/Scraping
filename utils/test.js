import fs from "fs";

// C:\Users\<Ваше_Имя_Пользователя>\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup
// C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup

const date = new Date().toISOString().replace(/:/g, "-");

fs.writeFileSync(`log/${date}.txt`, "string");

console.log("Datei wurde erfolgreich erstellt.");
//meie aufagbe ,ich muss in der UhrApp so erstellen ,dass die Aufgabe interwal mit uhrzeit mit pause 1 stunde schafft
