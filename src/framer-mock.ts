export class FramerPluginClosedError extends Error {
    override name = "FramerPluginClosedError"
}

export function isComponentInstanceNode(_node: unknown): boolean {
    return false
}

export function useIsAllowedTo(..._methods: string[]): boolean {
    return true
}

export const framer = {
    showUI: async () => undefined,
    setMenu: async () => undefined,
    notify: () => undefined,
    isAllowedTo: () => true,
    getCodeFiles: async () => [],
    getCodeFile: async () => null,
    createCodeFile: async () => ({
        id: "mock",
        exports: [{ type: "component", insertURL: "https://example.com" }],
    }),
    addComponentInstance: async () => ({ id: "mock-node" }),
    navigateTo: async () => undefined,
    getSelection: async () => [],
}
