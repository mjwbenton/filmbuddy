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

### 1. Understand the Reference

The user will provide a reference image in the chat. Study it carefully to understand:
- Key shapes and elements
- Visual hierarchy
- Level of detail to maintain
- Distinctive features that make it recognizable

### 2. Create the Icon

Create a new SVG file in `assets/icons/` using this template:

```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Your icon elements here -->
</svg>
```

**Design Guidelines:**
- **Size:** 24x24 viewBox, keeping content within safe margins (2px padding)
- **Style:** Stroke-based, no fills (use `fill="none"`)
- **Colors:**
  - Active state: `stroke="#487cab"` (blue) with `stroke="#ecc24c"` (yellow) highlight accent
  - Inactive state: `stroke="#6b6b6b"` (medium gray)
- **Stroke widths:**
  - Primary elements: `stroke-width="1.5"`
  - Secondary details: `stroke-width="1"`
- **Simplicity:** Icons should be recognizable at small sizes
- **Consistency:** Match the visual weight of existing icons

**Common Elements:**
- Use `<rect>`, `<circle>`, `<line>`, `<path>` for shapes
- Add `rx` for rounded corners
- Keep paths simple and readable

### 3. Naming Convention

Name icons descriptively:
- `{object}-active.svg` - Active tab state (blue)
- `{object}-inactive.svg` - Inactive tab state (gray)
- `{feature}.svg` - Single-state icons

Examples: `camera-active.svg`, `film-roll-inactive.svg`, `plus.svg`

### 4. Verification Workflow

After creating the icon, verify it visually using `assets/icons/preview.html`:

**A. Add your icon to the preview page:**

1. Open `assets/icons/preview.html`
2. Add a new icon card before the `<!-- Add new icons below this line -->` comment
3. Use this template:

```html
<div class="icon-card">
  <div class="icon-name">your-icon-name.svg</div>
  <div class="icon-row">
    <div class="icon-display">
      <div class="label">Icon at Various Sizes</div>
      <div class="icon-sizes">
        <div class="size-box">
          <div class="size-label">24px</div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Paste your SVG content here -->
          </svg>
        </div>
        <div class="size-box">
          <div class="size-label">48px</div>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Paste your SVG content here -->
          </svg>
        </div>
        <div class="size-box">
          <div class="size-label">96px</div>
          <svg width="96" height="96" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Paste your SVG content here -->
          </svg>
        </div>
      </div>
    </div>
  </div>
</div>
```

4. Paste your SVG content (just the inner elements, not the outer `<svg>` tag) into all three size boxes

**B. Use Playwright to capture and review:**

1. Navigate to `file:///Users/mattb/workspace/filmbuddy/assets/icons/preview.html`
2. Take a screenshot of the page or the specific new icon card
3. Review the screenshot to check:
   - Visual quality at all sizes (especially 24px)
   - Consistent stroke weight
   - Proper centering and alignment
   - Clean, simple shapes
   - Matches the reference image style

**C. Iterate if needed:**

If the icon doesn't look right:
- Adjust shapes and proportions in the SVG file
- Update the preview.html with the new SVG content
- Take another screenshot
- Repeat until satisfied

### 5. Finalize

After verification is complete:
- Ensure the final SVG is saved in `assets/icons/`
- Keep the icon in `preview.html` for future reference
- Confirm the icon follows naming conventions

## Example: Creating a Camera Icon

Given a reference image of a camera, create both active and inactive states:

**Inactive state (gear-inactive.svg):**
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Camera body -->
  <rect x="3" y="7" width="18" height="12" rx="2" stroke="#6b6b6b" stroke-width="1.5" fill="none"/>
  <!-- Viewfinder bump -->
  <rect x="8" y="4" width="6" height="3" rx="1" stroke="#6b6b6b" stroke-width="1.5" fill="none"/>
  <!-- Lens -->
  <circle cx="12" cy="13" r="4" stroke="#6b6b6b" stroke-width="1.5" fill="none"/>
  <circle cx="12" cy="13" r="2" stroke="#6b6b6b" stroke-width="1" fill="none"/>
</svg>
```

**Active state (gear-active.svg):**
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Camera body -->
  <rect x="3" y="7" width="18" height="12" rx="2" stroke="#487cab" stroke-width="1.5" fill="none"/>
  <!-- Viewfinder bump -->
  <rect x="8" y="4" width="6" height="3" rx="1" stroke="#487cab" stroke-width="1.5" fill="none"/>
  <!-- Lens -->
  <circle cx="12" cy="13" r="4" stroke="#487cab" stroke-width="1.5" fill="none"/>
  <circle cx="12" cy="13" r="2" stroke="#ecc24c" stroke-width="1.5" fill="none"/>
</svg>
```

Note how the active state uses blue for primary elements and adds a yellow highlight on a key detail (the inner lens circle) for visual interest.

## Tips

- **Start simple:** Capture the essence, not every detail
- **Test at actual size:** Icons must work at 24px
- **Use geometric primitives:** Circles, rectangles, and simple paths
- **Align to pixel grid:** Use whole numbers or .5 values for crisp rendering
- **Iterate quickly:** Generate, preview, refine
- **Compare side-by-side:** The preview workflow is essential

## Reference

See existing icons in `assets/icons/` for style consistency.
