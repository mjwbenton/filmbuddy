# Icon Examples

Reference implementations showing FilmBuddy icon patterns.

## Camera Icon (gear)

```svg
<!-- gear-inactive.svg -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="7" width="18" height="12" rx="2" stroke="#6b6b6b" stroke-width="1.5" fill="none"/>
  <rect x="8" y="4" width="6" height="3" rx="1" stroke="#6b6b6b" stroke-width="1.5" fill="none"/>
  <circle cx="12" cy="13" r="4" stroke="#6b6b6b" stroke-width="1.5" fill="none"/>
  <circle cx="12" cy="13" r="2" stroke="#6b6b6b" stroke-width="1" fill="none"/>
</svg>
```

## 120 Film Roll (rolls)

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
