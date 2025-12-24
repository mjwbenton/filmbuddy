import { Text, View } from "react-native";
import { Controller, UseFormReturn } from "react-hook-form";
import { ISOPicker } from "./ISOPicker";
import { RollForm as RollFormType } from "@/db/schema";
import { TextInput, Label, ErrorMessage } from "./ui";

interface RollFormProps {
  form: UseFormReturn<RollFormType>;
  disabled?: boolean;
}

export function RollForm({ form, disabled }: RollFormProps) {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <View className="gap-md">
      <TextInput
        label="Film Stock"
        name="filmStock"
        control={control}
        placeholder="e.g., Portra 400"
        disabled={disabled}
        testID="film-stock-input"
      />

      <View>
        <Label>ISO</Label>
        <Controller
          control={control}
          name="iso"
          render={({ field: { onChange, value } }) =>
            disabled ? (
              <View className="min-h-touch justify-center rounded-md border border-fog bg-white px-md py-sm opacity-50">
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
        <ErrorMessage message={errors.iso?.message} testID="iso-error" />
      </View>

      <TextInput
        label="Camera"
        name="camera"
        control={control}
        placeholder="e.g., Leica M6"
        disabled={disabled}
        testID="camera-input"
      />
    </View>
  );
}
