import AppKit
import Foundation
import WebKit

final class Renderer: NSObject, WKNavigationDelegate {
    private let width = 1600
    private let height = 1200
    private let htmlURL: URL
    private let outURL: URL
    private var window: NSWindow!
    private var webView: WKWebView!

    init(htmlURL: URL, outURL: URL) {
        self.htmlURL = htmlURL
        self.outURL = outURL
        super.init()
    }

    func run() {
        let frame = NSRect(x: 0, y: 0, width: width, height: height)
        window = NSWindow(
            contentRect: frame,
            styleMask: [.borderless],
            backing: .buffered,
            defer: false
        )
        window.isReleasedWhenClosed = false
        window.backgroundColor = NSColor(calibratedRed: 216 / 255, green: 203 / 255, blue: 184 / 255, alpha: 1)

        let config = WKWebViewConfiguration()
        webView = WKWebView(frame: frame, configuration: config)
        webView.navigationDelegate = self
        webView.setValue(false, forKey: "drawsBackground")
        window.contentView = webView
        window.orderBack(nil)

        webView.loadFileURL(htmlURL, allowingReadAccessTo: htmlURL.deletingLastPathComponent())
        NSApp.run()
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        fputs("navigation failed: \(error.localizedDescription)\n", stderr)
        exit(1)
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        fputs("provisional navigation failed: \(error.localizedDescription)\n", stderr)
        exit(1)
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.4) { [weak self] in
            self?.capture()
        }
    }

    private func capture() {
        let config = WKSnapshotConfiguration()
        config.rect = CGRect(x: 0, y: 0, width: width, height: height)
        config.snapshotWidth = NSNumber(value: width)

        webView.takeSnapshot(with: config) { image, error in
            guard let image else {
                fputs("snapshot failed: \(error?.localizedDescription ?? "no image")\n", stderr)
                exit(1)
            }

            guard let output = NSBitmapImageRep(
                bitmapDataPlanes: nil,
                pixelsWide: self.width,
                pixelsHigh: self.height,
                bitsPerSample: 8,
                samplesPerPixel: 4,
                hasAlpha: true,
                isPlanar: false,
                colorSpaceName: .deviceRGB,
                bytesPerRow: 0,
                bitsPerPixel: 0
            ) else {
                fputs("bitmap alloc failed\n", stderr)
                exit(1)
            }

            output.size = NSSize(width: self.width, height: self.height)
            guard let ctx = NSGraphicsContext(bitmapImageRep: output) else {
                fputs("graphics context failed\n", stderr)
                exit(1)
            }
            NSGraphicsContext.saveGraphicsState()
            NSGraphicsContext.current = ctx
            ctx.imageInterpolation = .high
            image.draw(
                in: NSRect(x: 0, y: 0, width: self.width, height: self.height),
                from: .zero,
                operation: .copy,
                fraction: 1
            )
            ctx.flushGraphics()
            NSGraphicsContext.restoreGraphicsState()

            guard let png = output.representation(using: .png, properties: [:]) else {
                fputs("png encode failed\n", stderr)
                exit(1)
            }
            do {
                try png.write(to: self.outURL)
                FileHandle.standardOutput.write(Data("wrote \(self.outURL.path)\n".utf8))
                exit(0)
            } catch {
                fputs("write failed: \(error.localizedDescription)\n", stderr)
                exit(1)
            }
        }
    }
}

guard CommandLine.arguments.count >= 3 else {
    fputs("usage: render-thumbnail.swift <html> <png>\n", stderr)
    exit(1)
}

let htmlURL = URL(fileURLWithPath: CommandLine.arguments[1]).standardizedFileURL
let outURL = URL(fileURLWithPath: CommandLine.arguments[2]).standardizedFileURL

guard FileManager.default.fileExists(atPath: htmlURL.path) else {
    fputs("missing html: \(htmlURL.path)\n", stderr)
    exit(1)
}

try FileManager.default.createDirectory(at: outURL.deletingLastPathComponent(), withIntermediateDirectories: true)

let app = NSApplication.shared
app.setActivationPolicy(.accessory)
let renderer = Renderer(htmlURL: htmlURL, outURL: outURL)
renderer.run()
