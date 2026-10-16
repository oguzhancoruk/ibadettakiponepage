const fs = require("fs");
const crypto = require("crypto");
const manifest = JSON.parse(
  fs.readFileSync("build/asset-manifest.json", "utf8")
);
const version = crypto
  .createHash("sha256")
  .update(JSON.stringify(manifest.files))
  .digest("hex")
  .slice(0, 12);
const path = "build/sw.js";
const worker = fs
  .readFileSync(path, "utf8")
  .replace("prayer-shell-v1", `prayer-shell-${version}`);
fs.writeFileSync(path, worker);
