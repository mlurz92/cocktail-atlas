---
name: pwa-expert
description: Building and debugging iOS/installable Progressive Web Apps (PWAs) — manifest.json, service workers, meta tags, safe-area/notch/home-indicator handling, and the standalone-mode viewport bugs specific to iOS. Use whenever the user asks about PWA install behavior, "Add to Home Screen" apps, iOS Safari standalone-mode layout bugs (gaps/bars at the top or bottom of the screen), service worker caching/update issues, or light/dark theme contrast problems in a PWA.
---

# iOS PWA Expert

Knowledge and checklists for building installable web apps that behave correctly on iOS, distilled from hands-on debugging of real, reproducible bugs (not just theory). iOS "Add to Home Screen" standalone mode has several behaviors that differ from both desktop browsers and regular Mobile Safari tabs — most PWA bugs trace back to one of the sections below.

## 1. The iOS standalone-mode bottom/top gap (home indicator & notch)

### Symptom
A black/white bar appears at the bottom (or top) of the screen, below a fixed bottom nav bar or above a fixed header, **only** when the app is installed via "Add to Home Screen" and opened in standalone mode — not in a normal Safari tab.

### Root cause
Every height-unit-based approach has been reported to under-report the true available height specifically in iOS standalone mode, excluding the safe-area insets (home indicator strip at the bottom, notch/Dynamic Island at the top):
- `100vh`
- `100dvh` (including on iOS 15.4+, despite being the "modern, spec-correct" unit)
- `-webkit-fill-available` (the classic pre-`dvh` trick — also unreliable in standalone mode)
- `window.innerHeight` measured in JS (does **not** include the safe area in standalone mode, unlike what many articles claim)

Do not trust any fix that computes a height value and assigns it to the app shell. All of the above have failed in real-device testing during this project's own debugging (see git history: two consecutive attempts using `100dvh`+`-webkit-fill-available` ordering, then `window.innerHeight`-driven CSS vars, both failed on a physical device before the actual fix was found).

### The fix that actually works
Anchor the app shell with `position: fixed; inset: 0;` instead of computing a height at all:

```css
.app-container {
  position: fixed;
  inset: 0; /* top/right/bottom/left: 0 — anchors to the true screen edges */
  /* no height/width computation needed */
}
```

This works because `position: fixed` positions the element against the **initial containing block**, which `viewport-fit=cover` (see the meta tag below) expands to the full physical screen including the safe areas. This is a fundamentally different code path from viewport-unit/`innerHeight` resolution, and does not appear to share the same bug.

**Caveats:**
- Any element using `position: fixed; inset: 0` for its main app shell is taken out of normal document flow. If you also want the shell centered/constrained on larger screens (e.g. a max-width mobile container on desktop, or a "floating card" layout on wide viewports), explicitly override `position: relative` at that breakpoint — `position: fixed` combined with `margin: auto` centering only works while `left`/`right` (or `inset`) are both unconstrained by an explicit `position: relative` override.
- Still add `env(safe-area-inset-*)` padding to elements that need visible content clear of the notch/home-indicator (see §2) — `position: fixed; inset: 0` only fixes the *shell's* sizing, not padding for content inside it.
- **You cannot verify this fix in headless Chromium.** Chromium does not implement `-webkit-fill-available` and does not reproduce the iOS-standalone-specific viewport/safe-area bug at all — a headless test showing "no gap" proves nothing about real iOS behavior. Reason about the mechanism (does the fix depend on a height computation, yes/no?) rather than trusting a browser screenshot for this specific class of bug. The only conclusive test is a real iOS device with the app actually installed via "Add to Home Screen".

### Required prerequisite meta tag
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```
Without `viewport-fit=cover`, the initial containing block never expands under the safe areas in the first place, and `env(safe-area-inset-*)` values stay `0`.

## 2. Safe-area padding for content (not the same problem as §1)

Separately from the shell-sizing fix, any fixed/absolute element with content close to a screen edge (bottom nav, top header, floating action buttons, toast/snackbar) needs explicit padding using the CSS environment variables:

```css
:root {
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
}

.app-navbar {
  height: calc(64px + var(--safe-bottom));
  padding-bottom: var(--safe-bottom);
}

.app-header {
  padding-top: calc(16px + var(--safe-top));
}
```

Known timing gotcha (WebKit bug 191872): `env()` values may not be populated until a moment after page load, causing a flash of unpadded layout on cold start. This is generally not worth working around with JS probes for a normal content layout — it self-corrects within one frame — but be aware of it if you see a brief layout flash specifically on cold launch from the home screen icon.

## 3. Service worker caching — the silent "my fix isn't showing up" bug

If a PWA has an installed, cache-first service worker, **any CSS/HTML/JS fix you ship will not reach already-installed devices** until the cache is invalidated. This is a completely different failure mode from §1 but produces the identical symptom (user reports "the bug is still there" after a fix that is verifiably correct in the source).

Checklist when a user reports a shipped fix "isn't working" on a real device:
1. **Check the cache-busting mechanism.** A static `CACHE_NAME` (e.g. `'app-v9'`) that never changes means the `activate` handler's `cache !== CACHE_NAME` cleanup never fires, and a pure cache-first `fetch` handler never re-checks the network for already-cached URLs. Bump the version string on every deploy that changes cached assets, at minimum.
2. **Prefer stale-while-revalidate over pure cache-first** for assets that change (HTML/CSS/JS), so staleness self-heals on the *next* load even if you forget to bump the version:
   ```js
   self.addEventListener('fetch', (event) => {
     if (event.request.method !== 'GET') return;
     event.respondWith(
       caches.open(CACHE_NAME).then((cache) =>
         cache.match(event.request).then((cached) => {
           const network = fetch(event.request).then((res) => {
             if (res && res.status === 200 && res.type === 'basic') {
               cache.put(event.request, res.clone());
             }
             return res;
           }).catch(() => cached);
           return cached || network;
         })
       )
     );
   });
   ```
3. **Add an update-and-reload flow on the client**, so a new service worker actually takes effect instead of sitting "waiting" indefinitely:
   ```js
   if ('serviceWorker' in navigator) {
     let refreshing = false;
     navigator.serviceWorker.addEventListener('controllerchange', () => {
       if (refreshing) return;
       refreshing = true;
       window.location.reload();
     });
     window.addEventListener('load', () => {
       navigator.serviceWorker.register('sw.js');
     });
   }
   ```
   Combined with `self.skipWaiting()` in `install` and `self.clients.claim()` in `activate` (both usually already present), this reloads the page exactly once when a new version takes control — the user needs to background/reopen or refresh the app once while online, rather than deleting and reinstalling the home-screen icon.
4. When debugging "the fix isn't visible on device," always ask/verify: is this genuinely a code bug, or a stale cache? Check the deployed source directly (e.g. `curl` the live URL, or check the actual merged branch content) rather than assuming a previously-verified-correct fix must be wrong.

## 4. manifest.json baseline

```json
{
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#0A0A0B",
  "theme_color": "#0A0A0B",
  "icons": [
    { "src": "icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" }
  ]
}
```
- `background_color`/`theme_color` should match (or be very close to) the app's actual CSS background, since iOS uses it for the launch splash before any CSS loads.
- iOS home-screen apps largely ignore `manifest.json` for install behavior (it matters more for Android/Chrome) — the Apple-specific meta tags below are what actually control standalone behavior on iOS:
  ```html
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="App Name">
  <link rel="apple-touch-icon" href="apple-touch-icon.png">
  ```

## 5. Light/dark theme contrast pitfalls

When a design supports both a dark and light theme via a CSS class/variable switch, audit specifically for:
- **Illustration/decorative colors hardcoded for one theme.** `rgba(255,255,255,0.1)` outlines/highlights designed to read subtly against a near-black background become invisible against a light background. Any such value that renders directly against the *page/card* background (not against a colored fill on top of it) needs a themed CSS variable, not a hardcoded value.
- **Text-on-accent colors.** A hardcoded `color: #000` (or `#fff`) on top of `background: var(--accent-gradient)` breaks the moment the accent gradient itself changes between light/dark themes (e.g. a light-mode accent gradient that's actually a dark copper tone — black text on it is unreadable). Use a themed `--on-accent` variable instead of a hardcoded color.
- Grep for hardcoded hex/rgba colors outside of the theme variable blocks (`grep -nE "#[0-9a-fA-F]{3,8}\b" styles.css | grep -v "var(--"`) as a quick audit to find anything that isn't going through the theme system.

## Workflow for "the iOS PWA gap/bug is still there"

1. Read the actual deployed/merged source directly — don't assume a previously-applied fix is present; verify with `git show origin/main:<file>` or by curling the live URL.
2. If the fix genuinely isn't present in the deployed source, that's the bug — reapply it.
3. If the fix is present in the deployed source but the user still sees it on a real device, suspect service worker caching (§3) before suspecting the CSS mechanism is wrong.
4. Only if both of the above check out clean should you revisit whether the CSS mechanism itself (position:fixed + inset:0, per §1) needs further adjustment — and even then, remember headless browser testing cannot validate iOS-standalone-specific viewport bugs.
