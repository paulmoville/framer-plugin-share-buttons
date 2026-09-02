import "@framer/plugin/framer.css"
import { StrictMode, useEffect } from "react"
import { createRoot } from "react-dom/client"
import { App } from "../src/App.tsx"
import { SharePreview } from "../src/Preview.tsx"
import "../src/App.css"

const view = new URLSearchParams(window.location.search).get("view") ?? "plugin"

const SHOWCASE_PLATFORMS = ["copy", "email", "whatsapp", "facebook", "x", "linkedin"] as const

function clickWhen(selector: string, match?: (el: HTMLElement) => boolean) {
    const nodes = [...document.querySelectorAll<HTMLElement>(selector)]
    const target = match ? nodes.find(match) : nodes[0]
    target?.click()
}

function PluginCapture() {
    useEffect(() => {
        const id = window.setTimeout(() => {
            clickWhen(".look-card", (el) => (el.textContent ?? "").includes("Outline"))
            clickWhen('[data-appearance="icon-label"]')
            for (const label of ["Facebook", "X", "LinkedIn"]) {
                clickWhen(".library-chip", (el) => (el.textContent ?? "").trim() === label)
            }
        }, 50)
        return () => window.clearTimeout(id)
    }, [])

    return (
        <div id="plugin-frame">
            <App />
        </div>
    )
}

function BarCapture() {
    return (
        <div id="bar-frame">
            <SharePreview
                platforms={[...SHOWCASE_PLATFORMS]}
                buttonStyle="outline"
                appearance="icon-label"
                heading="Share"
            />
        </div>
    )
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>{view === "bar" ? <BarCapture /> : <PluginCapture />}</StrictMode>
)
