import {
    framer,
    FramerPluginClosedError,
    isComponentInstanceNode,
    useIsAllowedTo,
} from "@framer/plugin"
import { useCallback, useLayoutEffect, useMemo, useState, type KeyboardEvent } from "react"
import pluginManifestSource from "../framer.json?raw"
import shareButtonsSource from "./insert/ShareButtons.tsx?raw"
import { isNearBlackBrand, isPluginLiftBrand, PlatformIcon, SharePreview } from "./Preview.tsx"
import "./App.css"

const CODE_FILE_NAME = "ShareButtons.tsx"
const PLUGIN_VERSION =
    (JSON.parse(pluginManifestSource) as { version?: string }).version ?? "1.0.0"
const PLUGIN_AUTHOR = "Lebel Studio"
const SUPPORT_EMAIL = "hello@wearelebel.com"
const SUPPORT_URL = `mailto:${SUPPORT_EMAIL}?subject=Share%20Buttons%20plugin`
const DOCS_URL = "https://www.framer.com/help/articles/plugin-best-practices/"

const PLATFORM_OPTIONS = [
    { id: "copy", label: "Copy" },
    { id: "email", label: "Email" },
    { id: "facebook", label: "Facebook" },
    { id: "x", label: "X" },
    { id: "threads", label: "Threads" },
    { id: "bluesky", label: "Bluesky" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "pinterest", label: "Pinterest" },
    { id: "reddit", label: "Reddit" },
    { id: "whatsapp", label: "WhatsApp" },
    { id: "telegram", label: "Telegram" },
    { id: "line", label: "LINE" },
    { id: "tumblr", label: "Tumblr" },
    { id: "vk", label: "VK" },
    { id: "weibo", label: "Weibo" },
    { id: "hackernews", label: "HN" },
    { id: "pocket", label: "Pocket" },
    { id: "buffer", label: "Buffer" },
    { id: "flipboard", label: "Flipboard" },
    { id: "xing", label: "Xing" },
    { id: "print", label: "Print" },
    { id: "native", label: "Native" },
] as const

type PlatformId = (typeof PLATFORM_OPTIONS)[number]["id"]
type ButtonStyle = "outline" | "filled" | "ghost" | "brand"
type Appearance = "icon" | "icon-label" | "label"
type PresetId = "minimal" | "social" | "chat"

const PRESETS: Record<PresetId, PlatformId[]> = {
    minimal: ["copy", "native"],
    social: ["copy", "facebook", "x", "linkedin"],
    chat: ["copy", "email", "whatsapp"],
}

const POPULAR_IDS: PlatformId[] = [
    "copy",
    "email",
    "facebook",
    "x",
    "threads",
    "linkedin",
    "pinterest",
    "reddit",
    "whatsapp",
    "telegram",
    "bluesky",
    "line",
]

const MORE_IDS: PlatformId[] = [
    "tumblr",
    "vk",
    "weibo",
    "hackernews",
    "pocket",
    "buffer",
    "flipboard",
    "xing",
    "print",
    "native",
]

const DEFAULT_PLATFORMS: PlatformId[] = [...PRESETS.chat]

const INSERT_METHODS = ["createCodeFile", "addComponentInstance"] as const
const UPDATE_METHODS = ["CodeFile.setFileContent"] as const
const APPLY_METHODS = ["Node.setAttributes"] as const

function ignoreIfClosed(error: unknown) {
    if (error instanceof FramerPluginClosedError) return true
    return false
}

function sameOrder(a: readonly PlatformId[], b: readonly PlatformId[]) {
    return a.length === b.length && a.every((id, index) => id === b[index])
}

function matchingPreset(platforms: readonly PlatformId[]): PresetId | null {
    for (const id of Object.keys(PRESETS) as PresetId[]) {
        if (sameOrder(platforms, PRESETS[id])) return id
    }
    return null
}

function Glyph({
    kind,
}: {
    kind: "search" | "chevron" | "insert" | "layers"
}) {
    if (kind === "search") {
        return (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="6" cy="6" r="4.25" stroke="currentColor" strokeWidth="1.4" />
                <path d="M9.2 9.2L12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
        )
    }

    if (kind === "chevron") {
        return (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                    d="M3 4.5L6 7.5 9 4.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        )
    }

    if (kind === "insert") {
        return (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
                <path d="M7 4.75v4.5M4.75 7h4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
        )
    }

    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
                d="M2.5 4.2 7 2.4l4.5 1.8L7 6 2.5 4.2z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinejoin="round"
            />
            <path
                d="M2.5 7.1 7 8.9l4.5-1.8"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M2.5 10 7 11.8l4.5-1.8"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

function LibraryChip({
    id,
    label,
    selected,
    onClick,
}: {
    id: PlatformId
    label: string
    selected: boolean
    onClick: () => void
}) {
    const lift = isPluginLiftBrand(id)
    return (
        <button
            type="button"
            className={`library-chip${selected ? " is-selected" : ""}${lift ? " is-near-black-brand" : ""}`}
            title={label}
            aria-pressed={selected}
            onClick={onClick}
        >
            <PlatformIcon
                id={id}
                size={14}
                color={isNearBlackBrand(id) ? "currentColor" : undefined}
            />
            <span>{label}</span>
        </button>
    )
}

const APPEARANCE_OPTIONS = [
    { value: "icon", label: "Icon" },
    { value: "icon-label", label: "Icon + Label" },
    { value: "label", label: "Label" },
] as const

function AppearanceMark({
    id,
    background,
}: {
    id: PlatformId
    background: string
}) {
    const lift = isPluginLiftBrand(id) || isNearBlackBrand(id)
    return (
        <span
            className={lift ? "appearance-mark is-near-black-brand" : "appearance-mark"}
            style={{ background }}
        >
            <PlatformIcon id={id} color="currentColor" size={8} />
        </span>
    )
}

function AppearanceMini({ value }: { value: Appearance }) {
    if (value === "icon") {
        return (
            <span className="appearance-pill">
                <AppearanceMark id="facebook" background="#1877F2" />
                <AppearanceMark id="linkedin" background="#0A66C2" />
                <AppearanceMark id="x" background="#111111" />
            </span>
        )
    }

    if (value === "icon-label") {
        return (
            <span className="appearance-pill">
                <AppearanceMark id="copy" background="#111111" />
                <span className="appearance-plus">+</span>
                <span className="appearance-pill-text">Share</span>
            </span>
        )
    }

    return (
        <span className="appearance-pill">
            <span className="appearance-pill-text">Share</span>
        </span>
    )
}

async function waitForInsertUrl(fileId: string) {
    for (let attempt = 0; attempt < 8; attempt++) {
        const file = await framer.getCodeFile(fileId)
        const componentExport = file?.exports.find((item) => item.type === "component")
        if (componentExport?.insertURL) return componentExport.insertURL
        await new Promise((resolve) => window.setTimeout(resolve, 250))
    }
    return null
}

async function findShareButtonsFile() {
    const files = await framer.getCodeFiles()
    return files.find((item) => item.path === CODE_FILE_NAME || item.name === CODE_FILE_NAME)
}

export function App() {
    const canInsert = useIsAllowedTo(...INSERT_METHODS)
    const canUpdate = useIsAllowedTo(...UPDATE_METHODS)
    const canApply = useIsAllowedTo(...APPLY_METHODS)
    const canWrite = canInsert && canUpdate

    const [platforms, setPlatforms] = useState<PlatformId[]>(DEFAULT_PLATFORMS)
    const [buttonStyle, setButtonStyle] = useState<ButtonStyle>("ghost")
    const [appearance, setAppearance] = useState<Appearance>("icon")
    const [heading, setHeading] = useState("Share")
    const [busy, setBusy] = useState(false)
    const [status, setStatus] = useState<string | null>(null)
    const [query, setQuery] = useState("")
    const [moreOpen, setMoreOpen] = useState(true)
    const [overwritePrompt, setOverwritePrompt] = useState(false)

    useLayoutEffect(() => {
        void framer.showUI({
            position: "top right",
            width: 760,
            height: 760,
            minWidth: 360,
            minHeight: 600,
            maxWidth: 880,
            resizable: true,
        })

        void framer.setMenu([
            {
                label: "Documentation",
                onAction: () => {
                    window.open(DOCS_URL, "_blank", "noopener,noreferrer")
                },
            },
            {
                label: "Email support",
                onAction: () => {
                    window.open(SUPPORT_URL, "_blank", "noopener,noreferrer")
                },
            },
            { type: "separator" },
            {
                label: `Version ${PLUGIN_VERSION}`,
                enabled: false,
            },
            {
                label: `By ${PLUGIN_AUTHOR}`,
                enabled: false,
            },
        ])
    }, [])

    const activePreset = matchingPreset(platforms)
    const search = query.trim().toLowerCase()
    const isSearching = search.length > 0
    const visible = useMemo(() => {
        const matches = (id: PlatformId, label: string) => {
            if (!search) return true
            return label.toLowerCase().includes(search) || id.toLowerCase().includes(search)
        }
        const byId = Object.fromEntries(
            PLATFORM_OPTIONS.map((platform) => [platform.id, platform])
        ) as Record<PlatformId, (typeof PLATFORM_OPTIONS)[number]>
        return {
            popular: POPULAR_IDS.filter((id) => matches(id, byId[id].label)).map((id) => byId[id]),
            more: MORE_IDS.filter((id) => matches(id, byId[id].label)).map((id) => byId[id]),
            all: PLATFORM_OPTIONS.filter((platform) => matches(platform.id, platform.label)),
        }
    }, [search])

    const applyPreset = useCallback((id: PresetId) => {
        setPlatforms([...PRESETS[id]])
    }, [])

    const togglePlatform = useCallback((id: PlatformId) => {
        setPlatforms((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id]
        )
    }, [])

    const onAppearanceKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            if (
                event.key !== "ArrowLeft" &&
                event.key !== "ArrowRight" &&
                event.key !== "ArrowUp" &&
                event.key !== "ArrowDown" &&
                event.key !== "Home" &&
                event.key !== "End"
            ) {
                return
            }

            event.preventDefault()
            const values = APPEARANCE_OPTIONS.map((option) => option.value)
            const index = values.indexOf(appearance)
            let next = index
            if (event.key === "Home") next = 0
            else if (event.key === "End") next = values.length - 1
            else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                next = (index - 1 + values.length) % values.length
            } else {
                next = (index + 1) % values.length
            }

            const value = values[next]
            setAppearance(value)
            event.currentTarget
                .querySelector<HTMLButtonElement>(`[data-appearance="${value}"]`)
                ?.focus()
        },
        [appearance]
    )

    const controls = useMemo(
        () => ({
            platforms,
            buttonStyle,
            appearance,
            heading,
            showHeading: heading.trim().length > 0,
        }),
        [appearance, buttonStyle, heading, platforms]
    )

    const insertShare = useCallback(async (writeMode: "auto" | "keep" | "replace" = "auto") => {
        setStatus(null)

        if (platforms.length === 0) {
            setOverwritePrompt(false)
            setStatus("Select at least one platform.")
            return
        }

        setBusy(true)

        try {
            let file = await findShareButtonsFile()

            if (file && writeMode === "auto") {
                setOverwritePrompt(true)
                setStatus(
                    "This project already has ShareButtons.tsx. Keep that file, or replace it with this plugin version before inserting."
                )
                return
            }

            setOverwritePrompt(false)

            if (!file) {
                if (!framer.isAllowedTo("createCodeFile")) {
                    framer.notify("You don’t have permission to create code files.", {
                        variant: "error",
                    })
                    setStatus("Permission needed to create the Share Buttons file.")
                    return
                }

                try {
                    file = await framer.createCodeFile(
                        CODE_FILE_NAME,
                        shareButtonsSource,
                        { editViaPlugin: true }
                    )
                } catch (error) {
                    if (ignoreIfClosed(error)) return
                    framer.notify("Could not create the Share Buttons file.", {
                        variant: "error",
                    })
                    setStatus("Could not create the code file. Try again.")
                    return
                }
            } else if (writeMode === "replace") {
                if (!framer.isAllowedTo("CodeFile.setFileContent")) {
                    framer.notify("You don’t have permission to update code files.", {
                        variant: "error",
                    })
                    setStatus("Permission needed to update the Share Buttons file.")
                    return
                }

                try {
                    file = await file.setFileContent(shareButtonsSource)
                } catch (error) {
                    if (ignoreIfClosed(error)) return
                    framer.notify("Could not update the Share Buttons file.", {
                        variant: "error",
                    })
                    setStatus("Could not update the code file. Try again.")
                    return
                }
            }

            const insertURL = await waitForInsertUrl(file.id)
            if (!insertURL) {
                framer.notify("Share Buttons is not ready yet. Try inserting again.", {
                    variant: "warning",
                })
                setStatus("Component is compiling. Click Insert again in a moment.")
                return
            }

            if (!framer.isAllowedTo("addComponentInstance")) {
                framer.notify("You don’t have permission to insert components.", {
                    variant: "error",
                })
                setStatus("Permission needed to insert on the canvas.")
                return
            }

            try {
                const node = await framer.addComponentInstance({
                    url: insertURL,
                    attributes: {
                        width: "420px",
                        height: "88px",
                        controls,
                    },
                })

                await framer.navigateTo(node.id, { select: true })
                framer.notify("Share Buttons inserted", { variant: "success" })
                if (writeMode === "replace") {
                    setStatus("Replaced ShareButtons.tsx and inserted it. Customize in Properties.")
                } else if (writeMode === "keep") {
                    setStatus("Inserted using the existing ShareButtons.tsx file.")
                } else {
                    setStatus("Created ShareButtons.tsx and inserted it. Customize in Properties.")
                }
            } catch (error) {
                if (ignoreIfClosed(error)) return
                framer.notify("Could not place Share Buttons on the canvas.", {
                    variant: "error",
                })
                setStatus("Could not place the component on the canvas.")
            }
        } catch (error) {
            if (ignoreIfClosed(error)) return
            framer.notify("Something went wrong. Please try again.", {
                variant: "error",
            })
            setStatus("Something went wrong. Please try again.")
        } finally {
            setBusy(false)
        }
    }, [controls, platforms.length])

    const applyToSelection = useCallback(async () => {
        setStatus(null)

        if (!framer.isAllowedTo("Node.setAttributes")) {
            framer.notify("You don’t have permission to edit the selection.", {
                variant: "error",
            })
            setStatus("Permission needed to update the selected layer.")
            return
        }

        try {
            const selection = await framer.getSelection()
            const instance = selection.find(isComponentInstanceNode)
            if (!instance) {
                setStatus("Select a Share Buttons instance first.")
                return
            }

            setBusy(true)
            await instance.setAttributes({ controls })
            framer.notify("Share Buttons updated", { variant: "success" })
            setStatus("Applied platforms, order, and look to the selection.")
        } catch (error) {
            if (ignoreIfClosed(error)) return
            framer.notify("Could not update the selected component.", {
                variant: "error",
            })
            setStatus("Could not update the selected component.")
        } finally {
            setBusy(false)
        }
    }, [controls])

    return (
        <main>
            <div className="pane pane-config">
                <header className="brand">
                    <img className="brand-mark" src="/icon.svg" alt="" width={32} height={32} />
                    <div className="brand-copy">
                        <h1>Share Buttons</h1>
                    </div>
                </header>

                <p className="lede">
                    Insert a customizable share bar. This creates a code file named
                    ShareButtons.tsx in the project, then places an instance on the
                    canvas. Social posts use the page URL so Framer Page Settings
                    keep SEO and Open Graph previews.
                </p>

                <section className="block">
                    <h2>Preset</h2>
                    <div className="segmented presets">
                        {(
                            [
                                ["minimal", "Minimal"],
                                ["social", "Social"],
                                ["chat", "Chat"],
                            ] as const
                        ).map(([value, label]) => (
                            <button
                                key={value}
                                type="button"
                                className={activePreset === value ? "is-selected" : undefined}
                                aria-pressed={activePreset === value}
                                onClick={() => applyPreset(value)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </section>

                <section className="block">
                    <h2>Platforms</h2>
                    {platforms.length === 0 ? (
                        <p className="empty-note">Select at least one platform.</p>
                    ) : null}

                    <label className="search">
                        <Glyph kind="search" />
                        <input
                            type="search"
                            value={query}
                            placeholder="Search platforms"
                            onChange={(event) => setQuery(event.target.value)}
                        />
                    </label>

                    {isSearching ? (
                        visible.all.length > 0 ? (
                            <div className="library-grid">
                                {visible.all.map((platform) => (
                                    <LibraryChip
                                        key={platform.id}
                                        id={platform.id}
                                        label={platform.label}
                                        selected={platforms.includes(platform.id)}
                                        onClick={() => togglePlatform(platform.id)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="empty-note">No platforms match “{query.trim()}”.</p>
                        )
                    ) : (
                        <>
                            <h2>Popular</h2>
                            <div className="library-grid">
                                {visible.popular.map((platform) => (
                                    <LibraryChip
                                        key={platform.id}
                                        id={platform.id}
                                        label={platform.label}
                                        selected={platforms.includes(platform.id)}
                                        onClick={() => togglePlatform(platform.id)}
                                    />
                                ))}
                            </div>

                            <button
                                type="button"
                                className="disclosure"
                                aria-expanded={moreOpen}
                                onClick={() => setMoreOpen((open) => !open)}
                            >
                                More platforms
                                <Glyph kind="chevron" />
                            </button>
                            {moreOpen ? (
                                <div className="library-grid">
                                    {visible.more.map((platform) => (
                                        <LibraryChip
                                            key={platform.id}
                                            id={platform.id}
                                            label={platform.label}
                                            selected={platforms.includes(platform.id)}
                                            onClick={() => togglePlatform(platform.id)}
                                        />
                                    ))}
                                </div>
                            ) : null}
                        </>
                    )}
                </section>
            </div>

            <div className="pane pane-style">
                <section className="block">
                    <h2>Preview</h2>
                    <div className="preview-stage" aria-label="Live preview">
                        <SharePreview
                            platforms={platforms}
                            buttonStyle={buttonStyle}
                            appearance={appearance}
                            heading={heading}
                        />
                    </div>
                    <p className="hint">✨ Preview updates in real time.</p>
                </section>

                <label className="field">
                    <span>Heading</span>
                    <input
                        type="text"
                        value={heading}
                        placeholder="Share"
                        onChange={(event) => setHeading(event.target.value)}
                    />
                </label>

                <section className="block">
                    <h2>Look</h2>
                    <div className="look-grid">
                        {(
                            [
                                ["outline", "Outline"],
                                ["filled", "Filled"],
                                ["ghost", "Ghost"],
                                ["brand", "Brand"],
                            ] as const
                        ).map(([value, label]) => (
                            <button
                                key={value}
                                type="button"
                                className={`look-card${buttonStyle === value ? " is-selected" : ""}`}
                                aria-pressed={buttonStyle === value}
                                onClick={() => setButtonStyle(value)}
                            >
                                <span className={`look-swatch look-swatch-${value}`} />
                                {label}
                            </button>
                        ))}
                    </div>
                </section>

                <section className="block">
                    <h2 id="appearance-heading">Appearance</h2>
                    <div
                        className="appearance-grid"
                        role="radiogroup"
                        aria-labelledby="appearance-heading"
                        onKeyDown={onAppearanceKeyDown}
                    >
                        {APPEARANCE_OPTIONS.map(({ value, label }) => {
                            const selected = appearance === value
                            return (
                                <button
                                    key={value}
                                    type="button"
                                    role="radio"
                                    aria-checked={selected}
                                    data-appearance={value}
                                    tabIndex={selected ? 0 : -1}
                                    className={
                                        selected
                                            ? "appearance-card is-selected"
                                            : "appearance-card"
                                    }
                                    onClick={() => setAppearance(value)}
                                >
                                    <span className="appearance-preview" aria-hidden="true">
                                        <AppearanceMini value={value} />
                                    </span>
                                    <span className="appearance-label">{label}</span>
                                </button>
                            )
                        })}
                    </div>
                </section>

                <div className="pane-dock">
                    {!canWrite ? (
                        <p className="status" role="status">
                            You need edit permission in this project to insert Share Buttons.
                        </p>
                    ) : null}

                    {status ? (
                        <p className={overwritePrompt ? "status confirm" : "status"} role="status">
                            {status}
                        </p>
                    ) : null}

                    {overwritePrompt ? (
                        <div className="actions">
                            <button
                                className="framer-button-primary"
                                type="button"
                                onClick={() => void insertShare("keep")}
                                disabled={!canWrite || busy}
                            >
                                <Glyph kind="insert" />
                                {busy ? "Inserting…" : "Keep existing file"}
                            </button>
                            <button
                                type="button"
                                onClick={() => void insertShare("replace")}
                                disabled={!canWrite || busy}
                            >
                                {busy ? "Replacing…" : "Replace file and insert"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setOverwritePrompt(false)
                                    setStatus(null)
                                }}
                                disabled={busy}
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div className="actions">
                            <button
                                className="framer-button-primary"
                                type="button"
                                onClick={() => void insertShare()}
                                disabled={!canWrite || busy}
                            >
                                <Glyph kind="insert" />
                                {busy ? "Inserting…" : "Insert on canvas"}
                            </button>
                            <button
                                type="button"
                                onClick={() => void applyToSelection()}
                                disabled={!canApply || busy}
                            >
                                <Glyph kind="layers" />
                                Apply to selection
                            </button>
                        </div>
                    )}

                    {!overwritePrompt ? (
                        <p className="hint">
                            Existing ShareButtons.tsx files are not overwritten unless you confirm.
                        </p>
                    ) : null}

                    <footer className="signature">
                        <p>Version {PLUGIN_VERSION}</p>
                        <p>{PLUGIN_AUTHOR}</p>
                        <p>
                            <a href={SUPPORT_URL}>{SUPPORT_EMAIL}</a>
                        </p>
                    </footer>
                </div>
            </div>
        </main>
    )
}
