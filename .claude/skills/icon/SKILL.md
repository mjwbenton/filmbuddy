---
name: icon
description: Design 24x24 SVG icons with stroke-based style. Use when creating icons, designing tab bar icons, or making SVG assets.
---

# Icon Design Mode

You are helping design SVG icons for FilmBuddy, an iOS app for film photographers.

## Setup

Icons live in `assets/icons/`. For design specs, see [design-guidelines.md](design-guidelines.md).

## Icon Design Process

### 1. Study the Reference Image

The user will provide a reference image. Study it carefully to identify:

- **Structural relationships:** Which parts protrude beyond others?
- **Key shapes:** What are the 3-5 essential elements that make it recognizable?
- **Proportions:** How do the parts relate in size to each other?
- **Distinctive features:** What makes this object unique and identifiable at small sizes?

**Keep it simple.** Aim for 3-5 shapes total.

### 2. Create the Icon

Create both active and inactive SVG files in `assets/icons/`:

```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Your icon elements here -->
</svg>
```

See [design-guidelines.md](design-guidelines.md) for colors, stroke widths, and layering rules.
See [examples.md](examples.md) for reference implementations.

### 3. Add to Preview Page

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

### 4. Get User Feedback (REQUIRED)

After creating the icon and adding it to preview.html:

1. Take a screenshot using Playwright
2. Show the user the preview link and ask for feedback:

> Here's the icon. Open the preview to see it at different sizes:
> **file:///Users/mattb/workspace/filmbuddy/assets/icons/preview.html**
>
> Let me know if you'd like any changes before I finalize.

3. **Wait for the user to respond** before proceeding
4. Iterate based on feedback until the user approves

### 5. Finalize

Only after user approval:

- Ensure final SVGs are saved in `assets/icons/`
- Confirm both active and inactive versions exist
- Keep icons in `preview.html` for future reference
