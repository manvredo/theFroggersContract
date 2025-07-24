// lib/sanityCheck.ts
import fs from "fs";
import path from "path";

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

function runSanityCheck() {
  console.log("🔎 Froggers Sanity Check läuft...");
  foldersToCheck.forEach((relPath) => {
    const filePath = path.resolve(process.cwd(), relPath);
    const exists = fs.existsSync(filePath);
    console.log(`${exists ? "✅" : "❌"} ${relPath} ${exists ? "gefunden" : "FEHLT!"}`);
  });
  console.log("✅ Check abgeschlossen.");
}

// 👉 Direkt ausführen
runSanityCheck();

