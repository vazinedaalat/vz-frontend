// Renders the brand cards in cards.html to JPEGs with macOS WebKit (correct Persian shaping, brand fonts).
//
//   swift scripts/brand-cards/render.swift                 # all cards → public/images/brand/cards
//   swift scripts/brand-cards/render.swift intro about     # selected cards
//   SCALE=2 swift scripts/brand-cards/render.swift         # 2x pixel density
//
// Run from the frontend-vz root after `npm ci` (fonts are read from node_modules/@fontsource).
// Preview a single card in a browser: open scripts/brand-cards/cards.html?card=about
//
// If swiftc fails with "redefinition of module 'SwiftBridging'" (Command Line Tools bug), compile with a
// VFS overlay that maps /Library/Developer/CommandLineTools/usr/include/swift/module.modulemap to an
// empty file:  swiftc -vfsoverlay overlay.yaml -Xcc -ivfsoverlay -Xcc overlay.yaml render.swift -o render

import AppKit
import WebKit

let allCards = ["intro", "about", "services", "consultation", "product", "contact", "social"]
let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let template = root.appendingPathComponent("scripts/brand-cards/cards.html")
let outDir = root.appendingPathComponent("public/images/brand/cards")
let scale = CGFloat(Double(ProcessInfo.processInfo.environment["SCALE"] ?? "1") ?? 1)
let requested = Array(CommandLine.arguments.dropFirst())
let queue = requested.isEmpty ? allCards : requested

guard FileManager.default.fileExists(atPath: template.path) else {
  FileHandle.standardError.write("cards.html not found — run from the frontend-vz root\n".data(using: .utf8)!)
  exit(1)
}
try? FileManager.default.createDirectory(at: outDir, withIntermediateDirectories: true)

final class Renderer: NSObject, WKNavigationDelegate {
  private let window = NSWindow(
    contentRect: NSRect(x: -10_000, y: -10_000, width: 1600, height: 1400),
    styleMask: [.borderless], backing: .buffered, defer: false)
  private let webView: WKWebView = {
    // Non-persistent store: no disk cache, so edits to cards.html always show up.
    let configuration = WKWebViewConfiguration()
    configuration.websiteDataStore = .nonPersistent()
    return WKWebView(frame: NSRect(x: 0, y: 0, width: 1600, height: 1400), configuration: configuration)
  }()
  private var pending: [String]

  init(cards: [String]) {
    pending = cards
    super.init()
    webView.navigationDelegate = self
    window.contentView = webView
    window.orderBack(nil)
  }

  func next() {
    guard let id = pending.first else { NSApp.terminate(nil); return }
    // A query (not a #fragment) so every card is a full navigation that fires didFinish.
    var components = URLComponents(url: template, resolvingAgainstBaseURL: false)!
    components.queryItems = [URLQueryItem(name: "card", value: id)]
    webView.loadFileURL(components.url!, allowingReadAccessTo: root)
  }

  func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
    let id = pending.removeFirst()
    webView.callAsyncJavaScript("return await window.cardReady", arguments: [:], in: nil, in: .page) { result in
      guard case .success(let value) = result, let json = value as? String,
        let data = json.data(using: .utf8),
        let size = try? JSONSerialization.jsonObject(with: data) as? [String: Double],
        let width = size["width"], let height = size["height"]
      else {
        print("✗ \(id): card not found or not ready")
        self.next()
        return
      }
      self.webView.setFrameSize(NSSize(width: width, height: height))
      let config = WKSnapshotConfiguration()
      config.rect = CGRect(x: 0, y: 0, width: width, height: height)
      config.snapshotWidth = NSNumber(value: width)
      config.afterScreenUpdates = true
      self.webView.takeSnapshot(with: config) { image, _ in
        if let image { self.save(image, id: id, width: Int(width * scale), height: Int(height * scale)) }
        self.next()
      }
    }
  }

  private func save(_ image: NSImage, id: String, width: Int, height: Int) {
    guard let rep = NSBitmapImageRep(
      bitmapDataPlanes: nil, pixelsWide: width, pixelsHigh: height, bitsPerSample: 8,
      samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB,
      bytesPerRow: 0, bitsPerPixel: 0)
    else { return }
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
    NSGraphicsContext.current?.imageInterpolation = .high
    image.draw(in: NSRect(x: 0, y: 0, width: width, height: height))
    NSGraphicsContext.restoreGraphicsState()
    let file = outDir.appendingPathComponent("\(id).jpg")
    if let data = rep.representation(using: .jpeg, properties: [.compressionFactor: 0.9]) {
      try? data.write(to: file)
      print("✓ \(file.path.replacingOccurrences(of: root.path + "/", with: "")) (\(width)×\(height))")
    }
  }
}

let app = NSApplication.shared
app.setActivationPolicy(.prohibited)
let renderer = Renderer(cards: queue)
DispatchQueue.main.async { renderer.next() }
app.run()
