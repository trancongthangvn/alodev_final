<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project writing rules

## Punctuation: hyphen `-` only, NEVER em-dash `—`

Replace any `—` (U+2014 em-dash) with `-` (U+002D hyphen) in ALL contexts:
- UI copy (Vietnamese + English)
- Code comments
- Commit messages
- Documentation
- File headers

**Why:** Brand voice consistency. The em-dash reads as "AI-generated prose" - founders/B2B Vietnamese audience reads cleaner with simple hyphen. Project-wide rule, applies to every file edit.

**How to apply:** Before saving any edit, search the new content for `—` and replace with `-`. When generating new text, use `-` from the start.
