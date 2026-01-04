import { useState } from "react";
import { View, Pressable } from "react-native";
import { Text } from "./ui";
import { AperturePicker } from "./AperturePicker";
import { StopIncrementSelector } from "./StopIncrementSelector";
import { generateApertureSequence, type StopIncrement } from "@/lib/aperture";

interface ApertureGeneratorProps {
  onGenerate: (apertures: number[]) => void;
  disabled?: boolean;
}

export function ApertureGenerator({
  onGenerate,
  disabled,
}: ApertureGeneratorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [maxAperture, setMaxAperture] = useState(2.8);
  const [minAperture, setMinAperture] = useState(16);
  const [stopIncrement, setStopIncrement] = useState<StopIncrement>("whole");

  const handleGenerate = () => {
    const apertures = generateApertureSequence(
      maxAperture,
      minAperture,
      stopIncrement,
    );
    onGenerate(apertures);
    setIsExpanded(false);
  };

  // Validation: min must be narrower (larger f-number) than max
  const isValid = maxAperture < minAperture;

  return (
    <View className="mb-md">
      <Pressable
        testID="aperture-generator-toggle"
        onPress={() => !disabled && setIsExpanded(!isExpanded)}
        disabled={disabled}
        className={`flex-row items-center justify-between rounded-md border border-fog bg-cloud px-md py-sm ${
          disabled ? "opacity-50" : ""
        }`}
      >
        <Text variant="body" color="stone">
          Generate from min/max aperture
        </Text>
        <Text variant="body" color="stone">
          {isExpanded ? "▲" : "▼"}
        </Text>
      </Pressable>

      {isExpanded && (
        <View className="mt-sm rounded-md border border-fog bg-white p-md">
          <AperturePicker
            label="Maximum Aperture (widest)"
            value={maxAperture}
            onChange={setMaxAperture}
            testID="generator-max-aperture"
            disabled={disabled}
          />

          <StopIncrementSelector
            value={stopIncrement}
            onChange={setStopIncrement}
            disabled={disabled}
          />

          <AperturePicker
            label="Minimum Aperture (narrowest)"
            value={minAperture}
            onChange={setMinAperture}
            testID="generator-min-aperture"
            disabled={disabled}
            hasError={!isValid}
          />

          {!isValid && (
            <Text variant="small" className="mb-sm text-error">
              Minimum aperture must be narrower than maximum
            </Text>
          )}

          <Pressable
            testID="generate-apertures-button"
            onPress={handleGenerate}
            disabled={disabled || !isValid}
            className={`items-center rounded-md py-sm ${
              isValid ? "bg-slate-blue" : "bg-fog"
            } ${disabled ? "opacity-50" : ""}`}
          >
            <Text
              variant="body"
              className={isValid ? "text-white font-semibold" : "text-stone"}
            >
              Generate
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
