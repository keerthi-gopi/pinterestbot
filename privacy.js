// api/privacy.js
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default function handler(req, res) {
  const html = readFileSync(join(__dirname, "../public/privacy.html"), "utf-8");
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}