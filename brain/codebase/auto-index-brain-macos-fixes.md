# `auto-index-brain.sh` — divergence from upstream brainmaxxing

`.claude/hooks/auto-index-brain.sh` is forked from brainmaxxing's PostToolUse hook. Three macOS/portability fixes were applied locally — keep them when merging upstream.

## 1. BSD sed has no `\U`

Upstream capitalizes section headers with `sed 's/./\U&/'`, which is GNU-only. On macOS BSD sed it emits `## Uprinciples`. Use awk:

```sh
header="$(echo "$section" | awk '{print toupper(substr($0,1,1)) substr($0,2)}')"
```

## 2. `! -name "index.md"` drops nested indexes

Upstream excludes the top-level `brain/index.md` with `! -name "index.md"` — but that filter is name-based, so it also drops `brain/plans/index.md`, `brain/codebase/index.md`, etc., losing whole sections. Anchor by full path:

```sh
find "$BRAIN_DIR" -type f -name "*.md" ! -path "${BRAIN_DIR}/index.md"
```

## 3. Standalone file with same name as section directory gets double-listed

When `brain/principles.md` exists alongside `brain/principles/`, the standalone file is listed once under `## Principles` (because `grep "^principles\(/\|$\)"` matches both) and again under `## Other`. Filter the standalone list against the section names:

```sh
standalone=$(echo "$disk" | grep -v '/' || true)
if [ -n "$dirs" ] && [ -n "$standalone" ]; then
    standalone=$(echo "$standalone" | grep -vxF "$dirs" || true)
fi
```

## Known limitation: `Write` doesn't trigger the hook

The PostToolUse matcher in `.claude/settings.json` doesn't fire on `Write` — only on `Edit`. After creating a new brain file with `Write`, run the hook by hand:

```sh
echo '{}' | bash .claude/hooks/auto-index-brain.sh
```

Or append the new wikilink to `brain/index.md` manually.
