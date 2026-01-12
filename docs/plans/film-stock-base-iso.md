# Plan: Film Stock Base ISO

Spec: [../specs/film-stock-base-iso.md](../specs/film-stock-base-iso.md)

## Summary

Add a `baseIso` field to film stocks that stores the ISO rating and becomes the default when creating rolls. The ISO defaults to 400 for new film stocks and existing data via migration.

## Tasks

### 1. Data Layer

- [ ] **Add baseIso field to schema**

  ```typescript
  // apps/mobile/src/db/filmStock.ts
  export const filmStocks = sqliteTable("film_stocks", {
    id: text("id").primaryKey(),
    name: text("name").notNull().unique(),
    baseIso: integer("base_iso").notNull().default(400),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  });
  ```

- [ ] **Update Zod form schema to include baseIso**

  ```typescript
  // apps/mobile/src/db/filmStock.ts
  export const filmStockFormSchema = filmStockInsertSchema.pick({
    name: true,
    baseIso: true,
  });
  ```

- [ ] **Generate migration for baseIso column**

  After updating the schema, run from `apps/mobile`:

  ```bash
  npx drizzle-kit generate
  ```

  This creates a migration file like `drizzle/0003_xxxx.sql`:

  ```sql
  ALTER TABLE `film_stocks` ADD `base_iso` integer DEFAULT 400 NOT NULL;
  ```

- [ ] **Update store methods to handle baseIso**

  ```typescript
  // apps/mobile/src/stores/gearStore.ts

  // Change method signature from (name: string) to (data: FilmStockForm)
  addFilmStock: async (data: FilmStockForm) => {
    const trimmedName = data.name.trim();
    // ... duplicate check ...
    await db.insert(filmStocks).values({
      id: randomUUID(),
      name: trimmedName,
      baseIso: data.baseIso,
      createdAt: new Date(),
    });
    await get().loadGear();
  },

  updateFilmStock: async (id: string, data: FilmStockForm) => {
    const trimmedName = data.name.trim();
    // ... duplicate check ...
    await db
      .update(filmStocks)
      .set({ name: trimmedName, baseIso: data.baseIso })
      .where(eq(filmStocks.id, id));
    await get().loadGear();
  },
  ```

### 2. Unit Tests

- [ ] **Add film stock baseIso tests** - `apps/mobile/src/stores/gearStore.test.ts`

  ```typescript
  // Helper for creating film stock form data
  function createFilmStockData(
    name: string,
    overrides?: Partial<FilmStockForm>,
  ): FilmStockForm {
    return {
      name,
      baseIso: 400,
      ...overrides,
    };
  }

  describe("filmStocks", () => {
    describe("addFilmStock", () => {
      it("creates a film stock with baseIso", async () => {
        const { useGearStore } = await import("./gearStore");

        await useGearStore
          .getState()
          .addFilmStock(
            createFilmStockData("Ilford Delta 3200", { baseIso: 3200 }),
          );

        const { filmStocks } = useGearStore.getState();
        expect(filmStocks[0].baseIso).toBe(3200);
      });
    });

    describe("updateFilmStock", () => {
      it("updates film stock baseIso", async () => {
        const { useGearStore } = await import("./gearStore");

        await useGearStore
          .getState()
          .addFilmStock(createFilmStockData("Kodak Portra 400"));
        await useGearStore
          .getState()
          .updateFilmStock(
            "test-id-1",
            createFilmStockData("Kodak Portra 400", { baseIso: 800 }),
          );

        const { filmStocks } = useGearStore.getState();
        expect(filmStocks[0].baseIso).toBe(800);
      });
    });
  });
  ```

### 3. Form Hook

- [ ] **Update useFilmStockForm with baseIso default**

  ```typescript
  // apps/mobile/src/hooks/useFilmStockForm.ts
  export function useFilmStockForm({
    defaultValues,
    onSubmit,
  }: UseFilmStockFormOptions): UseFilmStockFormReturn {
    const form = useForm<FilmStockForm>({
      resolver: zodResolver(filmStockFormSchema),
      defaultValues: {
        name: "",
        baseIso: 400, // Default ISO for new film stocks
        ...defaultValues,
      },
      mode: "onSubmit",
    });
    // ... rest unchanged
  }
  ```

### 4. Components

- [ ] **Add ISOPicker to FilmStockForm**

  ```typescript
  // apps/mobile/src/components/FilmStockForm.tsx
  import { Controller, UseFormReturn } from "react-hook-form";
  import { FilmStockForm as FilmStockFormType } from "@/db/schema";
  import { TextInput, Text } from "./ui";
  import { ISOPicker } from "./ISOPicker";

  export function FilmStockForm({ form, disabled }: FilmStockFormProps) {
    return (
      <View className="gap-lg">
        <TextInput
          label="Name"
          name="name"
          control={form.control}
          placeholder="e.g., Kodak Portra 400"
          disabled={disabled}
          autoFocus
          testID="film-stock-name-input"
        />

        <View>
          <Text variant="label" className="mb-xs">
            Base ISO
          </Text>
          <Controller
            control={form.control}
            name="baseIso"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <ISOPicker
                value={value}
                onChange={onChange}
                hasError={!!error}
                testID="film-stock-iso-picker"
              />
            )}
          />
        </View>
      </View>
    );
  }
  ```

- [ ] **Create FilmStockCard component with ISO display**

  ```typescript
  // apps/mobile/src/components/FilmStockCard.tsx
  import { Card, Text } from "./ui";

  interface FilmStockCardProps {
    name: string;
    baseIso: number;
    onPress: () => void;
    testID?: string;
  }

  export function FilmStockCard({
    name,
    baseIso,
    onPress,
    testID,
  }: FilmStockCardProps) {
    return (
      <Card onPress={onPress} testID={testID} accessibilityLabel={name}>
        <Text variant="subheading">{name}</Text>
        <Text variant="caption" className="text-stone">
          ISO {baseIso}
        </Text>
      </Card>
    );
  }
  ```

### 5. Screens

- [ ] **Update gear screen to use FilmStockCard**

  ```typescript
  // apps/mobile/app/(tabs)/gear.tsx
  // Replace GearCard with FilmStockCard for film stocks
  import { FilmStockCard } from "@/components/FilmStockCard";

  // In the film stocks section:
  {filmStocks.map((stock) => (
    <FilmStockCard
      key={stock.id}
      name={stock.name}
      baseIso={stock.baseIso}
      onPress={() => router.push(`/gear/film-stock/${stock.id}`)}
    />
  ))}
  ```

- [ ] **Update add screen to pass form data**

  ```typescript
  // apps/mobile/app/gear/film-stock/add.tsx
  const { form, handleSubmit, isSubmitting, canSubmit } = useFilmStockForm({
    onSubmit: async (data: FilmStockFormType) => {
      try {
        await addFilmStock(data); // Pass full data object
        router.back();
      } catch (err) {
        handleError(err, "Failed to add film stock. Please try again.");
      }
    },
  });
  ```

- [ ] **Update edit screen to include baseIso in defaults and submission**

  ```typescript
  // apps/mobile/app/gear/film-stock/[id].tsx
  const { form, handleSubmit, isSubmitting, canSubmit } = useFilmStockForm({
    defaultValues: {
      name: filmStock?.name,
      baseIso: filmStock?.baseIso,
    },
    onSubmit: async (data: FilmStockFormType) => {
      if (!id) return;
      try {
        await updateFilmStock(id, data); // Pass full data object
        router.back();
      } catch (err) {
        handleError(err, "Failed to save film stock. Please try again.");
      }
    },
  });
  ```

### 6. E2E Tests

- [ ] **Update gear-film-stocks.yaml with ISO interactions**

  ```yaml
  # apps/mobile/e2e/flows/gear-film-stocks.yaml
  appId: tech.mattb.filmbuddy
  ---
  # Setup: Launch app and navigate to Gear tab
  - runFlow:
      file: ../helpers/launch.yaml
  - tapOn: "gear-tab"

  # =============================================================================
  # Scenario: Add a film stock with base ISO
  # Scenario: Default ISO for new film stocks (ISO picker defaults to 400)
  # =============================================================================
  # GIVEN I'm on the Gear screen
  # WHEN I tap to add a film stock
  - tapOn:
      id: "add-film-stock-button"
      retryTapIfNoChange: true

  # Verify sheet is open
  - assertVisible: "Add Film Stock"

  # THEN the base ISO defaults to 400
  - assertVisible:
      id: "film-stock-iso-picker"
  - assertVisible: "400"

  # WHEN I enter a name, select a base ISO, and save
  - runFlow:
      file: ../helpers/input-text.yaml
      env:
        INPUT_ID: "film-stock-name-input"
        TEXT: "Kodak Portra 800"

  # Select ISO 800
  - tapOn:
      id: "film-stock-iso-picker"
  - tapOn:
      id: "iso-option-800"

  - tapOn:
      id: "save-button"

  # THEN the film stock appears in my list with the selected base ISO
  - assertVisible: "Kodak Portra 800"
  - assertVisible: "ISO 800"

  # =============================================================================
  # Scenario: Edit a film stock's base ISO
  # Scenario: Display base ISO on film stock card
  # =============================================================================
  # GIVEN I have a film stock in my gear library
  - tapOn: "Kodak Portra 800"

  # Verify edit sheet is open
  - assertVisible: "Edit Film Stock"
  - assertVisible:
      id: "save-button"
  - assertVisible:
      id: "delete-button"

  # Verify current ISO is displayed
  - assertVisible: "800"

  # WHEN I tap it, change the base ISO, and save
  - tapOn:
      id: "film-stock-iso-picker"
  - tapOn:
      id: "iso-option-400"
  - tapOn:
      id: "save-button"

  # THEN the film stock is updated with the new base ISO
  - assertVisible: "Kodak Portra 800"
  - assertVisible: "ISO 400"

  # =============================================================================
  # Scenario: Delete a film stock
  # =============================================================================
  # GIVEN I have a film stock in my gear library
  - tapOn: "Kodak Portra 800"

  # Verify edit sheet with delete button
  - assertVisible: "Edit Film Stock"
  - assertVisible:
      id: "delete-button"

  # WHEN I delete it
  - tapOn:
      id: "delete-button"
  - tapOn: "Delete"

  # THEN it is permanently removed from my library
  - extendedWaitUntil:
      notVisible: "Kodak Portra 800"
      timeout: 5000
  ```

- [ ] **Update create-film-stock.yaml helper with optional ISO**

  ```yaml
  # apps/mobile/e2e/helpers/create-film-stock.yaml
  appId: tech.mattb.filmbuddy
  env:
    FILM_STOCK_NAME: ${FILM_STOCK_NAME || "Kodak Portra 400"}
    BASE_ISO: ${BASE_ISO || "400"}
  ---
  # Helper: Create a film stock with configurable name and ISO
  # Parameters:
  #   FILM_STOCK_NAME: Film stock name (default: "Kodak Portra 400")
  #   BASE_ISO: Base ISO value (default: "400")
  - tapOn:
      id: "add-film-stock-button"
      retryTapIfNoChange: true
  - runFlow:
      file: ./input-text.yaml
      env:
        INPUT_ID: "film-stock-name-input"
        TEXT: ${FILM_STOCK_NAME}
  - tapOn:
      id: "film-stock-iso-picker"
  - tapOn:
      id: "iso-option-${BASE_ISO}"
  - tapOn:
      id: "save-button"
  ```

## Required testIDs

| Element        | testID                  | Component      |
| -------------- | ----------------------- | -------------- |
| ISO picker     | `film-stock-iso-picker` | FilmStockForm  |
| ISO option 400 | `iso-option-400`        | ISOPicker      |
| ISO option 800 | `iso-option-800`        | ISOPicker      |
| Add button     | `add-film-stock-button` | GearScreen     |
| Name input     | `film-stock-name-input` | FilmStockForm  |
| Save button    | `save-button`           | Screen headers |
| Delete button  | `delete-button`         | Edit screen    |

## Codebase Patterns

- **Database migrations**: Use `drizzle-kit generate` to create migration files in `apps/mobile/drizzle/`
- **Default values**: Schema defaults (like `default(400)`) apply to DB and are mirrored in form hooks
- **Form hooks**: Follow `useFilmStockForm` pattern with `react-hook-form` + Zod resolver
- **Store methods**: Film stock store methods will change from `(name: string)` to `(data: FilmStockForm)` to match lens pattern
- **Component cards**: Create specialized `FilmStockCard` vs generic `GearCard` to show ISO subtitle
- **ISOPicker**: Existing component with predefined values `[25, 50, 80, 100, 160, 200, 400, 800, 1600, 3200]` and testIDs `iso-option-{value}`
