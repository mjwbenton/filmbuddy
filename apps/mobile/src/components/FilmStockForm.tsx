import { Text, TextInput, View } from "react-native";
import { Controller, UseFormReturn } from "react-hook-form";
import { FilmStockForm as FilmStockFormType } from "@/db/schema";
import { colors } from "@/theme/colors";

interface FilmStockFormProps {
  form: UseFormReturn<FilmStockFormType>;
  disabled?: boolean;
}

export function FilmStockForm({ form, disabled }: FilmStockFormProps) {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <View>
      <Text className="mb-xs text-caption font-medium text-ink">Name</Text>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="e.g., Kodak Portra 400"
            editable={!disabled}
            autoFocus
            testID="film-stock-name-input"
            className={`min-h-touch rounded-md border bg-white px-md py-sm text-body ${
              errors.name ? "border-error" : "border-fog"
            } ${disabled ? "opacity-50" : ""}`}
            placeholderTextColor={colors.stone}
          />
        )}
      />
      {errors.name && (
        <Text
          testID="film-stock-name-error"
          className="mt-xs text-sm text-error"
        >
          {errors.name.message}
        </Text>
      )}
    </View>
  );
}
