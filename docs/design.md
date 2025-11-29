# FilmBuddy Design System

A clean, utilitarian design with subtle vintage/field notes aesthetic touches.

## Color Palette

### Accent Colors (from logo)

| Name       | Hex       | Usage                                |
| ---------- | --------- | ------------------------------------ |
| Amber      | `#ecc24c` | Highlights, badges, warm accents     |
| Slate Blue | `#487cab` | Interactive elements, links, buttons |

### Neutrals

| Name  | Hex       | Usage                               |
| ----- | --------- | ----------------------------------- |
| Paper | `#faf9f7` | Primary background (warm off-white) |
| Ink   | `#1a1a1a` | Primary text (soft black)           |
| Stone | `#6b6b6b` | Secondary text                      |
| Fog   | `#e5e5e3` | Borders, dividers                   |
| Cloud | `#f2f1ef` | Card backgrounds, subtle fills      |

### Semantic Colors

| Name    | Hex       | Usage                         |
| ------- | --------- | ----------------------------- |
| Error   | `#c94a4a` | Destructive actions, errors   |
| Success | `#4a9c6b` | Confirmations, success states |
| Warning | `#d4915c` | Cautions, warnings            |

## Typography

### Font Families

- **Headings**: Jost (geometric sans-serif, Field Notes aesthetic)
- **Body**: SF Pro / System font (iOS standard)

### Type Scale

| Name       | Size | Weight | Font   | Usage                     |
| ---------- | ---- | ------ | ------ | ------------------------- |
| Display    | 32px | 600    | Jost   | Screen titles             |
| Heading    | 24px | 600    | Jost   | Section headers           |
| Subheading | 18px | 500    | Jost   | Card titles, labels       |
| Body       | 16px | 400    | System | Primary content           |
| Caption    | 14px | 400    | System | Secondary info, metadata  |
| Small      | 12px | 400    | System | Tertiary info, timestamps |

## Spacing Scale

Base unit: 4px

| Token | Value | Usage                      |
| ----- | ----- | -------------------------- |
| xs    | 4px   | Tight gaps, icon padding   |
| sm    | 8px   | Related element spacing    |
| md    | 16px  | Standard component padding |
| lg    | 24px  | Section spacing            |
| xl    | 32px  | Major section breaks       |
| 2xl   | 48px  | Screen-level spacing       |

## Border Radius

| Token | Value  | Usage                     |
| ----- | ------ | ------------------------- |
| sm    | 4px    | Buttons, small elements   |
| md    | 8px    | Cards, inputs             |
| lg    | 12px   | Modals, larger containers |
| full  | 9999px | Pills, avatars            |

## Shadows

| Token | Value                         | Usage            |
| ----- | ----------------------------- | ---------------- |
| sm    | `0 1px 2px rgba(0,0,0,0.05)`  | Subtle lift      |
| md    | `0 2px 8px rgba(0,0,0,0.08)`  | Cards, dropdowns |
| lg    | `0 4px 16px rgba(0,0,0,0.12)` | Modals, popovers |

## Motion

| Property | Value   | Usage                                |
| -------- | ------- | ------------------------------------ |
| Duration | `150ms` | Standard interactions (hover, press) |
| Easing   | `ease`  | Default easing curve                 |

Hover states: subtle lift with `translateY(-1px)` and shadow increase.

## Component Guidelines

### Buttons

- **Primary**: Slate Blue background, white text
- **Secondary**: Transparent with Slate Blue border and text
- **Destructive**: Error color background, white text
- Minimum touch target: 44x44pt

### Inputs

- Border: Fog color, 1px
- Focus: Slate Blue border
- Error: Error color border
- Background: White (`#ffffff`)
- Border radius: md (8px)

### Cards

- Background: Cloud or white
- Border: 1px Fog (optional)
- Border radius: md (8px)
- Shadow: sm or none
- Padding: md (16px)
- **Active state**: 3px Amber left border to indicate "current" item

### Lists

- Row height: minimum 44pt
- Separator: 1px Fog, inset from leading edge
- Swipe actions: Use semantic colors

### Section Headers

- Font: Jost, 14px, weight 500
- Color: Stone
- Transform: uppercase
- Letter spacing: 0.5px
- Margin: lg top, sm bottom

### Progress Bars

- Height: 4px
- Background: Fog
- Fill: Slate Blue
- Border radius: full (pill shape)

### Tab Bar

- Background: Cloud
- Border top: 1px Fog
- Active tab: Slate Blue
- Inactive tab: Stone

## iOS Conventions

- Respect safe areas
- Use SF Symbols for icons where possible
- Follow iOS navigation patterns (tab bar, navigation stack)
- Support Dynamic Type where practical
- Minimum touch target: 44x44pt

## Vintage/Field Notes Touches

Use sparingly to maintain clean aesthetic:

- Jost headings provide the geometric, utilitarian feel
- Warm paper background instead of pure white
- Subtle texture overlays (optional, for key screens)
- Amber accent for "active" or "current" states (like a highlighted field note)

## NativeWind / Tailwind Integration

Design tokens map to Tailwind utilities via `tailwind.config.js`:

| Design Token           | Tailwind Class                           |
| ---------------------- | ---------------------------------------- |
| Amber                  | `text-amber`, `bg-amber`, `border-amber` |
| Slate Blue             | `text-slate-blue`, `bg-slate-blue`       |
| Paper                  | `bg-paper`                               |
| Ink                    | `text-ink`                               |
| Stone                  | `text-stone`                             |
| Fog                    | `border-fog`, `bg-fog`                   |
| Cloud                  | `bg-cloud`                               |
| Spacing md (16px)      | `p-md`, `m-md`, `gap-md`                 |
| Border radius md (8px) | `rounded-md`                             |

### Component Example

```tsx
// components/Card.tsx
import { View, Text } from "react-native";

interface CardProps {
  title: string;
  children: React.ReactNode;
  active?: boolean;
}

export function Card({ title, children, active }: CardProps) {
  return (
    <View
      className={`
        bg-cloud rounded-md p-md shadow-sm
        ${active ? "border-l-[3px] border-l-amber" : ""}
      `}
    >
      <Text className="font-heading text-subheading text-ink mb-sm">
        {title}
      </Text>
      {children}
    </View>
  );
}
```

### Touch Targets

iOS requires 44x44pt minimum touch targets. Use `min-h-[44px] min-w-[44px]` for interactive elements:

```tsx
<Pressable className="min-h-[44px] min-w-[44px] items-center justify-center">
  <Text>Tap me</Text>
</Pressable>
```
