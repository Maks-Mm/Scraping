import fs from "fs";

// C:\Users\<Ваше_Имя_Пользователя>\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup
// C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup

const date = new Date().toISOString().replace(/:/g, "-");

fs.writeFileSync(`log/${date}.txt`, "string");

console.log("Datei wurde erfolgreich erstellt.");
/*
 wir haben ein Scraping von Artiklen ,mit dienen wir arbeiten mussen ,
 wir nehmen daten aus package.json um die daten im Terminal aufzurufen ,
 dabei schreiben wir ai...Nahme von verschiedenen Listen ,
 und wir brauchen einen Mechanismus der die Arbeit oder Aufgaben ubernehemt,
 die neue Daten zu prufen ,eventuell lochen wir sue in json waren ,
 also er muss der alles automatisieren  
*/