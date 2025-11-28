---
name: wireframe
description: Use this skill when creating or editing wireframes for FilmBuddy screens. Provides HTML templates, CSS classes, and conventions for sketchy Balsamiq-style iOS wireframes.
---

# Wireframe Mode

You are helping design wireframes for FilmBuddy, an iOS app for film photographers.

## Setup

Wireframes live in `docs/wireframes/`:
- `wireframe.css` - Shared sketchy Balsamiq-style styling
- `index.html` - Navigation hub listing all wireframes
- Individual screen files (e.g., `home.html`)

## Creating a New Wireframe

1. Create a new HTML file in `docs/wireframes/`
2. Use this template:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Screen Name] - FilmBuddy Wireframes</title>
  <link rel="stylesheet" href="wireframe.css">
</head>
<body>
  <div class="screen">
    <div class="status-bar">9:41 AM</div>

    <nav class="nav-bar">
      <h1>[Screen Title]</h1>
      <!-- Optional: back button, action buttons -->
    </nav>

    <main class="content">
      <!-- Screen content here -->
    </main>

    <nav class="tab-bar">
      <a href="home.html" class="tab-item">
        <div class="tab-icon"></div>
        <span>Rolls</span>
      </a>
      <a href="#" class="tab-item">
        <div class="tab-icon"></div>
        <span>Meter</span>
      </a>
      <a href="#" class="tab-item">
        <div class="tab-icon"></div>
        <span>Gear</span>
      </a>
    </nav>
  </div>
</body>
</html>
```

3. Add the new wireframe to `index.html`

## Available CSS Classes

**Layout:**
- `.screen` - iOS-sized container (375x812px)
- `.status-bar` - iOS status bar
- `.nav-bar` - Top navigation with title
- `.tab-bar` - Bottom tab navigation
- `.content` - Scrollable main content area

**Components:**
- `.card` - Tappable content card
- `.card-title`, `.card-subtitle`, `.card-meta` - Card text hierarchy
- `.button`, `.button.primary` - Buttons
- `.button-icon` - Icon-only button content
- `.list-item` - List row
- `.input` - Text input field
- `.section-header` - Section divider with label
- `.tab-item`, `.tab-item.active` - Tab bar items
- `.tab-icon` - Placeholder for tab icons

**States:**
- `.empty-state` - Empty state container
- `.empty-state-icon`, `.empty-state-text`, `.empty-state-hint`

**Annotations:**
- `.note` - Yellow sticky note for design comments
- `.placeholder` - Gray dashed box for images/icons

## Linking Screens

Use relative links to connect wireframes:
```html
<a href="roll-detail.html" class="card">...</a>
<a href="home.html" class="button">Back</a>
```

## Design Notes

Add design annotations using the `.note` class:
```html
<div class="note">
  Tapping a roll card navigates to the roll detail view
</div>
```

## Viewing Wireframes

Open `docs/wireframes/index.html` directly in a browser - no server needed.

## Reference

Read `docs/vision.md` for product context and feature requirements.
