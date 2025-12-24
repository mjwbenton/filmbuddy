import { View } from "react-native";
import { UseFormReturn } from "react-hook-form";
import { FilmStockForm as FilmStockFormType } from "@/db/schema";
import { TextInput } from "./ui";

interface FilmStockFormProps {
  form: UseFormReturn<FilmStockFormType>;
  disabled?: boolean;
}

export function FilmStockForm({ form, disabled }: FilmStockFormProps) {
  return (
    <View>
      <TextInput
        label="Name"
        name="name"
        control={form.control}
        placeholder="e.g., Kodak Portra 400"
        disabled={disabled}
        autoFocus
        testID="film-stock-name-input"
      />
    </View>
  );
}
