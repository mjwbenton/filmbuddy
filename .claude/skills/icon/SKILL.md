---
name: icon
description: Use this skill when creating or editing SVG icons for FilmBuddy. Provides templates, conventions, and a verification workflow using visual comparison.
---

# Icon Design Mode

You are helping design SVG icons for FilmBuddy, an iOS app for film photographers.

## Setup

Icons live in `assets/icons/`:

- All icons are 24x24 SVG files
- Use stroke-based design (no fills)
- Follow the monochrome style guide

## Icon Design Process

### 1. Study the Reference Image

The user will provide a reference image. Study it carefully to identify:

- **Structural relationships:** Which parts protrude beyond others? (e.g., 120 film spool flanges are wider than the paper body)
- **Key shapes:** What are the 3-5 essential elements that make it recognizable?
- **Proportions:** How do the parts relate in size to each other?
- **Distinctive features:** What makes this object unique and identifiable at small sizes?

**Keep it simple.** Aim for the minimum number of elements needed - usually 3-5 shapes total.

### 2. Create the Icon

Create both active and inactive SVG files in `assets/icons/`:

```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Your icon elements here -->
</svg>
```

**Design Guidelines:**

- **Size:** 24x24 viewBox, content within 2px safe margins
- **Style:** Stroke-based only (use `fill="none"`)
- **Colors:**
  - Active: `stroke="#487cab"` (blue) with `stroke="#ecc24c"` (yellow) accent
  - Inactive: `stroke="#6b6b6b"` (gray)
- **Stroke widths:**
  - Primary elements: `stroke-width="1.5"`
  - Secondary details: `stroke-width="1"`

**SVG Layering:**
Elements are drawn in order - later elements appear on top. If you want element A to appear behind element B, draw A first:

```svg
<!-- Yellow lines drawn first (behind) -->
<line x1="8" y1="10" x2="16" y2="10" stroke="#ecc24c" stroke-width="1"/>
<!-- Blue rect drawn second (on top) -->
<rect x="8" y="5" width="8" height="14" stroke="#487cab" stroke-width="1.5" fill="none"/>
```

### 3. Naming Convention

- `{object}-active.svg` - Active tab state (blue/yellow)
- `{object}-inactive.svg` - Inactive tab state (gray)
- `{feature}.svg` - Single-state icons

### 4. Add to Preview Page

Add your icon to `assets/icons/preview.html` before the `<!-- Add new icons above this line -->` comment:

```html
<div class="icon-card">
  <div class="icon-name">your-icon-name.svg</div>
  <div class="icon-row">
    <div class="icon-display">
      <div class="label">Icon at Various Sizes</div>
      <div class="icon-sizes">
        <div class="size-box">
          <div class="size-label">24px</div>
          <img src="your-icon-name.svg" width="24" height="24" />
        </div>
        <div class="size-box">
          <div class="size-label">48px</div>
          <img src="your-icon-name.svg" width="48" height="48" />
        </div>
        <div class="size-box">
          <div class="size-label">96px</div>
          <img src="your-icon-name.svg" width="96" height="96" />
        </div>
      </div>
    </div>
  </div>
</div>
```

The preview uses `<img>` tags that reference the SVG files directly - no need to copy/paste SVG content.

### 5. Get User Feedback (REQUIRED)

After creating the icon and adding it to preview.html:

1. Take a screenshot using Playwright
2. Show the user the preview link and ask for feedback:

> Here's the icon. Open the preview to see it at different sizes:
> **file:///Users/mattb/workspace/filmbuddy/assets/icons/preview.html**
>
> Let me know if you'd like any changes before I finalize.

3. **Wait for the user to respond** before proceeding
4. Iterate based on feedback until the user approves

### 6. Finalize

Only after user approval:

- Ensure final SVGs are saved in `assets/icons/`
- Confirm both active and inactive versions exist
- Keep icons in `preview.html` for future reference

## Examples

### Camera Icon (gear)

```svg
<!-- gear-inactive.svg -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="7" width="18" height="12" rx="2" stroke="#6b6b6b" stroke-width="1.5" fill="none"/>
  <rect x="8" y="4" width="6" height="3" rx="1" stroke="#6b6b6b" stroke-width="1.5" fill="none"/>
  <circle cx="12" cy="13" r="4" stroke="#6b6b6b" stroke-width="1.5" fill="none"/>
  <circle cx="12" cy="13" r="2" stroke="#6b6b6b" stroke-width="1" fill="none"/>
</svg>
```

### 120 Film Roll (rolls)

Key insight: The spool flanges (top/bottom) are wider than the paper body.

```svg
<!-- rolls-inactive.svg -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Top flange (wider) -->
  <rect x="6" y="3" width="12" height="2" rx="1" stroke="#6b6b6b" stroke-width="1.5" fill="none"/>
  <!-- Paper body (narrower) -->
  <rect x="8" y="5" width="8" height="14" stroke="#6b6b6b" stroke-width="1.5" fill="none"/>
  <!-- Paper band lines -->
  <line x1="8" y1="10" x2="16" y2="10" stroke="#6b6b6b" stroke-width="1"/>
  <line x1="8" y1="14" x2="16" y2="14" stroke="#6b6b6b" stroke-width="1"/>
  <!-- Bottom flange (wider) -->
  <rect x="6" y="19" width="12" height="2" rx="1" stroke="#6b6b6b" stroke-width="1.5" fill="none"/>
</svg>
```

For active state: yellow lines are drawn BEFORE the body rect so they appear behind the blue outline.

## Tips

- **Start simple:** 3-5 elements max
- **Study proportions:** What protrudes? What's inset?
- **Layer order matters:** First drawn = behind, last drawn = on top
- **Test at 24px:** Must be recognizable at actual size
- **Use whole numbers:** Align to pixel grid for crisp rendering
- **Always get feedback:** Don't finalize without user approval
