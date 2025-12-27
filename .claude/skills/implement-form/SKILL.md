---
name: implement-form
description: Implement forms with react-hook-form and Zod validation. Use when creating or modifying forms, validation, form hooks, or form inputs.
---

# Forms

Forms use [react-hook-form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation.

## Pattern Overview

1. **Schema** (`db/[domain].ts`): Zod schema from Drizzle table using `drizzle-zod`
2. **Hook** (`hooks/use[Name]Form.ts`): Wraps `useForm` with `zodResolver`
3. **Component** (`components/[Name]Form.tsx`): Presentational form using inputs from `@/components/ui`
4. **Screen** (`app/`): Uses the hook, passes `form` to component

## Step 1: Define Schema

See the **implement-domain** skill for creating the Drizzle table and Zod form schema.

Your domain file should export:

- `itemFormSchema` - Zod schema with `.pick()` for user-editable fields
- `ItemForm` - TypeScript type inferred from the schema

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

Use input components from `@/components/ui` (see **ui-components** skill for available inputs).

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

All form inputs take `name`, `control`, and `testID` props for react-hook-form integration.

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

## Checklist

- [ ] Schema defined (see **implement-domain** skill)
- [ ] Hook in `hooks/use[Name]Form.ts`
- [ ] Component in `components/[Name]Form.tsx`
- [ ] Screen uses hook and component
- [ ] `testID` on all inputs for Maestro tests
