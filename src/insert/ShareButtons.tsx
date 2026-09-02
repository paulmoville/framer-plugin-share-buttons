/**
 * Isolated Share Buttons component. The plugin writes this single file into
 * the project. Replacing an existing file requires confirmation in the plugin.
 */
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import {
    startTransition,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
} from "react"

type PlatformId =
    | "copy"
    | "email"
    | "facebook"
    | "x"
    | "threads"
    | "bluesky"
    | "linkedin"
    | "pinterest"
    | "reddit"
    | "whatsapp"
    | "telegram"
    | "line"
    | "tumblr"
    | "vk"
    | "weibo"
    | "hackernews"
    | "pocket"
    | "buffer"
    | "flipboard"
    | "xing"
    | "print"
    | "native"

type ButtonStyle = "outline" | "filled" | "ghost" | "brand"
type LayoutDirection = "horizontal" | "vertical"
type Alignment = "start" | "center" | "end"
type Appearance = "icon" | "icon-label" | "label"

interface ResponsiveImageValue {
    src?: string
    alt?: string
}

interface LayoutControls {
    gap?: number
}

interface SizingControls {
    buttonSize?: number
    iconSize?: number
    radius?: number | string
    borderWidth?: number
}

interface ColorControls {
    fill?: string
    icon?: string
    text?: string
    border?: string
}

interface HoverControls {
    background?: string
    icon?: string
    text?: string
}

interface TypographyControls {
    heading?: CSSProperties
    buttons?: CSSProperties
}

interface ShareButtonsProps {
    /** @deprecated Built-in from the page. Kept optional so old instances type-check. */
    title?: string
    /** @deprecated Built-in from the page. Kept optional so old instances type-check. */
    url?: string
    /** @deprecated Built-in from og:image. Kept optional so old instances type-check. */
    image?: ResponsiveImageValue | string | null
    heading: string
    showHeading: boolean
    platforms: PlatformId[]
    appearance: Appearance
    buttonStyle: ButtonStyle
    direction: LayoutDirection
    alignment: Alignment
    wrap: boolean
    layout?: LayoutControls
    sizing?: SizingControls
    colors?: ColorControls
    hover?: HoverControls
    typography?: TypographyControls
    /** @deprecated Use layout.gap. Kept so existing instances still apply. */
    gap?: number
    /** @deprecated Use sizing.buttonSize. */
    buttonSize?: number
    /** @deprecated Use sizing.iconSize. */
    iconSize?: number
    /** @deprecated Use sizing.radius. */
    radius?: number | string
    /** @deprecated Use sizing.borderWidth. */
    borderWidth?: number
    /** @deprecated Use colors.fill. */
    backgroundColor?: string
    /** @deprecated Use colors.icon. */
    iconColor?: string
    /** @deprecated Use colors.text. */
    textColor?: string
    /** @deprecated Use colors.border. */
    borderColor?: string
    /** @deprecated Use hover.background. */
    hoverBackground?: string
    /** @deprecated Use hover.icon. */
    hoverIconColor?: string
    /** @deprecated Use hover.text. */
    hoverTextColor?: string
    /** @deprecated Use typography.buttons. */
    labelFont?: CSSProperties
    /** @deprecated Use typography.heading. */
    headingFont?: CSSProperties
    style?: CSSProperties
}

const PLATFORM_OPTIONS: PlatformId[] = [
    "copy",
    "email",
    "facebook",
    "x",
    "threads",
    "bluesky",
    "linkedin",
    "pinterest",
    "reddit",
    "whatsapp",
    "telegram",
    "line",
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

const PLATFORM_TITLES = [
    "Copy link",
    "Email",
    "Facebook",
    "X",
    "Threads",
    "Bluesky",
    "LinkedIn",
    "Pinterest",
    "Reddit",
    "WhatsApp",
    "Telegram",
    "LINE",
    "Tumblr",
    "VK",
    "Weibo",
    "Hacker News",
    "Pocket",
    "Buffer",
    "Flipboard",
    "Xing",
    "Print",
    "Native share",
]

const ARIA_LABELS: Record<PlatformId, string> = {
    copy: "Copy",
    email: "Email",
    facebook: "Facebook",
    x: "X",
    threads: "Threads",
    bluesky: "Bluesky",
    linkedin: "LinkedIn",
    pinterest: "Pinterest",
    reddit: "Reddit",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    line: "LINE",
    tumblr: "Tumblr",
    vk: "VK",
    weibo: "Weibo",
    hackernews: "Hacker News",
    pocket: "Pocket",
    buffer: "Buffer",
    flipboard: "Flipboard",
    xing: "Xing",
    print: "Print",
    native: "Native share",
}

const COPIED_LABEL = "Copied"

const BRAND_COLORS: Partial<Record<PlatformId, string>> = {
    facebook: "#1877F2",
    x: "#0F1419",
    threads: "#000000",
    bluesky: "#1185FE",
    linkedin: "#0A66C2",
    pinterest: "#E60023",
    reddit: "#FF4500",
    whatsapp: "#25D366",
    telegram: "#229ED9",
    line: "#06C755",
    tumblr: "#36465D",
    vk: "#0077FF",
    weibo: "#E6162D",
    hackernews: "#FF6600",
    pocket: "#EF4056",
    buffer: "#168EEA",
    flipboard: "#E12828",
    xing: "#006567",
    email: "#111111",
    copy: "#111111",
    print: "#111111",
    native: "#111111",
}

const ICON_STROKE = 1.75

const FALLBACK_GAP = 8
const FALLBACK_BUTTON_SIZE = 44
const FALLBACK_ICON_SIZE = 18
const FALLBACK_RADIUS = 999
const FALLBACK_RADIUS_CSS = "999px"
const FALLBACK_BORDER_WIDTH = 1
const FALLBACK_FILL = "#FFFFFF"
const FALLBACK_ICON_COLOR = "#111111"
const FALLBACK_TEXT_COLOR = "#111111"
const FALLBACK_BORDER_COLOR = "#E5E5E5"
const FALLBACK_HOVER_BACKGROUND = "#F5F5F5"
const FALLBACK_HOVER_ICON = "#000000"
const FALLBACK_HOVER_TEXT = "#000000"
const FALLBACK_HEADING_FONT: CSSProperties = {
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "0.04em",
    lineHeight: "1.2em",
}
const FALLBACK_LABEL_FONT: CSSProperties = {
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "-0.01em",
    lineHeight: "1em",
}

function firstDefined<T>(...values: (T | undefined)[]): T | undefined {
    return values.find((value) => value !== undefined)
}

function cssRadius(value: number | string | undefined) {
    if (typeof value === "number" && Number.isFinite(value)) return value
    if (typeof value === "string" && value.trim()) return value
    return FALLBACK_RADIUS
}

function BrandMark({
    path,
    color,
    size,
    evenodd = false,
}: {
    path: string
    color: string
    size: number
    evenodd?: boolean
}) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden={true}
            style={{ color, display: "block", flexShrink: 0 }}
        >
            <path
                d={path}
                fillRule={evenodd ? "evenodd" : undefined}
                clipRule={evenodd ? "evenodd" : undefined}
            />
        </svg>
    )
}

const BRAND_PATHS: Partial<Record<PlatformId, string>> = {
    x: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.995-9.232L1.254 2.25H8.08l4.25 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z",
    facebook:
        "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z",
    threads:
        "M18.263 11.097c-.03-3.486-1.92-5.586-5.111-5.586-2.13 0-3.922.963-4.863 2.499l2.062 1.438c.535-.843 1.272-1.543 2.628-1.543 1.528 0 2.318.85 2.544 2.431a15 15 0 0 0-2.236-.173c-4.125 0-6.068 1.867-6.068 4.336s1.943 3.99 4.804 3.99c3.139 0 5.013-2.115 5.781-4.735.798.361 1.348 1.204 1.348 2.47 0 3.387-3.907 5.232-7.22 5.232-4.885 0-8.077-3.207-8.077-8.424 0-6.392 4.223-10.487 9.9-10.487 3.808 0 5.69 1.671 6.97 3.914l2.108-1.475C21.44 2.078 18.331 0 13.663 0 6.227 0 1.168 5.277 1.168 12.934c0 7 4.953 11.066 10.856 11.066 4.878 0 9.809-2.846 9.809-7.716 0-2.545-1.46-4.231-3.569-5.187m-6.33 4.855c-1.077 0-2.026-.512-2.026-1.453 0-1.483 1.822-1.934 3.606-1.934.678 0 1.34.045 1.927.173-.422 1.927-1.671 3.215-3.508 3.214Z",
    bluesky:
        "M5.202 2.857C7.954 4.922 10.913 9.11 12 11.358c1.087-2.247 4.046-6.436 6.798-8.501C20.783 1.366 24 .213 24 3.883c0 .732-.42 6.156-.667 7.037-.856 3.061-3.978 3.842-6.755 3.37 4.854.826 6.089 3.562 3.422 6.299-5.065 5.196-7.28-1.304-7.847-2.97-.104-.305-.152-.448-.153-.327 0-.121-.05.022-.153.327-.568 1.666-2.782 8.166-7.847 2.97-2.667-2.737-1.432-5.473 3.422-6.3-2.777.473-5.899-.308-6.755-3.369C.42 10.04 0 4.615 0 3.883c0-3.67 3.217-2.517 5.202-1.026",
    linkedin:
        "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
    pinterest:
        "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z",
    reddit:
        "M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z",
    whatsapp:
        "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z",
    telegram:
        "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
    line: "M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314",
    tumblr:
        "M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V9.747H5.116V6.648c3.63-1.313 4.512-4.596 4.71-6.469C9.84.051 9.941 0 9.999 0h3.517v6.114h4.801v3.633h-4.82v7.47c.016 1.001.375 2.371 2.207 2.371h.09c.631-.02 1.486-.205 1.936-.419l1.156 3.425c-.436.636-2.4 1.374-4.156 1.404h-.178l.011.002z",
    vk: "m9.489.004.729-.003h3.564l.73.003.914.01.433.007.418.011.403.014.388.016.374.021.36.025.345.03.333.033c1.74.196 2.933.616 3.833 1.516.9.9 1.32 2.092 1.516 3.833l.034.333.029.346.025.36.02.373.025.588.012.41.013.644.009.915.004.98-.001 3.313-.003.73-.01.914-.007.433-.011.418-.014.403-.016.388-.021.374-.025.36-.03.345-.033.333c-.196 1.74-.616 2.933-1.516 3.833-.9.9-2.092 1.32-3.833 1.516l-.333.034-.346.029-.36.025-.373.02-.588.025-.41.012-.644.013-.915.009-.98.004-3.313-.001-.73-.003-.914-.01-.433-.007-.418-.011-.403-.014-.388-.016-.374-.021-.36-.025-.345-.03-.333-.033c-1.74-.196-2.933-.616-3.833-1.516-.9-.9-1.32-2.092-1.516-3.833l-.034-.333-.029-.346-.025-.36-.02-.373-.025-.588-.012-.41-.013-.644-.009-.915-.004-.98.001-3.313.003-.73.01-.914.007-.433.011-.418.014-.403.016-.388.021-.374.025-.36.03-.345.033-.333c.196-1.74.616-2.933 1.516-3.833.9-.9 2.092-1.32 3.833-1.516l.333-.034.346-.029.36-.025.373-.02.588-.025.41-.012.644-.013.915-.009ZM6.79 7.3H4.05c.13 6.24 3.25 9.99 8.72 9.99h.31v-3.57c2.01.2 3.53 1.67 4.14 3.57h2.84c-.78-2.84-2.83-4.41-4.11-5.01 1.28-.74 3.08-2.54 3.51-4.98h-2.58c-.56 1.98-2.22 3.78-3.8 3.95V7.3H10.5v6.92c-1.6-.4-3.62-2.34-3.71-6.92Z",
    weibo:
        "M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.737 5.439l-.002.004zM9.05 17.219c-.384.616-1.208.884-1.829.602-.612-.279-.793-.991-.406-1.593.379-.595 1.176-.861 1.793-.601.622.263.82.972.442 1.592zm1.27-1.627c-.141.237-.449.353-.689.253-.236-.09-.313-.361-.177-.586.138-.227.436-.346.672-.24.239.09.315.36.18.601l.014-.028zm.176-2.719c-1.893-.493-4.033.45-4.857 2.118-.836 1.704-.026 3.591 1.886 4.21 1.983.64 4.318-.341 5.132-2.179.8-1.793-.201-3.642-2.161-4.149zm7.563-1.224c-.346-.105-.57-.18-.405-.615.375-.977.42-1.804 0-2.404-.781-1.112-2.915-1.053-5.364-.03 0 0-.766.331-.571-.271.376-1.217.315-2.224-.27-2.809-1.338-1.337-4.869.045-7.888 3.08C1.309 10.87 0 13.273 0 15.348c0 3.981 5.099 6.395 10.086 6.395 6.536 0 10.888-3.801 10.888-6.82 0-1.822-1.547-2.854-2.915-3.284v.01zm1.908-5.092c-.766-.856-1.908-1.187-2.96-.962-.436.09-.706.511-.616.932.09.42.511.691.932.602.511-.105 1.067.044 1.442.465.376.421.466.977.316 1.473-.136.406.089.856.51.992.405.119.857-.105.992-.512.33-1.021.12-2.178-.646-3.035l.03.045zm2.418-2.195c-1.576-1.757-3.905-2.419-6.054-1.968-.496.104-.812.587-.706 1.081.104.496.586.813 1.082.707 1.532-.331 3.185.15 4.296 1.383 1.112 1.246 1.429 2.943.947 4.416-.165.48.106 1.007.586 1.157.479.165.991-.104 1.157-.586.675-2.088.241-4.478-1.338-6.235l.03.045z",
    hackernews:
        "M0 24V0h24v24H0zM6.951 5.896l4.112 7.708v5.064h1.583v-4.972l4.148-7.799h-1.749l-2.457 4.875c-.372.745-.688 1.434-.688 1.434s-.297-.708-.651-1.434L8.831 5.896h-1.88z",
    pocket:
        "M18.813 10.259l-5.646 5.419c-.32.305-.73.458-1.141.458-.41 0-.821-.153-1.141-.458l-5.646-5.419c-.657-.628-.677-1.671-.049-2.326.63-.657 1.671-.679 2.325-.05l4.511 4.322 4.517-4.322c.66-.631 1.697-.607 2.326.049.631.645.615 1.695-.045 2.326l-.011.001zm5.083-7.546c-.299-.858-1.125-1.436-2.041-1.436H2.179c-.9 0-1.717.564-2.037 1.405-.094.25-.142.511-.142.774v7.245l.084 1.441c.348 3.277 2.047 6.142 4.682 8.139.045.036.094.07.143.105l.03.023c1.411 1.03 2.989 1.728 4.694 2.072.786.158 1.591.24 2.389.24.739 0 1.481-.067 2.209-.204.088-.029.176-.045.264-.06.023 0 .049-.015.074-.029 1.633-.36 3.148-1.036 4.508-2.025l.029-.031.135-.105c2.627-1.995 4.324-4.862 4.686-8.148L24 10.678V3.445c0-.251-.031-.5-.121-.742l.017.01z",
    buffer:
        "M1.371 5.476L11.943 0l10.686 5.476-10.686 5.495zm3.36 4.81l7.212 3.547 7.288-3.547 3.398 1.655-10.686 5.202L1.371 11.94zm0 6.171l7.212 3.911 7.288-3.91 3.398 1.815L11.943 24 1.371 18.273z",
    flipboard:
        "M0 0v24h24V0H0zm19.2 9.6h-4.8v4.8H9.6v4.8H4.8V4.8h14.4v4.8z",
    xing: "M18.188 0c-.517 0-.741.325-.927.66 0 0-7.455 13.224-7.702 13.657.015.024 4.919 9.023 4.919 9.023.17.308.436.66.967.66h3.454c.211 0 .375-.078.463-.22.089-.151.089-.346-.009-.536l-4.879-8.916c-.004-.006-.004-.016 0-.022L22.139.756c.095-.191.097-.387.006-.535C22.056.078 21.894 0 21.686 0h-3.498zM3.648 4.74c-.211 0-.385.074-.473.216-.09.149-.078.339.02.531l2.34 4.05c.004.01.004.016 0 .021L1.86 16.051c-.099.188-.093.381 0 .529.085.142.239.234.45.234h3.461c.518 0 .766-.348.945-.667l3.734-6.609-2.378-4.155c-.172-.315-.434-.659-.962-.659H3.648v.016z",
}

function Icon({
    id,
    size,
    color,
}: {
    id: PlatformId
    size: number
    color: string
}) {
    const brandPath = BRAND_PATHS[id]
    if (brandPath) {
        return (
            <BrandMark
                path={brandPath}
                color={color}
                size={size}
                evenodd={id === "x"}
            />
        )
    }

    const common = {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        "aria-hidden": true as const,
        style: { display: "block", flexShrink: 0 } as CSSProperties,
    }
    const stroke = {
        stroke: color,
        strokeWidth: ICON_STROKE,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
    }

    switch (id) {
        case "copy":
            return (
                <svg {...common}>
                    <rect x="9" y="9" width="11" height="11" rx="2" {...stroke} />
                    <path
                        d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                        {...stroke}
                    />
                </svg>
            )
        case "email":
            return (
                <svg {...common}>
                    <path
                        d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z"
                        {...stroke}
                    />
                    <path d="M3.5 7l8.5 6 8.5-6" {...stroke} />
                </svg>
            )
        case "print":
            return (
                <svg {...common}>
                    <path d="M7 8V4h10v4" {...stroke} />
                    <rect x="6" y="13" width="12" height="7" rx="1" {...stroke} />
                    <path d="M5 8h14a2 2 0 0 1 2 2v5h-3M3 15h3" {...stroke} />
                </svg>
            )
        case "native":
            return (
                <svg {...common}>
                    <circle cx="18" cy="5" r="2.2" {...stroke} />
                    <circle cx="6" cy="12" r="2.2" {...stroke} />
                    <circle cx="18" cy="19" r="2.2" {...stroke} />
                    <path d="M8 11l8-5M8 13l8 5" {...stroke} />
                </svg>
            )
        default:
            return null
    }
}

function encode(value: string) {
    return encodeURIComponent(value)
}

function stripHash(value: string) {
    if (!value) return ""
    try {
        const parsed = new URL(value)
        parsed.hash = ""
        return parsed.toString()
    } catch {
        return value.split("#")[0]
    }
}

function decodeMetaUrl(value: string) {
    return value.trim().replace(/&amp;/g, "&")
}

function metaAttribute(selectors: string[], attributes: string[]) {
    if (typeof document === "undefined") return ""
    for (const selector of selectors) {
        const el = document.querySelector(selector)
        if (!el) continue
        for (const attr of attributes) {
            const raw = el.getAttribute(attr)
            if (raw && raw.trim()) return decodeMetaUrl(raw)
        }
    }
    return ""
}

function pageOpenGraphImage() {
    return metaAttribute(
        [
            'meta[property="og:image"]',
            'meta[property="og:image:url"]',
            'meta[name="twitter:image"]',
            'meta[name="twitter:image:src"]',
        ],
        ["content"]
    )
}

function visibleText(el: Element | null) {
    return el?.textContent?.replace(/\s+/g, " ").trim() || ""
}

function pageHeadingText() {
    if (typeof document === "undefined") return ""
    const all = Array.from(document.querySelectorAll("h1"))
    const inArticle = all.filter((el) =>
        el.closest(
            "[data-framer-name='Hero'], [data-framer-name='Title'], [data-framer-name='Body'], article, main, [role='main']"
        )
    )
    for (const heading of inArticle.length ? inArticle : all) {
        if (
            heading.closest(
                "nav, footer, [data-share-buttons], [role='navigation'], [role='contentinfo']"
            )
        ) {
            continue
        }
        const text = visibleText(heading)
        if (text) return text
    }
    return ""
}

function pageShareTitle(headingFallback = "") {
    const ogTitle = metaAttribute(
        ['meta[property="og:title"]', 'meta[name="twitter:title"]'],
        ["content"]
    )
    if (ogTitle) return ogTitle
    if (typeof document !== "undefined") {
        const docTitle = document.title.trim()
        if (docTitle) return docTitle
    }
    return pageHeadingText() || headingFallback.trim()
}

function shareImageUrl() {
    return pageOpenGraphImage()
}

function canonicalPageUrl() {
    const raw =
        metaAttribute(
            ['link[rel="canonical"]', 'meta[property="og:url"]'],
            ["href", "content"]
        ) ||
        (typeof window !== "undefined" ? window.location.href : "")
    return stripHash(raw)
}

const PRINT_SANS =
    'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif'

const PRINT_SKIP_SELECTOR = [
    "nav",
    "header",
    "footer",
    "button",
    "video",
    "audio",
    "#cta",
    "[data-share-buttons]",
    "[role='banner']",
    "[role='navigation']",
    "[role='contentinfo']",
    "[role='dialog']",
    "[aria-modal='true']",
    "[class*='cookie']",
    "[id*='cookie']",
    "[class*='Cookie']",
].join(", ")

const PRINT_CHROME_NAME =
    /\b(share|footer|articles?|crisis|related|cta|newsletter|cookie|nav|banner|menu|recents?)\b/i

const PRINT_POST_ARTICLE_NAME =
    /^(recents?|articles|cta|related|footer|crisis)\b/i

const PRINT_CHROME_TEXT =
    /^(we are here to listen\.?|explore our resource library|get help now|other topics you might like|need someone to talk to\s*\?)$/i

const PRINT_CTA_PHRASE =
    /\b(get help|read more|subscribe|explore our|whatsapp|whats app)\b/i

const PRINT_SHEET_CSS = `
@page { size: auto; margin: 16mm 18mm 18mm 18mm; }
html, body {
  background: #fff;
  color: #2c2b27;
  margin: 0;
  padding: 0;
  overflow: visible;
}
body {
  font-family: ${PRINT_SANS};
  font-size: 12pt;
  line-height: 1.55;
  letter-spacing: normal;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.sheet {
  max-width: 42rem;
  margin: 0 auto;
  padding: 4pt 0 0;
  overflow: visible;
}
h1.title {
  display: block;
  margin: 0 0 10pt;
  padding: 0;
  color: #1d1b16;
  font-size: 22pt;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.02em;
  white-space: normal;
  overflow: visible;
  word-break: normal;
  overflow-wrap: break-word;
  hyphens: none;
  max-width: 100%;
  break-after: avoid;
  page-break-after: avoid;
}
p.source {
  margin: 0 0 18pt;
  color: #787774;
  font-size: 9pt;
  font-weight: 400;
  line-height: 1.4;
  word-break: break-all;
  overflow: visible;
}
h1, h2, h3 {
  color: #1d1b16;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.02em;
  break-after: avoid;
  page-break-after: avoid;
}
h2 { font-size: 14pt; margin: 16pt 0 8pt; }
h3 { font-size: 12pt; margin: 14pt 0 8pt; }
p, li { color: #2c2b27; line-height: 1.55; }
p { margin: 0 0 11pt; }
ul, ol { margin: 0 0 11pt; padding-left: 1.3em; }
li { margin: 0 0 4pt; }
blockquote {
  margin: 0 0 11pt;
  padding-left: 12pt;
  border-left: 2pt solid #e3e2e0;
}
a { color: #2c2b27; text-underline-offset: 2px; }
img, figure {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 14pt 0;
  break-inside: avoid;
  page-break-inside: avoid;
}
`

const PRINT_FLATTEN_STYLE_ID = "share-buttons-print-flatten"
const PRINT_FLATTEN_CSS = `
@media print {
  @page { size: auto; margin: 20mm; }
  html, body { background: #fff !important; color: #2c2b27 !important; }
  * {
    position: static !important;
    transform: none !important;
    inset: auto !important;
    top: auto !important;
    right: auto !important;
    bottom: auto !important;
    left: auto !important;
    width: auto !important;
    height: auto !important;
    max-width: 100% !important;
    float: none !important;
    overflow: visible !important;
  }
  [data-share-buttons], nav, header, footer, button, video, #cta {
    display: none !important;
  }
}
`

const PRINT_TEXT_TAGS = new Set(["P", "H1", "H2", "H3", "BLOCKQUOTE", "LI"])
const PRINT_BULLET_ONLY = /^[\s•·●✦▪►▶\-–—*]+$/u

let flattenCleanupTimer = 0

function pageSiteName() {
    const name = metaAttribute(['meta[property="og:site_name"]'], ["content"])
    if (name) return name
    if (typeof window === "undefined") return ""
    try {
        return window.location.hostname.replace(/^www\./, "")
    } catch {
        return ""
    }
}

function seoArticleTitle(value: string) {
    const text = value.replace(/\s+/g, " ").trim()
    if (!text) return ""
    const parts = text.split(/\s+[-–—|]\s+/)
    if (parts.length >= 2 && parts[0].replace(/\s+/g, "").length >= 3) {
        return parts[0].trim()
    }
    return text
}

function printDocumentTitle() {
    const heading = pageHeadingText()
    if (heading) return heading
    const seo = pageShareTitle()
    if (seo) return seoArticleTitle(seo)
    return pageSiteName() || "Untitled"
}

function titlesMatch(a: string, b: string) {
    const left = a.replace(/\s+/g, " ").trim().toLowerCase()
    const right = b.replace(/\s+/g, " ").trim().toLowerCase()
    if (!left || !right) return false
    return left === right || left.startsWith(right) || right.startsWith(left)
}

function framerLayerName(el: Element) {
    return (el.getAttribute("data-framer-name") || "")
        .replace(/&amp;/g, "&")
        .trim()
}

function isChromeName(name: string) {
    return Boolean(name) && PRINT_CHROME_NAME.test(name)
}

function isPostArticleName(name: string) {
    return Boolean(name) && PRINT_POST_ARTICLE_NAME.test(name)
}

function findCmsBody(doc: Document) {
    const stacks = Array.from(doc.querySelectorAll("[data-framer-name='Body']"))
    let best: Element | null = null
    let bestCount = 0
    for (const el of stacks) {
        const count = el.querySelectorAll("p, h2, h3, li").length
        if (count > bestCount) {
            best = el
            bestCount = count
        }
    }
    return best
}

function findPrintRoot(doc: Document) {
    const article = doc.querySelector("article")
    const articleWrapsChrome =
        article &&
        article.querySelector(
            "#cta, [data-framer-name='Recents'], [data-framer-name='Articles'], [data-framer-name='CTA']"
        )
    if (article && article.querySelector("p, h2, h3") && !articleWrapsChrome) {
        return article
    }

    const hero = doc.querySelector("[data-framer-name='Hero']")
    const body = findCmsBody(doc)
    if (hero && body && hero.parentElement === body.parentElement) {
        return hero.parentElement
    }
    if (body) return body
    if (article) return article

    return (
        doc.querySelector("[role='main']") ||
        doc.querySelector("main") ||
        doc.getElementById("main") ||
        doc.getElementById("root") ||
        doc.body
    )
}

function isPrintChrome(el: Element) {
    if (el.closest(PRINT_SKIP_SELECTOR)) return true
    let node: Element | null = el
    while (node) {
        if ((node.id || "").toLowerCase() === "cta") return true
        if (isChromeName(framerLayerName(node))) return true
        node = node.parentElement
    }
    return false
}

function isArticleColumn(el: Element) {
    if (el.tagName === "ARTICLE") return true
    const name = framerLayerName(el).toLowerCase()
    return name === "body" || name === "hero" || name === "article"
}

function isMostlyCtaSection(el: Element) {
    if (
        PRINT_TEXT_TAGS.has(el.tagName) ||
        el.tagName === "IMG" ||
        el.tagName === "FIGURE"
    ) {
        return false
    }
    if (!(el instanceof HTMLElement)) return false
    const links = el.querySelectorAll("a, button")
    if (links.length < 2) return false
    const text = (el.textContent || "").replace(/\s+/g, " ").trim()
    if (!text) return true
    const linkText = Array.from(links)
        .map((node) => (node.textContent || "").replace(/\s+/g, " ").trim())
        .join(" ")
    if (linkText.length >= text.length * 0.55) return true
    if (PRINT_CTA_PHRASE.test(text) && text.length < 500) return true
    return false
}

function postArticleSiblings(root: Element) {
    const skip = new Set<Element>()
    const children = Array.from(root.children)
    let articleIdx = -1
    for (let i = 0; i < children.length; i++) {
        if (isArticleColumn(children[i])) articleIdx = i
    }
    if (articleIdx === -1) return skip
    for (let i = articleIdx + 1; i < children.length; i++) {
        const el = children[i]
        if (isArticleColumn(el)) continue
        const name = framerLayerName(el)
        const id = (el.id || "").toLowerCase()
        if (
            isPostArticleName(name) ||
            isPrintChrome(el) ||
            isMostlyCtaSection(el) ||
            id === "cta" ||
            Boolean(el.querySelector("#cta")) ||
            !name
        ) {
            skip.add(el)
        }
    }
    return skip
}

function isPrintHidden(el: Element) {
    if (!(el instanceof HTMLElement)) return false
    if (el.hidden || el.getAttribute("aria-hidden") === "true") return true
    try {
        const style = window.getComputedStyle(el)
        return style.display === "none" || style.visibility === "hidden"
    } catch {
        return false
    }
}

function isPrintableNode(el: Element) {
    const tag = el.tagName
    if (PRINT_TEXT_TAGS.has(tag)) {
        if (tag === "P" && el.closest("li, blockquote, h1, h2, h3")) return false
        if (tag === "LI" && el.closest("li") !== el) return false
        const parent = el.parentElement
        if (parent && (parent.tagName === "A" || parent.tagName === "BUTTON")) {
            return false
        }
        const text = el.textContent?.replace(/\s+/g, " ").trim() || ""
        if (!text || PRINT_BULLET_ONLY.test(text)) return false
        if (PRINT_CHROME_TEXT.test(text)) return false
        return true
    }
    if (tag === "IMG") {
        if (el.closest("figure, button, nav, header, footer")) return false
        const img = el as HTMLImageElement
        const src = img.currentSrc || img.getAttribute("src") || ""
        if (!src) return false
        if (img.naturalWidth > 0 && img.naturalWidth < 32) return false
        return true
    }
    if (tag === "FIGURE") {
        return Boolean(el.querySelector("img"))
    }
    return false
}

type PrintBlock =
    | { kind: "text"; tag: string; text: string }
    | { kind: "img"; src: string; alt: string }

function collectPrintBlocks(root: Element): PrintBlock[] {
    const title = printDocumentTitle().replace(/\s+/g, " ").trim().toLowerCase()
    const blocked = postArticleSiblings(root)
    const blocks: PrintBlock[] = []
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
        acceptNode(node) {
            const el = node as Element
            if (el !== root) {
                const name = framerLayerName(el)
                if (
                    blocked.has(el) ||
                    isPostArticleName(name) ||
                    isPrintChrome(el) ||
                    isPrintHidden(el) ||
                    isMostlyCtaSection(el)
                ) {
                    return NodeFilter.FILTER_REJECT
                }
            }
            if (isPrintableNode(el)) return NodeFilter.FILTER_ACCEPT
            return NodeFilter.FILTER_SKIP
        },
    })

    while (walker.nextNode()) {
        const el = walker.currentNode as Element
        const tag = el.tagName
        if (tag === "IMG" || tag === "FIGURE") {
            const img =
                tag === "IMG" ? (el as HTMLImageElement) : el.querySelector("img")
            if (!img) continue
            const src = img.currentSrc || img.getAttribute("src") || ""
            if (!src) continue
            blocks.push({
                kind: "img",
                src,
                alt: img.getAttribute("alt") || "",
            })
            continue
        }
        const text = el.textContent?.replace(/\s+/g, " ").trim() || ""
        if (!text) continue
        if (titlesMatch(text, title)) continue
        blocks.push({ kind: "text", tag, text })
    }
    return blocks
}

function appendPrintSheet(doc: Document, blocks: PrintBlock[]) {
    const title = printDocumentTitle()
    const url = canonicalPageUrl()
    const sheet = doc.createElement("div")
    sheet.className = "sheet"

    const heading = doc.createElement("h1")
    heading.className = "title"
    heading.textContent = title
    heading.style.cssText =
        "white-space:normal;overflow:visible;word-break:normal;overflow-wrap:break-word"
    sheet.appendChild(heading)

    if (url) {
        const source = doc.createElement("p")
        source.className = "source"
        source.textContent = url
        sheet.appendChild(source)
    }

    let list: HTMLUListElement | null = null
    for (const block of blocks) {
        if (block.kind === "text" && block.tag === "LI") {
            if (!list) {
                list = doc.createElement("ul")
                sheet.appendChild(list)
            }
            const item = doc.createElement("li")
            item.textContent = block.text
            list.appendChild(item)
            continue
        }
        list = null
        if (block.kind === "img") {
            const img = doc.createElement("img")
            img.src = block.src
            img.alt = block.alt
            sheet.appendChild(img)
            continue
        }
        const tag =
            block.tag === "H2"
                ? "h2"
                : block.tag === "H3"
                  ? "h3"
                  : block.tag === "BLOCKQUOTE"
                    ? "blockquote"
                    : "p"
        const el = doc.createElement(tag)
        el.textContent = block.text
        sheet.appendChild(el)
    }

    doc.body.appendChild(sheet)
}

function escapeHtml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
}

function printLinearSheet(blocks: PrintBlock[]) {
    const iframe = document.createElement("iframe")
    iframe.setAttribute("title", "Print")
    iframe.setAttribute("aria-hidden", "true")
    iframe.style.cssText =
        "position:fixed;right:0;bottom:0;width:800px;height:1200px;border:0;visibility:hidden;pointer-events:none"
    document.body.appendChild(iframe)

    const title = printDocumentTitle()
    let started = false
    let cleaned = false
    const cleanup = () => {
        if (cleaned) return
        cleaned = true
        window.removeEventListener("afterprint", cleanup)
        try {
            iframe.contentWindow?.removeEventListener("afterprint", cleanup)
        } catch {
            /* ignore */
        }
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe)
    }

    const runPrint = () => {
        if (started) return
        started = true
        const idoc = iframe.contentDocument
        const win = iframe.contentWindow
        if (!idoc || !win) {
            cleanup()
            printFlattenedFallback()
            return
        }
        appendPrintSheet(idoc, blocks)
        window.addEventListener("afterprint", cleanup)
        try {
            win.addEventListener("afterprint", cleanup)
        } catch {
            /* ignore */
        }
        window.setTimeout(cleanup, 60000)
        const images = Array.from(idoc.images)
        const ready = images.map((img) =>
            img.complete
                ? Promise.resolve()
                : new Promise<void>((resolve) => {
                      img.addEventListener("load", () => resolve(), { once: true })
                      img.addEventListener("error", () => resolve(), { once: true })
                  })
        )
        void Promise.all(ready).then(() => {
            window.requestAnimationFrame(() => {
                try {
                    win.focus()
                    win.print()
                } catch {
                    cleanup()
                    printFlattenedFallback()
                }
            })
        })
    }

    iframe.addEventListener("load", runPrint, { once: true })
    iframe.srcdoc = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>${PRINT_SHEET_CSS}</style></head><body></body></html>`
    window.setTimeout(() => {
        if (!started && iframe.contentDocument?.readyState === "complete") {
            runPrint()
        }
    }, 400)
}

function finishFlattenPrint() {
    if (typeof window !== "undefined") {
        window.removeEventListener("afterprint", finishFlattenPrint)
        if (flattenCleanupTimer) {
            window.clearTimeout(flattenCleanupTimer)
            flattenCleanupTimer = 0
        }
    }
    const style = document.getElementById(PRINT_FLATTEN_STYLE_ID)
    if (style?.parentNode) style.parentNode.removeChild(style)
}

function printFlattenedFallback() {
    if (typeof window === "undefined" || typeof document === "undefined") return
    if (!document.body || !document.head) return
    finishFlattenPrint()
    const style = document.createElement("style")
    style.id = PRINT_FLATTEN_STYLE_ID
    style.textContent = PRINT_FLATTEN_CSS
    document.head.appendChild(style)
    window.addEventListener("afterprint", finishFlattenPrint)
    flattenCleanupTimer = window.setTimeout(finishFlattenPrint, 60000) as number
    window.print()
}

function printPage() {
    if (typeof window === "undefined" || typeof document === "undefined") return
    if (!document.body) return

    const root = findPrintRoot(document)
    const blocks = root ? collectPrintBlocks(root) : []
    if (blocks.length > 0) {
        printLinearSheet(blocks)
        return
    }
    printFlattenedFallback()
}

function normalizeEnum(value: unknown, allowed: string[], fallback: string) {
    if (typeof value !== "string" || !value) return fallback
    if (allowed.includes(value)) return value
    const compact = value.toLowerCase().replace(/[\s+]+/g, "-")
    if (allowed.includes(compact)) return compact
    const aliases: Record<string, string> = {
        left: "start",
        right: "end",
        "icon-label": "icon-label",
        "icon-+-label": "icon-label",
        "icon-and-label": "icon-label",
    }
    if (aliases[compact] && allowed.includes(aliases[compact])) {
        return aliases[compact]
    }
    return fallback
}

function buildShareUrl(
    id: PlatformId,
    url: string,
    emailSubject: string,
    imageUrl = ""
): string | null {
    // Facebook, X, LinkedIn, and WhatsApp scrape Open Graph from the
    // canonical page URL. Do not pass title/description/picture params that
    // would override Framer Page Settings (SEO title, description, Social Preview).
    // Pinterest requires an explicit media URL and will not scrape og:image.
    switch (id) {
        case "email":
            return `mailto:?subject=${encode(emailSubject || "Share")}&body=${encode(url)}`
        case "facebook":
            return `https://www.facebook.com/sharer/sharer.php?u=${encode(url)}`
        case "x":
            return `https://twitter.com/intent/tweet?url=${encode(url)}`
        case "threads":
            return `https://www.threads.net/intent/post?text=${encode(url)}`
        case "bluesky":
            return `https://bsky.app/intent/compose?text=${encode(url)}`
        case "linkedin":
            return `https://www.linkedin.com/sharing/share-offsite/?url=${encode(url)}`
        case "pinterest":
            return imageUrl
                ? `https://pinterest.com/pin/create/button/?url=${encode(url)}&media=${encode(imageUrl)}`
                : `https://pinterest.com/pin/create/button/?url=${encode(url)}`
        case "reddit":
            return `https://www.reddit.com/submit?url=${encode(url)}`
        case "whatsapp":
            return `https://wa.me/?text=${encode(url)}`
        case "telegram":
            return `https://t.me/share/url?url=${encode(url)}`
        case "line":
            return `https://social-plugins.line.me/lineit/share?url=${encode(url)}`
        case "tumblr":
            return `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${encode(url)}`
        case "vk":
            return `https://vk.com/share.php?url=${encode(url)}`
        case "weibo":
            return `https://service.weibo.com/share/share.php?url=${encode(url)}`
        case "hackernews":
            return `https://news.ycombinator.com/submitlink?u=${encode(url)}`
        case "pocket":
            return `https://getpocket.com/save?url=${encode(url)}`
        case "buffer":
            return `https://buffer.com/add?url=${encode(url)}`
        case "flipboard":
            return `https://share.flipboard.com/bookmarklet/popout?v=2&url=${encode(url)}`
        case "xing":
            return `https://www.xing.com/spi/shares/new?url=${encode(url)}`
        default:
            return null
    }
}

/**
 * Share Buttons
 *
 * Customizable social share bar for Framer sites. Share URL, email subject,
 * and image come from the published page (canonical / Open Graph). Pinterest
 * uses og:image for its media param. Facebook, X, LinkedIn, and WhatsApp
 * receive the page URL only so they scrape OG.
 * By Lebel Studio
 *
 * @framerDisableUnlink
 * @framerIntrinsicWidth 420
 * @framerIntrinsicHeight 88
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function ShareButtons(props: ShareButtonsProps) {
    const appearance = normalizeEnum(
        props.appearance,
        ["icon", "icon-label", "label"],
        "icon"
    ) as Appearance
    const buttonStyle = normalizeEnum(
        props.buttonStyle,
        ["outline", "filled", "ghost", "brand"],
        "outline"
    ) as ButtonStyle
    const direction = normalizeEnum(
        props.direction,
        ["horizontal", "vertical"],
        "horizontal"
    ) as LayoutDirection
    const alignment = normalizeEnum(
        props.alignment,
        ["start", "center", "end"],
        "start"
    ) as Alignment
    const heading = props.heading
    const showHeading = props.showHeading
    const platforms = props.platforms
    const wrap = props.wrap
    const style = props.style
    const gap = firstDefined(props.gap, props.layout?.gap) ?? FALLBACK_GAP
    const buttonSize =
        firstDefined(props.sizing?.buttonSize, props.buttonSize) ??
        FALLBACK_BUTTON_SIZE
    const iconSize =
        firstDefined(props.sizing?.iconSize, props.iconSize) ?? FALLBACK_ICON_SIZE
    const radius = cssRadius(
        firstDefined(props.sizing?.radius, props.radius)
    )
    const borderWidth =
        firstDefined(props.sizing?.borderWidth, props.borderWidth) ??
        FALLBACK_BORDER_WIDTH
    const backgroundColor =
        firstDefined(props.colors?.fill, props.backgroundColor) ?? FALLBACK_FILL
    const iconColor =
        firstDefined(props.colors?.icon, props.iconColor) ?? FALLBACK_ICON_COLOR
    const textColor =
        firstDefined(props.colors?.text, props.textColor) ?? FALLBACK_TEXT_COLOR
    const borderColor =
        firstDefined(props.colors?.border, props.borderColor) ??
        FALLBACK_BORDER_COLOR
    const hoverBackground =
        firstDefined(props.hover?.background, props.hoverBackground) ??
        FALLBACK_HOVER_BACKGROUND
    const hoverIconColor =
        firstDefined(props.hover?.icon, props.hoverIconColor) ?? FALLBACK_HOVER_ICON
    const hoverTextColor =
        firstDefined(props.hover?.text, props.hoverTextColor) ?? FALLBACK_HOVER_TEXT
    const headingFont =
        firstDefined(props.typography?.heading, props.headingFont) ??
        FALLBACK_HEADING_FONT
    const labelFont =
        firstDefined(props.typography?.buttons, props.labelFont) ??
        FALLBACK_LABEL_FONT

    const isStatic = useIsStaticRenderer()
    const [copied, setCopied] = useState(false)
    const [copyError, setCopyError] = useState(false)
    const [hovered, setHovered] = useState<string | null>(null)
    const [focused, setFocused] = useState<string | null>(null)
    const [liveUrl, setLiveUrl] = useState("")
    const [canNativeShare, setCanNativeShare] = useState(false)
    const copyResetTimer = useRef(0)

    useEffect(() => {
        if (typeof window === "undefined") return

        startTransition(() => {
            setLiveUrl(canonicalPageUrl())
            setCanNativeShare(typeof navigator !== "undefined" && Boolean(navigator.share))
        })
    }, [])

    useEffect(() => {
        return () => {
            if (copyResetTimer.current) {
                window.clearTimeout(copyResetTimer.current)
                copyResetTimer.current = 0
            }
        }
    }, [])

    const scheduleCopyStatusReset = useCallback(() => {
        if (typeof window === "undefined") return
        if (copyResetTimer.current) {
            window.clearTimeout(copyResetTimer.current)
        }
        copyResetTimer.current = window.setTimeout(() => {
            copyResetTimer.current = 0
            startTransition(() => {
                setCopied(false)
                setCopyError(false)
            })
        }, 1800)
    }, [])

    const visiblePlatforms = useMemo(() => {
        const unique: PlatformId[] = []
        for (const item of platforms || []) {
            if (PLATFORM_OPTIONS.includes(item) && !unique.includes(item)) {
                unique.push(item)
            }
        }
        return unique.filter((id) => {
            if (id === "native" && !isStatic && !canNativeShare) return false
            return true
        })
    }, [platforms, canNativeShare, isStatic])

    const copyLink = useCallback(async () => {
        if (typeof window === "undefined") return
        const resolvedUrl = liveUrl || canonicalPageUrl()
        if (!resolvedUrl) return
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(resolvedUrl)
            } else {
                const input = document.createElement("textarea")
                input.value = resolvedUrl
                document.body.appendChild(input)
                input.select()
                document.execCommand("copy")
                document.body.removeChild(input)
            }
            startTransition(() => {
                setCopied(true)
                setCopyError(false)
            })
            scheduleCopyStatusReset()
        } catch {
            startTransition(() => {
                setCopied(false)
                setCopyError(true)
            })
            scheduleCopyStatusReset()
        }
    }, [liveUrl, scheduleCopyStatusReset])

    const handleShare = useCallback(
        async (id: PlatformId) => {
            if (isStatic || typeof window === "undefined") return

            if (id === "copy") {
                await copyLink()
                return
            }

            if (id === "print") {
                printPage()
                return
            }

            const resolvedUrl = liveUrl || canonicalPageUrl()
            if (!resolvedUrl) return
            const resolvedImage = shareImageUrl()
            const pageTitle = pageShareTitle(heading)

            if (id === "native" && navigator.share) {
                try {
                    await navigator.share({
                        title: pageTitle,
                        url: resolvedUrl,
                    })
                } catch {
                    // User cancelled native share.
                }
                return
            }

            const href = buildShareUrl(id, resolvedUrl, pageTitle, resolvedImage)
            if (!href) return
            window.open(href, "_blank", "noopener,noreferrer")
        },
        [copyLink, heading, isStatic, liveUrl]
    )

    const isFixedWidth = style?.width === "100%"
    const alignItems =
        alignment === "center"
            ? "center"
            : alignment === "end"
              ? "flex-end"
              : "flex-start"
    const justifyContent =
        alignment === "center"
            ? "center"
            : alignment === "end"
              ? "flex-end"
              : "flex-start"

    function renderPlatformButton(id: PlatformId) {
        const isHovered = hovered === id
        const brand = BRAND_COLORS[id] || iconColor
        const filled = buttonStyle === "filled"
        const ghost = buttonStyle === "ghost"
        const brandMode = buttonStyle === "brand"
        const brandIcon = brandMode && appearance === "icon"
        let bg = backgroundColor
        let fg = iconColor
        let labelColor = textColor
        let border = `${borderWidth}px solid ${borderColor}`
        if (brandIcon) {
            bg = "transparent"
            fg = brand
            labelColor = brand
            border = "none"
        } else if (brandMode) {
            bg = isHovered ? brand : "transparent"
            fg = isHovered ? backgroundColor : brand
            labelColor = isHovered ? backgroundColor : brand
            border = `${borderWidth}px solid ${brand}`
        } else if (filled) {
            const fill = isHovered ? hoverIconColor : iconColor
            bg = fill
            fg = backgroundColor
            labelColor = backgroundColor
            border = `${borderWidth}px solid ${fill}`
        } else if (ghost) {
            bg = isHovered ? hoverBackground : "transparent"
            fg = isHovered ? hoverIconColor : iconColor
            labelColor = isHovered ? hoverTextColor : textColor
            border = "none"
        } else {
            bg = isHovered ? hoverBackground : backgroundColor
            fg = isHovered ? hoverIconColor : iconColor
            labelColor = isHovered ? hoverTextColor : textColor
            border = `${borderWidth}px solid ${borderColor}`
        }
        const showIcon = appearance !== "label"
        const showLabel = appearance !== "icon"
        const buttonLabel =
            id === "copy" && copied
                ? COPIED_LABEL
                : id === "copy" && copyError
                  ? "Couldn't copy"
                  : ARIA_LABELS[id]

        return (
            <button
                key={id}
                type="button"
                aria-label={buttonLabel}
                title={buttonLabel}
                onClick={() => {
                    void handleShare(id)
                }}
                onMouseEnter={() => startTransition(() => setHovered(id))}
                onMouseLeave={() => startTransition(() => setHovered(null))}
                onFocus={(event) =>
                    startTransition(() => {
                        setHovered(id)
                        if (event.currentTarget.matches(":focus-visible")) {
                            setFocused(id)
                        }
                    })
                }
                onBlur={() =>
                    startTransition(() => {
                        setHovered(null)
                        setFocused(null)
                    })
                }
                style={{
                    appearance: "none",
                    WebkitAppearance: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    minWidth: brandIcon
                        ? 0
                        : appearance === "icon"
                          ? buttonSize
                          : undefined,
                    width: brandIcon ? iconSize : undefined,
                    height: brandIcon ? iconSize : buttonSize,
                    padding:
                        appearance === "icon"
                            ? 0
                            : `0 ${Math.max(14, buttonSize * 0.4)}px`,
                    background: bg,
                    color: labelColor,
                    border,
                    borderRadius: brandIcon ? 0 : radius,
                    opacity: brandIcon && isHovered ? 0.7 : 1,
                    cursor: "pointer",
                    boxSizing: "border-box",
                    position: "relative",
                    overflow: "visible",
                    outline:
                        focused === id ? `2px solid ${hoverIconColor}` : "none",
                    outlineOffset: 2,
                    transition:
                        "background-color 180ms ease, color 180ms ease, border-color 180ms ease, opacity 180ms ease",
                    ...labelFont,
                }}
            >
                {showIcon ? (
                    <Icon id={id} size={iconSize} color={fg} />
                ) : null}
                {showLabel ? (
                    <span style={{ whiteSpace: "nowrap" }}>{buttonLabel}</span>
                ) : null}
                {id === "copy" && (copied || copyError) ? (
                    <span
                        role="status"
                        aria-live="polite"
                        style={{
                            position: "absolute",
                            bottom: "calc(100% + 6px)",
                            left: "50%",
                            transform: "translateX(-50%)",
                            padding: "4px 8px",
                            borderRadius: 6,
                            background: iconColor,
                            color: backgroundColor,
                            whiteSpace: "nowrap",
                            pointerEvents: "none",
                            zIndex: 2,
                            fontSize: 12,
                            lineHeight: "1.2",
                            letterSpacing: "-0.01em",
                            fontWeight: 500,
                        }}
                    >
                        {copyError ? "Couldn't copy" : COPIED_LABEL}
                    </span>
                ) : null}
            </button>
        )
    }

    return (
        <div
            data-share-buttons=""
            style={{
                ...style,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems,
                gap: 12,
                width: isFixedWidth ? "100%" : "max-content",
                minWidth: isFixedWidth ? undefined : "max-content",
                overflow: "visible",
            }}
        >
            {showHeading && heading ? (
                <p
                    style={{
                        margin: 0,
                        color: textColor,
                        width: "max-content",
                        ...headingFont,
                    }}
                >
                    {heading}
                </p>
            ) : null}
            <div
                role="group"
                aria-label={heading || "Share"}
                style={{
                    display: "flex",
                    flexDirection:
                        direction === "vertical" ? "column" : "row",
                    flexWrap: wrap ? "wrap" : "nowrap",
                    justifyContent,
                    alignItems: "center",
                    gap,
                    width: isFixedWidth ? "100%" : "max-content",
                    overflow: "visible",
                    position: "relative",
                }}
            >
                {visiblePlatforms.length === 0 ? (
                    <p
                        style={{
                            margin: 0,
                            color: textColor,
                            opacity: 0.55,
                            fontSize: 13,
                            lineHeight: 1.3,
                            width: "max-content",
                        }}
                    >
                        Add platforms in Properties
                    </p>
                ) : (
                    visiblePlatforms.map((id) => renderPlatformButton(id))
                )}
            </div>
        </div>
    )
}

addPropertyControls(ShareButtons, {
    showHeading: {
        type: ControlType.Boolean,
        title: "Heading",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Hide",
    },
    heading: {
        type: ControlType.String,
        title: "Text",
        defaultValue: "Share",
        hidden: (props) => !props.showHeading,
    },
    platforms: {
        type: ControlType.Array,
        title: "Platforms",
        control: {
            type: ControlType.Enum,
            options: PLATFORM_OPTIONS,
            optionTitles: PLATFORM_TITLES,
        },
        defaultValue: [
            "copy",
            "email",
            "whatsapp",
            "facebook",
            "x",
            "linkedin",
            "native",
        ],
        maxCount: 22,
    },
    appearance: {
        type: ControlType.Enum,
        title: "Content",
        options: ["icon", "icon-label", "label"],
        optionTitles: ["Icon", "Icon + label", "Label"],
        defaultValue: "icon",
    },
    buttonStyle: {
        type: ControlType.Enum,
        title: "Style",
        options: ["outline", "filled", "ghost", "brand"],
        optionTitles: ["Outline", "Filled", "Ghost", "Brand"],
        defaultValue: "outline",
    },
    direction: {
        type: ControlType.Enum,
        title: "Direction",
        options: ["horizontal", "vertical"],
        optionTitles: ["Row", "Column"],
        defaultValue: "horizontal",
        displaySegmentedControl: true,
    },
    alignment: {
        type: ControlType.Enum,
        title: "Align",
        options: ["start", "center", "end"],
        optionTitles: ["Left", "Center", "Right"],
        defaultValue: "start",
        displaySegmentedControl: true,
    },
    wrap: {
        type: ControlType.Boolean,
        title: "Wrap",
        defaultValue: true,
        enabledTitle: "Wrap",
        disabledTitle: "Nowrap",
    },
    gap: {
        type: ControlType.Number,
        title: "Spacing",
        defaultValue: FALLBACK_GAP,
        min: 0,
        max: 40,
        step: 1,
        unit: "px",
        displayStepper: true,
    },
    sizing: {
        type: ControlType.Object,
        title: "Appearance",
        icon: "effect",
        defaultValue: {
            buttonSize: FALLBACK_BUTTON_SIZE,
            iconSize: FALLBACK_ICON_SIZE,
            radius: FALLBACK_RADIUS_CSS,
            borderWidth: FALLBACK_BORDER_WIDTH,
        },
        controls: {
            buttonSize: {
                type: ControlType.Number,
                title: "Size",
                defaultValue: FALLBACK_BUTTON_SIZE,
                min: 28,
                max: 72,
                step: 1,
                unit: "px",
            },
            iconSize: {
                type: ControlType.Number,
                title: "Icon",
                defaultValue: FALLBACK_ICON_SIZE,
                min: 12,
                max: 32,
                step: 1,
                unit: "px",
            },
            radius: {
                type: ControlType.BorderRadius,
                title: "Radius",
                defaultValue: FALLBACK_RADIUS_CSS,
            },
            borderWidth: {
                type: ControlType.Number,
                title: "Stroke",
                defaultValue: FALLBACK_BORDER_WIDTH,
                min: 0,
                max: 4,
                step: 1,
                unit: "px",
                displayStepper: true,
            },
        },
    },
    colors: {
        type: ControlType.Object,
        title: "Colors",
        icon: "color",
        defaultValue: {
            fill: FALLBACK_FILL,
            icon: FALLBACK_ICON_COLOR,
            text: FALLBACK_TEXT_COLOR,
            border: FALLBACK_BORDER_COLOR,
        },
        controls: {
            fill: {
                type: ControlType.Color,
                title: "Fill",
                defaultValue: FALLBACK_FILL,
            },
            icon: {
                type: ControlType.Color,
                title: "Icon color",
                defaultValue: FALLBACK_ICON_COLOR,
            },
            text: {
                type: ControlType.Color,
                title: "Text color",
                defaultValue: FALLBACK_TEXT_COLOR,
            },
            border: {
                type: ControlType.Color,
                title: "Border color",
                defaultValue: FALLBACK_BORDER_COLOR,
            },
        },
    },
    hover: {
        type: ControlType.Object,
        title: "Hover",
        icon: "interaction",
        defaultValue: {
            background: FALLBACK_HOVER_BACKGROUND,
            icon: FALLBACK_HOVER_ICON,
            text: FALLBACK_HOVER_TEXT,
        },
        controls: {
            background: {
                type: ControlType.Color,
                title: "Background",
                defaultValue: FALLBACK_HOVER_BACKGROUND,
            },
            icon: {
                type: ControlType.Color,
                title: "Icon color",
                defaultValue: FALLBACK_HOVER_ICON,
            },
            text: {
                type: ControlType.Color,
                title: "Text color",
                defaultValue: FALLBACK_HOVER_TEXT,
            },
        },
    },
    typography: {
        type: ControlType.Object,
        title: "Typography",
        icon: "object",
        hidden: (props) => !props.showHeading && props.appearance === "icon",
        controls: {
            heading: {
                type: ControlType.Font,
                title: "Font",
                controls: "extended",
                defaultFontType: "sans-serif",
                defaultValue: {
                    variant: "Medium",
                    fontSize: "13px",
                    letterSpacing: "0.04em",
                    lineHeight: "1.2em",
                    textAlign: "left",
                },
                hidden: (props, rootProps) => {
                    const showHeading = rootProps?.showHeading ?? props.showHeading
                    return showHeading === false
                },
            },
            buttons: {
                type: ControlType.Font,
                title: "Buttons",
                controls: "extended",
                defaultFontType: "sans-serif",
                defaultValue: {
                    variant: "Medium",
                    fontSize: "13px",
                    letterSpacing: "-0.01em",
                    lineHeight: "1em",
                },
                hidden: (props, rootProps) => {
                    const appearance = rootProps?.appearance ?? props.appearance
                    return appearance === "icon"
                },
            },
        },
    },
})

ShareButtons.displayName = "Share Buttons"
