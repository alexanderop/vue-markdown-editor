#!/bin/bash
# auto-index-brain.sh — PostToolUse hook
# Regenerates brain/index.md when brain/ files are added or removed.
# Emits bare wikilinks — no LLM-generated descriptions.

# Consume hook input
cat > /dev/null

set -euo pipefail

BRAIN_DIR="${CLAUDE_PROJECT_DIR}/brain"
INDEX="${BRAIN_DIR}/index.md"

[ -d "$BRAIN_DIR" ] || exit 0
[ -f "$INDEX" ] || exit 0

# All .md files except the top-level brain/index.md — relative paths without .md extension.
# Use -path (portable on BSD/macOS and GNU find) instead of -name, so subdir index.md
# files like brain/plans/index.md are kept.
disk=$(find "$BRAIN_DIR" -type f -name "*.md" ! -path "${BRAIN_DIR}/index.md" \
    | sed "s|^${BRAIN_DIR}/||; s|\.md$||" \
    | sort)

# Wikilinks in current index
indexed=$(sed -n 's/.*\[\[\([^]]*\)\]\].*/\1/p' "$INDEX" | sort)

# Exit fast if nothing changed (no new/removed files)
[ "$disk" = "$indexed" ] && exit 0

# --- Drift detected, rebuild ---

# Emit a list of bare wikilinks
emit_files() {
    while IFS= read -r f; do
        [ -z "$f" ] && continue
        echo "- [[$f]]"
    done
}

# Collect all top-level directories
dirs=$(echo "$disk" | grep '/' | sed 's|/.*||' | sort -u)

# Rebuild index
{
    echo "# Brain"
    for section in $dirs; do
        files=$(echo "$disk" | grep "^${section}\(/\|$\)" || true)
        [ -z "$files" ] && continue
        # Capitalize first letter for header (portable: BSD sed has no \U)
        header="$(echo "$section" | awk '{print toupper(substr($0,1,1)) substr($0,2)}')"
        printf '\n## %s\n' "$header"
        echo "$files" | emit_files
    done

    # Standalone files: not in any subdirectory AND not already listed
    # alongside a section directory of the same name (e.g. principles.md
    # next to a principles/ directory — already emitted under "Principles").
    standalone=$(echo "$disk" | grep -v '/' || true)
    if [ -n "$dirs" ] && [ -n "$standalone" ]; then
        standalone=$(echo "$standalone" | grep -vxF "$dirs" || true)
    fi
    if [ -n "$standalone" ]; then
        printf '\n## Other\n'
        echo "$standalone" | emit_files
    fi
    echo ""
} > "$INDEX"
