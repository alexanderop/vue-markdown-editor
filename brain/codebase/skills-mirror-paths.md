# Skills live in two paths — `.agents/skills/` and `.claude/skills/`

Brainmaxxing places skills under `.agents/skills/`. Claude Code only discovers slash-command skills from `.claude/skills/`. So every project skill has to exist in **both** paths or it won't be invocable.

Today they are independent file copies (verified with `ls -la`, not symlinks). Drift is a real risk: if you edit only one copy, the other goes stale silently.

## When adding or editing a skill

Either:

1. Edit one path and copy to the other:

   ```sh
   cp -R .agents/skills/<name>/. .claude/skills/<name>/
   ```

2. Or replace one side with a symlink (one-time setup, then both paths stay in sync):

   ```sh
   rm -rf .claude/skills/<name>
   ln -s ../../.agents/skills/<name> .claude/skills/<name>
   ```

   `ls -la .claude/skills/` will show the link. Globally there are already symlink-based mirrors (e.g. `~/.claude/skills/find-skills -> ../../.agents/skills/find-skills`), so the pattern is fine.

## Quick drift check

```sh
diff -qr .agents/skills .claude/skills
```

Any output flags a divergence to reconcile before committing.
