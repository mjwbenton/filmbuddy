import { Text, TextInput, View } from "react-native";
import { Controller, UseFormReturn } from "react-hook-form";
import { ISOPicker } from "./ISOPicker";
import { RollFormData } from "@/schemas/roll";
import { colors } from "@/theme/colors";

interface RollFormProps {
  form: UseFormReturn<RollFormData>;
  disabled?: boolean;
}

export function RollForm({ form, disabled }: RollFormProps) {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <View className="gap-md">
      <View>
        <Text className="mb-xs text-caption font-medium text-ink">
          Film Stock
        </Text>
        <Controller
          control={control}
          name="filmStock"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="e.g., Portra 400"
              editable={!disabled}
              testID="film-stock-input"
              className={`min-h-[44px] rounded-md border bg-white px-md py-sm text-body ${
                errors.filmStock ? "border-error" : "border-fog"
              } ${disabled ? "opacity-50" : ""}`}
              placeholderTextColor={colors.stone}
            />
          )}
        />
        {errors.filmStock && (
          <Text testID="film-stock-error" className="mt-xs text-sm text-error">
            {errors.filmStock.message}
          </Text>
        )}
      </View>

      <View>
        <Text className="mb-xs text-caption font-medium text-ink">ISO</Text>
        <Controller
          control={control}
          name="iso"
          render={({ field: { onChange, value } }) =>
            disabled ? (
              <View className="min-h-[44px] justify-center rounded-md border border-fog bg-white px-md py-sm opacity-50">
                <Text className="text-body text-ink">{value}</Text>
              </View>
            ) : (
              <ISOPicker
                value={value}
                onChange={onChange}
                hasError={!!errors.iso}
                testID="iso-picker"
              />
            )
          }
        />
        {errors.iso && (
          <Text testID="iso-error" className="mt-xs text-sm text-error">
            {errors.iso.message}
          </Text>
        )}
      </View>

      <View>
        <Text className="mb-xs text-caption font-medium text-ink">Camera</Text>
        <Controller
          control={control}
          name="camera"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="e.g., Leica M6"
              editable={!disabled}
              testID="camera-input"
              className={`min-h-[44px] rounded-md border bg-white px-md py-sm text-body ${
                errors.camera ? "border-error" : "border-fog"
              } ${disabled ? "opacity-50" : ""}`}
              placeholderTextColor={colors.stone}
            />
          )}
        />
        {errors.camera && (
          <Text testID="camera-error" className="mt-xs text-sm text-error">
            {errors.camera.message}
          </Text>
        )}
      </View>
    </View>
  );
}
