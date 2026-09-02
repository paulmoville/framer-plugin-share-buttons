import "@framer/plugin/framer.css"
import React from "react"
import ReactDOM from "react-dom/client"
import { App } from "./App.tsx"
import { SharePreview } from "./Preview.tsx"
import "./App.css"

const root = document.getElementById("root")
if (!root) throw new Error("Root element not found")

const scene = new URLSearchParams(window.location.search).get("scene")

function BarScene() {
    return (
        <div className="capture-bar">
            <SharePreview
                platforms={[
                    "copy",
                    "email",
                    "whatsapp",
                    "facebook",
                    "x",
                    "linkedin",
                ]}
                buttonStyle="outline"
                appearance="icon-label"
                heading="Share"
            />
        </div>
    )
}

ReactDOM.createRoot(root).render(
    <React.StrictMode>
        {scene === "bar" ? <BarScene /> : <App />}
    </React.StrictMode>
)
