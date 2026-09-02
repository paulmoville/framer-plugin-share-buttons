import { chromium } from "playwright"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.dirname(fileURLToPath(import.meta.url))
const origin = "http://[::1]:4188"

const browser = await chromium.launch()
const pluginPage = await browser.newPage({
    viewport: { width: 760, height: 760 },
    deviceScaleFactor: 2,
})
await pluginPage.goto(`${origin}/capture.html`, { waitUntil: "networkidle" })
await pluginPage.waitForSelector("main")
await pluginPage.locator("main").screenshot({
    path: path.join(root, "plugin-capture.png"),
})

const preview = pluginPage.locator(".preview-stage")
if (await preview.count()) {
    await preview.screenshot({
        path: path.join(root, "preview-capture.png"),
    })
}

const barPage = await browser.newPage({
    viewport: { width: 1800, height: 240 },
    deviceScaleFactor: 2,
})
await barPage.goto(`${origin}/capture.html?scene=bar`, {
    waitUntil: "networkidle",
})
await barPage.addStyleTag({
    content: `
      .capture-bar .preview-frame,
      .capture-bar .preview-row {
        display: flex !important;
        flex-wrap: nowrap !important;
        width: max-content !important;
        max-width: none !important;
      }
      .capture-bar {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        background: transparent;
      }
    `,
})
await barPage.waitForSelector(".preview-frame")
await barPage.locator(".preview-frame").screenshot({
    path: path.join(root, "bar-capture.png"),
    omitBackground: true,
})

await browser.close()
console.log("captured plugin-capture.png, preview-capture.png, bar-capture.png")
