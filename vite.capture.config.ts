import path from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

const root = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: [
            {
                find: /^@framer\/plugin$/,
                replacement: path.join(root, "src/framer-mock.ts"),
            },
        ],
    },
    server: {
        port: 4188,
        strictPort: true,
    },
})
