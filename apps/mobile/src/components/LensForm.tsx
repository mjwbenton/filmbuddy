import { View } from "react-native";
import { UseFormReturn, useWatch, Controller } from "react-hook-form";
import { LensForm as LensFormType } from "@/db/schema";
import { TextInput, SectionHeader, ErrorMessage } from "./ui";
import { ApertureModeSelector } from "./ApertureModeSelector";
import { AperturePicker } from "./AperturePicker";
import { StopIncrementSelector } from "./StopIncrementSelector";
import { AperturePreview } from "./AperturePreview";
import { CustomApertureList } from "./CustomApertureList";
import {
  generateApertureSequence,
  nearestStandardStop,
  formatAperture,
} from "@/lib/aperture";

interface LensFormProps {
  form: UseFormReturn<LensFormType>;
  disabled?: boolean;
}

export function LensForm({ form, disabled }: LensFormProps) {
  const { control, formState } = form;

  // Watch aperture fields for preview calculation
  const apertureMode = useWatch({ control, name: "apertureMode" });
  const maxAperture = useWatch({ control, name: "maxAperture" });
  const minAperture = useWatch({ control, name: "minAperture" });
  const stopIncrement = useWatch({ control, name: "stopIncrement" });
  const customApertures = useWatch({ control, name: "customApertures" });

  // Generate preview apertures for standard mode
  const previewApertures =
    apertureMode === "standard"
      ? generateApertureSequence(maxAperture, minAperture, stopIncrement)
      : customApertures;

  // Generate note for non-standard max aperture
  const nearestMax = nearestStandardStop(maxAperture, stopIncrement);
  const isNonStandard = Math.abs(maxAperture - nearestMax) > 0.01;
  const previewNote =
    apertureMode === "standard" && isNonStandard
      ? `Increments from ${formatAperture(nearestMax)} (nearest ${stopIncrement} stop to ${formatAperture(maxAperture)})`
      : undefined;

  // Get errors
  const minApertureError = formState.errors.minAperture?.message;
  const customAperturesError = formState.errors.customApertures?.message;

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

      <Controller
        control={control}
        name="apertureMode"
        render={({ field: { value, onChange } }) => (
          <View className="mb-md">
            <ApertureModeSelector
              value={value}
              onChange={onChange}
              disabled={disabled}
            />
          </View>
        )}
      />

      {apertureMode === "standard" ? (
        <>
          <Controller
            control={control}
            name="maxAperture"
            render={({ field: { value, onChange } }) => (
              <AperturePicker
                label="Maximum Aperture"
                value={value}
                onChange={onChange}
                testID="max-aperture-picker"
                disabled={disabled}
              />
            )}
          />

          <Controller
            control={control}
            name="stopIncrement"
            render={({ field: { value, onChange } }) => (
              <StopIncrementSelector
                value={value}
                onChange={onChange}
                disabled={disabled}
              />
            )}
          />

          <Controller
            control={control}
            name="minAperture"
            render={({ field: { value, onChange } }) => (
              <AperturePicker
                label="Minimum Aperture"
                value={value}
                onChange={onChange}
                testID="min-aperture-picker"
                disabled={disabled}
                hasError={!!minApertureError}
              />
            )}
          />

          {minApertureError && (
            <View testID="aperture-error" className="mb-md">
              <ErrorMessage message={minApertureError} />
            </View>
          )}

          <AperturePreview apertures={previewApertures} note={previewNote} />
        </>
      ) : (
        <Controller
          control={control}
          name="customApertures"
          render={({ field: { value, onChange } }) => (
            <CustomApertureList
              value={value}
              onChange={onChange}
              disabled={disabled}
              hasError={!!customAperturesError}
              errorMessage={customAperturesError}
            />
          )}
        />
      )}
    </View>
  );
}
