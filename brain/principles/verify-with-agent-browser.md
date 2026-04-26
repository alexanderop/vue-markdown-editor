# Verify With agent-browser

After every task that changes user-visible behavior, drive the running app with the `agent-browser` CLI and confirm the change works in a real browser. Type checks, unit tests, and "the diff looks right" do not count as verification.

**Why:** Compilation proves syntax. Tests prove the cases you thought of. Only exercising the live UI proves the user-facing flow actually works end-to-end — routing, reactivity, styles, network, and the change you just made, together. This is the concrete enforcement of [[principles/prove-it-works]] for any UI-touching task in this project.

**Pattern:**

1. Start the dev server in the background (`npm run dev`) and wait until it's listening.
2. `agent-browser open http://localhost:<port>` — navigate to the page your change affects.
3. Exercise the actual change: `click`, `type`, `fill`, `press`, etc. Use `snapshot` to discover refs when selectors are unclear.
4. Read back real state with `agent-browser get text <sel>` / `get value <sel>` / `get url`. Take a `screenshot` for the report.
5. Walk one adjacent flow to catch regressions ([[principles/fix-root-causes]] — the change shouldn't break neighbors).
6. `agent-browser close` and stop the dev server.

**When to skip:** Pure docs, config that the toolchain validates (tsconfig, eslint), or backend-only changes with no UI surface. In those cases, state explicitly that browser verification was skipped and why — silence reads as "I forgot."

**When the app can't be exercised:** Say so directly. Do not claim success from a green build alone.
