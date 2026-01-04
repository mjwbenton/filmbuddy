import { View } from "react-native";
import { UseFormReturn, Controller } from "react-hook-form";
import { LensForm as LensFormType } from "@/db/schema";
import { TextInput, SectionHeader } from "./ui";
import { ApertureGenerator } from "./ApertureGenerator";
import { CustomApertureList } from "./CustomApertureList";

interface LensFormProps {
  form: UseFormReturn<LensFormType>;
  disabled?: boolean;
}

export function LensForm({ form, disabled }: LensFormProps) {
  const { control, formState, setValue } = form;

  // Get errors
  const aperturesError = formState.errors.apertures?.message;

  return (
    <View>
      <TextInput
        label="Name"
        name="name"
        control={control}
        placeholder="e.g., Voigtlander 35mm f/1.5 Nokton"
        disabled={disabled}
        autoFocus
        testID="lens-name-input"
      />

      <SectionHeader title="Apertures" />

      <ApertureGenerator
        onGenerate={(apertures) => {
          setValue("apertures", apertures, { shouldValidate: true });
        }}
        disabled={disabled}
      />

      <Controller
        control={control}
        name="apertures"
        render={({ field: { value, onChange } }) => (
          <CustomApertureList
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
