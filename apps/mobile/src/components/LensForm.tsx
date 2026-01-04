import { View } from "react-native";
import { UseFormReturn, Controller } from "react-hook-form";
import { LensForm as LensFormType } from "@/db/schema";
import { TextInput } from "./ui";
import { ApertureList } from "./ApertureList";

interface LensFormProps {
  form: UseFormReturn<LensFormType>;
  disabled?: boolean;
}

export function LensForm({ form, disabled }: LensFormProps) {
  const { control, formState } = form;

  // Get errors
  const aperturesError = formState.errors.apertures?.message;

  return (
    <View className="gap-md">
      <TextInput
        label="Name"
        name="name"
        control={control}
        placeholder="e.g., Voigtlander 35mm f/1.5 Nokton"
        disabled={disabled}
        autoFocus
        testID="lens-name-input"
      />

      <Controller
        control={control}
        name="apertures"
        render={({ field: { value, onChange } }) => (
          <ApertureList
            value={value}
            onChange={onChange}
            disabled={disabled}
            hasError={!!aperturesError}
            errorMessage={aperturesError}
          />
        )}
      />
    </View>
  );
}
