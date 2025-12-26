---
name: add-form
description: Add forms with react-hook-form and Zod validation. Use when creating a form, adding validation, building a form hook, or integrating form inputs.
---

# Adding Forms

Forms use [react-hook-form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation.

## Pattern Overview

1. **Schema** (`db/[domain].ts`): Zod schema from Drizzle table using `drizzle-zod`
2. **Hook** (`hooks/use[Name]Form.ts`): Wraps `useForm` with `zodResolver`
3. **Component** (`components/[Name]Form.tsx`): Presentational form using `TextInput` from `@/components/ui`
4. **Screen** (`app/`): Uses the hook, passes `form` to component

## Step 1: Define Schema

In `db/[domain].ts`, create a form schema from the Drizzle table:

```typescript
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const items = sqliteTable("items", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

// Form schema (picks fields user edits, adds validation)
export const itemFormSchema = createInsertSchema(items, {
  name: z.string().trim().min(1, "Name is required"),
}).pick({ name: true });

export type ItemForm = z.infer<typeof itemFormSchema>;
```

Export from `db/schema.ts`.

## Step 2: Create Form Hook

```typescript
// hooks/useItemForm.ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { itemFormSchema, ItemForm } from "@/db/schema";

interface UseItemFormOptions {
  defaultValues?: Partial<ItemForm>;
  onSubmit: (data: ItemForm) => Promise<void>;
}

export function useItemForm({ defaultValues, onSubmit }: UseItemFormOptions) {
  const form = useForm<ItemForm>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: { name: "", ...defaultValues },
    mode: "onSubmit",
  });

  return {
    form,
    handleSubmit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting,
    canSubmit: form.formState.isValid || !form.formState.isSubmitted,
  };
}
```

## Step 3: Create Form Component

```tsx
// components/ItemForm.tsx
import { Control } from "react-hook-form";
import { View } from "react-native";
import { TextInput } from "@/components/ui";
import { ItemForm } from "@/db/schema";

interface ItemFormProps {
  control: Control<ItemForm>;
}

export function ItemForm({ control }: ItemFormProps) {
  return (
    <View className="gap-md">
      <TextInput
        label="Name"
        name="name"
        control={control}
        placeholder="Enter name"
        testID="name-input"
      />
    </View>
  );
}
```

## Step 4: Use in Screen

```tsx
// app/add-item.tsx
import { router } from "expo-router";
import { View } from "react-native";
import {
  ScreenHeader,
  HeaderCancelButton,
  HeaderSaveButton,
} from "@/components/ui";
import { ItemForm } from "@/components/ItemForm";
import { useItemForm } from "@/hooks/useItemForm";
import { useItemStore } from "@/stores/itemStore";

export default function AddItemScreen() {
  const addItem = useItemStore((s) => s.addItem);

  const { form, handleSubmit, canSubmit } = useItemForm({
    onSubmit: async (data) => {
      await addItem(data);
      router.back();
    },
  });

  return (
    <View className="flex-1 bg-paper">
      <ScreenHeader
        title="Add Item"
        left={<HeaderCancelButton onPress={() => router.back()} />}
        right={
          <HeaderSaveButton onPress={handleSubmit} disabled={!canSubmit} />
        }
      />
      <View className="p-md">
        <ItemForm control={form.control} />
      </View>
    </View>
  );
}
```

## TextInput Props

The `TextInput` component from `@/components/ui` handles `Controller` integration:

```tsx
<TextInput
  label="Email" // Label shown above input
  name="email" // Field name in form
  control={form.control} // From useForm
  placeholder="..." // Placeholder text
  testID="email-input" // For Maestro tests
  keyboardType="email-address" // Optional keyboard type
/>
```

## Checklist

- [ ] Schema in `db/[domain].ts` with Zod validation
- [ ] Export from `db/schema.ts`
- [ ] Hook in `hooks/use[Name]Form.ts`
- [ ] Component in `components/[Name]Form.tsx`
- [ ] Screen uses hook and component
- [ ] `testID` on all inputs for Maestro tests
