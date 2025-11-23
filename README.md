# VS-Linker

A Visual Studio Code extension that provides file linking with Ctrl+Click for any language using custom regular expressions.

## Features

- Custom regex-based file linking for all languages
- Network path support (UNC paths)
- Built-in presets for popular languages (ASP, JS, TS, Vue, Python, PHP, CSS, HTML, C#, Go)
- Configuration validation tools

---

## Quick Start

**Option 1: Use Presets (Easiest)**

1. Command Palette (`Ctrl+Shift+P`) → `VS-Linker: Add Regex Preset`
2. Select your language/framework
3. Enter project root path
4. Done! Use Ctrl+Click to navigate files

**Option 2: Manual Configuration**

Edit your `settings.json` (see Configuration section below)

---

## How It Works

![openFile1](https://user-images.githubusercontent.com/57289429/182084053-4f2e0b72-e7e5-47db-80e2-c9597a43f63e.gif)

Use Ctrl+Click on any file reference to open it directly.

---

## Configuration

Add projects to your `settings.json`:

```json
{
  "vs-linker.projects": [
    {
      "rootPath": "C:\\MyProject",
      "regularExpress": [
        "/import\\s+.*?from\\s+['\"](?<filename>.*?)['\"]/g"
      ]
    },
    {
      "rootPath": "\\\\192.168.1.1\\SharedProject",
      "regularExpress": [
        "/<!--include file=\"(?<filename>.*?)\"-->/g"
      ]
    }
  ]
}
```

**Key Points:**
- `rootPath`: Project root directory
- `regularExpress`: Array of regex patterns (must include `(?<filename>...)` named group)
- Supports multiple projects with different regex patterns

---

## Commands

- **`VS-Linker: Add Regex Preset`** - Add preset for popular languages
- **`VS-Linker: Show All Presets`** - View available presets
- **`VS-Linker: Validate Configuration`** - Check configuration validity

---

## Presets

### Supported Languages
JavaScript, TypeScript, Vue, Python, PHP, CSS, HTML, ASP, C#, Go

### Usage
1. `Ctrl+Shift+P` → `VS-Linker: Add Regex Preset`
2. Select language
3. Enter project root path
4. Use Ctrl+Click to navigate files

---

## Writing Custom Regex

Required format: `/pattern/flags` with `(?<filename>...)` named group

Example:
```regex
/import\\s+from\\s+['"'](?<filename>.*?)['\"]/g
```

**Path Resolution:**
- Filename starts with `/` → absolute from `rootPath`
- Otherwise → relative to current file

---

## Troubleshooting

**Links not working?**
- Run `VS-Linker: Validate Configuration`
- Check VS-Linker output channel
- Verify regex includes `(?<filename>...)` named group

**Need help?** Check the output channel for detailed matching information.
