/** Capture-only stand-in for `@framer/plugin` so App.tsx can render outside Framer. */

export class FramerPluginClosedError extends Error {
    override name = "FramerPluginClosedError"
}

export function isComponentInstanceNode(_node: unknown): boolean {
    return false
}

export function useIsAllowedTo(..._methods: string[]): boolean {
    return true
}

async function noop(): Promise<void> {
    return undefined
}

export const framer = {
    showUI: noop,
    setMenu: noop,
    getCodeFiles: async () => [],
    getCodeFile: async () => null,
    isAllowedTo: () => true,
    createCodeFile: noop,
    addComponentInstance: noop,
    navigateTo: noop,
    notify: noop,
    getSelection: async () => [],
}
