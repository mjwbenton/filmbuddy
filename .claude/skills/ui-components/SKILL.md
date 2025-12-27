---
name: ui-components
description: Use the UI component library for consistent styling. Use when working with buttons, cards, text, inputs, headers, or any UI element.
---

# UI Components

Generic UI primitives in `components/ui/` provide consistent styling across the app.

## Available Components

| Component           | Purpose                                     |
| ------------------- | ------------------------------------------- |
| `Button`            | Interactive button with variants            |
| `Card`              | Container with optional active state        |
| `Text`              | Typography with size variants               |
| `TextInput`         | Form input with react-hook-form integration |
| `Label`             | Form field label                            |
| `ErrorMessage`      | Form validation error                       |
| `SectionHeader`     | Uppercase section title                     |
| `ScreenHeader`      | Screen header with slots                    |
| `HeaderCloseButton` | Close button for headers                    |
| `HeaderSaveButton`  | Save button with disabled state             |

## Import

```tsx
import {
  Button,
  Card,
  Text,
  TextInput,
  ScreenHeader,
  HeaderCloseButton,
  HeaderSaveButton,
} from "@/components/ui";
```

## Button

```tsx
// Primary (default)
<Button onPress={handleSave}>Save</Button>

// Secondary
<Button variant="secondary" onPress={handleCancel}>Cancel</Button>

// Destructive
<Button variant="destructive" onPress={handleDelete}>Delete</Button>
```

## Card

```tsx
// Basic card
<Card>
  <Text variant="subheading">Title</Text>
  <Text variant="caption" color="stone">Subtitle</Text>
</Card>

// Pressable card
<Card onPress={handlePress}>
  <Text>Tap me</Text>
</Card>

// Active state (amber left border)
<Card active={isSelected}>
  <Text>Selected item</Text>
</Card>
```

## Text

```tsx
<Text variant="display">Display (32px, Jost)</Text>
<Text variant="heading">Heading (24px, Jost)</Text>
<Text variant="subheading">Subheading (18px, Jost)</Text>
<Text variant="body">Body (16px, System)</Text>
<Text variant="caption">Caption (14px, System)</Text>
<Text variant="small">Small (12px, System)</Text>

// With color
<Text variant="caption" color="stone">Secondary text</Text>
```

## TextInput

Integrates with react-hook-form via `Controller`:

```tsx
<TextInput
  label="Email"
  name="email"
  control={form.control}
  placeholder="Enter email"
  testID="email-input"
  keyboardType="email-address"
/>
```

Props:

- `label` - Label text above input
- `name` - Field name in form
- `control` - From `useForm().control`
- `placeholder` - Placeholder text
- `testID` - For Maestro tests
- `keyboardType` - Keyboard type (optional)

## ScreenHeader

```tsx
<ScreenHeader
  title="Add Item"
  left={<HeaderCloseButton onPress={() => router.back()} />}
  right={<HeaderSaveButton onPress={handleSubmit} disabled={!canSubmit} />}
/>
```

Header buttons:

- `HeaderCloseButton` - "Close" text
- `HeaderSaveButton` - "Save" with `disabled` prop

## SectionHeader

```tsx
<SectionHeader>Active Rolls</SectionHeader>
```

Renders uppercase, stone-colored section title.

## Design System Colors

Use these Tailwind classes (see `docs/design.md` for full palette):

| Class                               | Usage                     |
| ----------------------------------- | ------------------------- |
| `bg-paper`                          | Primary background        |
| `bg-cloud`                          | Card/section background   |
| `text-ink`                          | Primary text              |
| `text-stone`                        | Secondary text            |
| `border-fog`                        | Borders, dividers         |
| `bg-amber` / `text-amber`           | Highlights, active states |
| `bg-slate-blue` / `text-slate-blue` | Interactive elements      |

## Spacing

```tsx
<View className="p-md">        {/* padding: 16px */}
<View className="gap-sm">      {/* gap: 8px */}
<View className="mt-lg">       {/* margin-top: 24px */}
```

| Token | Value |
| ----- | ----- |
| `xs`  | 4px   |
| `sm`  | 8px   |
| `md`  | 16px  |
| `lg`  | 24px  |
| `xl`  | 32px  |

## Touch Targets

iOS requires 44x44pt minimum. Use `min-h-touch min-w-touch`:

```tsx
<Pressable className="min-h-touch min-w-touch items-center justify-center">
  <Text>Tap me</Text>
</Pressable>
```

## Checklist

- [ ] Import from `@/components/ui` (not individual files)
- [ ] Use `Text` component instead of React Native `Text`
- [ ] Use design system colors (`bg-paper`, `text-ink`, etc.)
- [ ] `testID` on all interactive elements
- [ ] Minimum 44pt touch targets on buttons/pressables
