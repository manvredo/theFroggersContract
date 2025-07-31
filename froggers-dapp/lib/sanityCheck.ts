import fs from "fs";
import path from "path";
import chalk from "chalk";

const foldersToCheck = [
  "app/pages/index.tsx",
  "app/layout.tsx",
  "components/MintForm.tsx",
  "components/CroakUI.tsx",
  "hooks/useSaleToggle.ts",
  "data/proofs.json",
  "lib/wagmiConfig.ts",
  "lib/abi.json",
  "utils/getMerkleProof.ts",
  "styles/globals.css",
];

const logPath = path.resolve(process.cwd(), "tmp/sanity.log");
const runDeepCheck = process.argv.includes("--deep");

function log(message: string) {
  fs.appendFileSync(logPath, `${new Date().toISOString()} ${message}\n`);
}

function deepValidation(filePath: string) {
  try {
    const stats = fs.statSync(filePath);
    const sizeOk = stats.size > 10;
    const content = fs.readFileSync(filePath, "utf8");
    const containsContent = content.trim().length > 0;

    if (!sizeOk || !containsContent) {
      console.log(chalk.yellow(`⚠️ Datei ${path.basename(filePath)} wirkt leer oder suspekt.`));
      log(`WARNUNG: Datei ${filePath} könnte unvollständig sein.`);
    }
  } catch (error) {
    console.log(chalk.red(`❌ Deep Check Error für ${filePath}`));
    log(`ERROR bei Deep Check: ${filePath}`);
  }
}

function runSanityCheck() {
  console.log(chalk.blueBright("🔎 Froggers Sanity Check läuft..."));
  log("Sanity Check gestartet.");

  let failed = false;

  foldersToCheck.forEach((relPath) => {
    const filePath = path.resolve(process.cwd(), relPath);
    const exists = fs.existsSync(filePath);

    if (exists) {
      console.log(chalk.green(`✅ ${relPath} gefunden`));
      log(`OK: ${relPath}`);
      if (runDeepCheck) deepValidation(filePath);
    } else {
      console.log(chalk.red(`❌ ${relPath} FEHLT!`));
      log(`FEHLT: ${relPath}`);
      failed = true;
    }
  });

  console.log(chalk.magenta("🏁 Check abgeschlossen."));
  log("Sanity Check abgeschlossen.");

  if (failed) process.exit(1);
}

// 🐸 Direkt ausführen
runSanityCheck();