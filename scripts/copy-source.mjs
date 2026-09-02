import { cpSync, mkdirSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const dest = resolve(root, "dist/source")

mkdirSync(dest, { recursive: true })

const skipPacked = new Set(["capture-main.tsx", "framer-mock.ts"])

for (const item of [
    "src",
    "public",
    "framer.json",
    "package.json",
    "vite.config.ts",
    "tsconfig.json",
    "eslint.config.js",
    "index.html",
    "README.md",
]) {
    cpSync(resolve(root, item), resolve(dest, item), {
        recursive: true,
        filter: (source) => !skipPacked.has(source.split("/").pop() ?? ""),
    })
}

writeFileSync(
    resolve(dest, "BUILD.md"),
    [
        "Rebuild this plugin from source:",
        "",
        "npm install",
        "npm run build",
        "npm run pack",
        "",
        "Then upload the generated plugin.zip to the Framer Marketplace.",
        "",
    ].join("\n")
)
