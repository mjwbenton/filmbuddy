import { Text, TextInput, View } from "react-native";
import { Controller, UseFormReturn } from "react-hook-form";
import { LensForm as LensFormType } from "@/db/schema";
import { colors } from "@/theme/colors";

interface LensFormProps {
  form: UseFormReturn<LensFormType>;
  disabled?: boolean;
}

export function LensForm({ form, disabled }: LensFormProps) {
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
            placeholder="e.g., Summicron 50mm f/2"
            editable={!disabled}
            autoFocus
            testID="lens-name-input"
            className={`min-h-touch rounded-md border bg-white px-md py-sm text-body ${
              errors.name ? "border-error" : "border-fog"
            } ${disabled ? "opacity-50" : ""}`}
            placeholderTextColor={colors.stone}
          />
        )}
      />
      {errors.name && (
        <Text testID="lens-name-error" className="mt-xs text-sm text-error">
          {errors.name.message}
        </Text>
      )}
    </View>
  );
}
