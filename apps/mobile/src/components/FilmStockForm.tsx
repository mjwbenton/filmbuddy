import { View } from "react-native";
import { Controller, UseFormReturn } from "react-hook-form";
import { FilmStockForm as FilmStockFormType } from "@/db/schema";
import { TextInput, Label } from "./ui";
import { ISOPicker } from "./ISOPicker";

interface FilmStockFormProps {
  form: UseFormReturn<FilmStockFormType>;
  disabled?: boolean;
}

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
        <Label>Base ISO</Label>
        <Controller
          control={form.control}
          name="baseIso"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <ISOPicker
              value={value ?? 400}
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
