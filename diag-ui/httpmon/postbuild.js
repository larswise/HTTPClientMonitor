// scripts/copy-dist.js
import fs from "fs-extra";
import path from "path";

const source = path.resolve("dist");
const destination = path.resolve("../../Kapany.NextAPI/bin/Release/net8.0/diag-ui/httpmon");

fs.ensureDirSync(destination);
fs.copySync(source, destination, { overwrite: true });

console.log(`✅ Copied build from ${source} → ${destination}`);