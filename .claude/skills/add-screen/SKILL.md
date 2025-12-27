---
name: add-screen
description: Add screens and routes with Expo Router. Use when creating a screen, adding a page, new route, adding a tab, or navigation.
---

# Adding Screens

Expo Router provides file-based routing built on React Navigation.

## Project Structure

```
apps/mobile/app/
├── _layout.tsx           # Root layout (fonts, providers)
├── (tabs)/               # Tab navigation group
│   ├── _layout.tsx       # Tab bar configuration
│   ├── index.tsx         # First tab (Rolls)
│   └── [other].tsx       # Other tabs
└── roll/                 # Entity group
    ├── add.tsx           # Add screen (/roll/add)
    └── [id].tsx          # Detail screen (/roll/123)
```

## Adding a Tab Screen

1. Create the screen file in `app/(tabs)/`:

```tsx
// app/(tabs)/gear.tsx
import { View } from "react-native";
import { Text } from "@/components/ui";

export default function GearScreen() {
  return (
    <View className="flex-1 bg-paper p-md">
      <Text variant="display">Gear</Text>
    </View>
  );
}
```

2. Add the tab in `app/(tabs)/_layout.tsx`:

```tsx
<Tabs.Screen
  name="gear"
  options={{
    title: "Gear",
    tabBarIcon: ({ color }) => <GearIcon color={color} />,
  }}
/>
```

## Adding a Push Screen

Group screens by entity in `app/[entity]/`:

```tsx
// app/item/add.tsx
import { router } from "expo-router";
import { View } from "react-native";
import {
  ScreenHeader,
  HeaderCancelButton,
  HeaderSaveButton,
} from "@/components/ui";

export default function AddItemScreen() {
  return (
    <View className="flex-1 bg-paper">
      <ScreenHeader
        title="Add Item"
        left={<HeaderCancelButton onPress={() => router.back()} />}
        right={<HeaderSaveButton onPress={handleSave} disabled={!canSubmit} />}
      />
      {/* Content */}
    </View>
  );
}
```

Navigate to it:

```tsx
import { router } from "expo-router";

router.push("/item/add");
```

## Adding a Dynamic Route

Use brackets for parameters:

```tsx
// app/item/[id].tsx
import { useLocalSearchParams } from "expo-router";

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // Use id to fetch data
}
```

Navigate with params:

```tsx
router.push(`/item/${item.id}`);
```

## Screen Header Pattern

Use `ScreenHeader` from `@/components/ui` for consistent headers:

```tsx
import {
  ScreenHeader,
  HeaderCancelButton,
  HeaderSaveButton,
} from "@/components/ui";

<ScreenHeader
  title="Screen Title"
  left={<HeaderCancelButton onPress={() => router.back()} />}
  right={<HeaderSaveButton onPress={handleSave} disabled={!canSubmit} />}
/>;
```

Available header buttons:

- `HeaderCancelButton` - "Cancel" text button
- `HeaderCloseButton` - "Close" text button
- `HeaderSaveButton` - "Save" text button with `disabled` prop

## Modal Presentation

For modal screens, configure in the parent layout:

```tsx
// app/_layout.tsx
<Stack.Screen name="item/add" options={{ presentation: "modal" }} />
```

## Checklist

- [ ] Screen file in correct location (`app/(tabs)/` for tabs, `app/[entity]/` for others)
- [ ] Default export for the screen component
- [ ] `ScreenHeader` with appropriate title and buttons
- [ ] Navigation configured in parent `_layout.tsx` if needed
- [ ] `testID` on interactive elements for Maestro tests
