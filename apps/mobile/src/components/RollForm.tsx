import { Text, TextInput, View } from "react-native";
import { ISOPicker } from "./ISOPicker";
import { RollFormData, ValidationErrors } from "@/lib/roll-validation";
import { ISOValue } from "@/types/roll";
import { colors } from "@/theme/colors";

interface RollFormProps {
  data: RollFormData;
  errors: ValidationErrors;
  onChange: (
    field: keyof RollFormData,
    value: string | ISOValue | null,
  ) => void;
  disabled?: boolean;
}

export function RollForm({ data, errors, onChange, disabled }: RollFormProps) {
  return (
    <View className="gap-md">
      <View>
        <Text className="mb-xs text-caption font-medium text-ink">
          Film Stock
        </Text>
        <TextInput
          value={data.filmStock}
          onChangeText={(text) => onChange("filmStock", text)}
          placeholder="e.g., Portra 400"
          editable={!disabled}
          testID="film-stock-input"
          className={`min-h-[44px] rounded-md border bg-white px-md py-sm text-body ${
            errors.filmStock ? "border-error" : "border-fog"
          } ${disabled ? "opacity-50" : ""}`}
          placeholderTextColor={colors.stone}
        />
        {errors.filmStock && (
          <Text testID="film-stock-error" className="mt-xs text-sm text-error">
            {errors.filmStock}
          </Text>
        )}
      </View>

      <View>
        <Text className="mb-xs text-caption font-medium text-ink">ISO</Text>
        {disabled ? (
          <View className="min-h-[44px] justify-center rounded-md border border-fog bg-white px-md py-sm opacity-50">
            <Text className="text-body text-ink">{data.iso}</Text>
          </View>
        ) : (
          <ISOPicker
            value={data.iso}
            onChange={(iso) => onChange("iso", iso)}
            hasError={!!errors.iso}
            testID="iso-picker"
          />
        )}
        {errors.iso && (
          <Text testID="iso-error" className="mt-xs text-sm text-error">
            {errors.iso}
          </Text>
        )}
      </View>

      <View>
        <Text className="mb-xs text-caption font-medium text-ink">Camera</Text>
        <TextInput
          value={data.camera}
          onChangeText={(text) => onChange("camera", text)}
          placeholder="e.g., Leica M6"
          editable={!disabled}
          testID="camera-input"
          className={`min-h-[44px] rounded-md border bg-white px-md py-sm text-body ${
            errors.camera ? "border-error" : "border-fog"
          } ${disabled ? "opacity-50" : ""}`}
          placeholderTextColor={colors.stone}
        />
        {errors.camera && (
          <Text testID="camera-error" className="mt-xs text-sm text-error">
            {errors.camera}
          </Text>
        )}
      </View>
    </View>
  );
}
