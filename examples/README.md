# Examples

This directory contains before and after examples of shadcn/ui components transformed for RTL support.

## Directory Structure

```
examples/
├── before/     # Original LTR components
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
└── after/      # Transformed RTL-ready components
    ├── button.tsx
    ├── card.tsx
    └── ...
```

## Key Transformations

### Button Component
- `pl-4` → `ps-4` (padding-left to padding-start)
- `pr-4` → `pe-4` (padding-right to padding-end)
- `text-left` → `text-start`
- `ChevronLeft` gets `rtl:rotate-180` class

### Card Component
- `ml-0` → `ms-0` (margin-left to margin-start)
- `mr-auto` → `me-auto` (margin-right to margin-end)
- `border-l-4` → `border-s-4` (border-left to border-start)

## Testing the Examples

1. Copy the "before" examples to your shadcn/ui project
2. Run `npx shadcnui-rtl`
3. Compare the result with the "after" examples

## Using in Your Project

The transformed components work seamlessly with RTL languages. Simply add `dir="rtl"` to your HTML:

```html
<html dir="rtl" lang="ar">
  <!-- Your RTL content -->
</html>
```

Or conditionally based on language:

```tsx
<html dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale}>
  <!-- Your content -->
</html>
```