import fs from "fs";

const date = new Date().toISOString().replace(/:/g, "-");

fs.writeFileSync(`log/${date}.txt`, "string");

console.log("Datei wurde erfolgreich erstellt.");
