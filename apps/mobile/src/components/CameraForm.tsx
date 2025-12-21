import { Text, TextInput, View } from "react-native";
import { Controller, UseFormReturn } from "react-hook-form";
import { CameraForm as CameraFormType } from "@/db/schema";
import { colors } from "@/theme/colors";

interface CameraFormProps {
  form: UseFormReturn<CameraFormType>;
  disabled?: boolean;
}

export function CameraForm({ form, disabled }: CameraFormProps) {
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
            placeholder="e.g., Leica M6"
            editable={!disabled}
            autoFocus
            testID="camera-name-input"
            className={`min-h-touch rounded-md border bg-white px-md py-sm text-body ${
              errors.name ? "border-error" : "border-fog"
            } ${disabled ? "opacity-50" : ""}`}
            placeholderTextColor={colors.stone}
          />
        )}
      />
      {errors.name && (
        <Text testID="camera-name-error" className="mt-xs text-sm text-error">
          {errors.name.message}
        </Text>
      )}
    </View>
  );
}
