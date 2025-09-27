# shadcnui-rtl 🔄

[![npm version](https://badge.fury.io/js/shadcnui-rtl.svg)](https://www.npmjs.com/package/shadcnui-rtl)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> One-command RTL transformation for shadcn/ui components

Transform your shadcn/ui components to full RTL support with a single command. Perfect for Arabic, Hebrew, Persian, Urdu, and other RTL language applications.

## ✨ Features

- 🚀 **One Command**: Transform all your shadcn/ui components instantly
- 🎯 **Smart Detection**: Automatically identifies and transforms LTR classes
- 🔄 **Comprehensive**: Handles padding, margin, positioning, borders, text alignment, and animations
- 🛡️ **Safe**: Dry-run mode to preview changes, backup option for safety
- 🎨 **Icon Support**: Automatically rotates directional icons (ChevronLeft, ArrowRight, etc.)
- 📦 **Zero Config**: Works out of the box with sensible defaults
- 🧪 **Battle-tested**: Comprehensive test suite with 80%+ coverage

## 📦 Installation

### Global Installation (Recommended)
```bash
npm install -g shadcnui-rtl
```

### Using npx (No Installation)
```bash
npx shadcnui-rtl
```

### Local Installation
```bash
npm install --save-dev shadcnui-rtl
```

## 🚀 Quick Start

```bash
# Run in your project root
npx shadcnui-rtl

# That's it! Your components now support RTL 🎉
```

## 📖 Usage

### Basic Usage
```bash
# Transform components in default directory (src/components)
shadcnui-rtl

# Or use the short alias
scnrtl
```

### Custom Directory
```bash
shadcnui-rtl --path ./components
```

### Preview Changes (Dry Run)
```bash
shadcnui-rtl --dry-run
```

### Create Backups
```bash
shadcnui-rtl --backup
```

### Advanced Options
```bash
# Exclude specific files
shadcnui-rtl --exclude "dialog.tsx,modal.tsx"

# Disable icon rotation
shadcnui-rtl --no-rotate-icons

# Plain text output (no emojis)
shadcnui-rtl --no-icons

# Verbose output
shadcnui-rtl --verbose
```

## 🔄 What Gets Transformed?

### Tailwind Classes

| LTR Class | RTL Class | Description |
|-----------|-----------|-------------|
| `pl-*` | `ps-*` | Padding left → start |
| `pr-*` | `pe-*` | Padding right → end |
| `ml-*` | `ms-*` | Margin left → start |
| `mr-*` | `me-*` | Margin right → end |
| `left-*` | `start-*` | Left position → start |
| `right-*` | `end-*` | Right position → end |
| `rounded-l-*` | `rounded-s-*` | Border radius left → start |
| `rounded-r-*` | `rounded-e-*` | Border radius right → end |
| `border-l-*` | `border-s-*` | Border left → start |
| `border-r-*` | `border-e-*` | Border right → end |
| `text-left` | `text-start` | Text align left → start |
| `text-right` | `text-end` | Text align right → end |

### Special Components

- **Radio & Switch**: Adds proper RTL translation classes for checked states
- **Directional Icons**: Automatically adds `rtl:rotate-180` to:
  - ChevronLeft/Right
  - ArrowLeft/Right
  - CaretLeft/Right
  - PanelLeft/Right

### Data Attributes

Transforms Radix UI positioning:
- `data-side="left"` → `data-side="start"`
- `data-side="right"` → `data-side="end"`

## 🎯 Examples

### Before
```tsx
<Button className="pl-4 pr-2 text-left">
  <ChevronLeft className="w-4 h-4" />
  Click me
</Button>
```

### After
```tsx
<Button className="ps-4 pe-2 text-start">
  <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
  Click me
</Button>
```

## 🛡️ Safety Features

- **Dry Run**: Preview all changes without modifying files
- **Backup**: Create `.backup` files before transformation
- **Exclusion**: Skip specific files from transformation
- **Validation**: Checks component structure before transforming
- **Error Recovery**: Graceful handling of parsing errors

## ⚙️ Configuration

### CLI Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--path` | `-p` | Components directory path | `src/components` |
| `--dry-run` | `-d` | Preview changes only | `false` |
| `--backup` | `-b` | Create backup files | `false` |
| `--exclude` | `-e` | Files to skip (comma-separated) | `dialog.tsx` |
| `--verbose` | `-v` | Detailed output | `false` |
| `--no-icons` | | Disable emoji in output | `false` |
| `--no-rotate-icons` | | Skip icon rotation | `false` |
| `--help` | `-h` | Show help | |

## 🧪 Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes.

## 📄 License

MIT © [Saleh7](https://github.com/Saleh7)

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the amazing component library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives

## 💬 Support

- 🐛 [Report bugs](https://github.com/Saleh7/shadcnui-rtl/issues)
- 💡 [Request features](https://github.com/Saleh7/shadcnui-rtl/issues)
- 📧 [Contact](mailto:Saleh7@protonmail.ch)

---

<div align="center">
Made with ❤️ for the RTL community
</div>