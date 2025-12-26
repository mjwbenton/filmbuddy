# Icon Design Guidelines

## Size & Layout

- **ViewBox:** 24x24
- **Safe margins:** 2px from edges
- **Style:** Stroke-based only (use `fill="none"`)

## Colors

| State          | Color  | Hex       |
| -------------- | ------ | --------- |
| Active primary | Blue   | `#487cab` |
| Active accent  | Yellow | `#ecc24c` |
| Inactive       | Gray   | `#6b6b6b` |

## Stroke Widths

- **Primary elements:** `stroke-width="1.5"`
- **Secondary details:** `stroke-width="1"`

## SVG Layering

Elements are drawn in order - later elements appear on top. If you want element A to appear behind element B, draw A first:

```svg
<!-- Yellow lines drawn first (behind) -->
<line x1="8" y1="10" x2="16" y2="10" stroke="#ecc24c" stroke-width="1"/>
<!-- Blue rect drawn second (on top) -->
<rect x="8" y="5" width="8" height="14" stroke="#487cab" stroke-width="1.5" fill="none"/>
```

## Naming Convention

- `{object}-active.svg` - Active tab state (blue/yellow)
- `{object}-inactive.svg` - Inactive tab state (gray)
- `{feature}.svg` - Single-state icons

## Tips

- **Start simple:** 3-5 elements max
- **Study proportions:** What protrudes? What's inset?
- **Layer order matters:** First drawn = behind, last drawn = on top
- **Test at 24px:** Must be recognizable at actual size
- **Use whole numbers:** Align to pixel grid for crisp rendering
