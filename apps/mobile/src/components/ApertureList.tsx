import { useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { Text, Label, DisclosureButton, SegmentedControl } from "./ui";
import { AperturePicker } from "./AperturePicker";
import {
  formatAperture,
  getAllApertureOptions,
  generateApertureSequence,
  isWholeStop,
  type StopIncrement,
} from "@/lib/aperture";

interface ApertureListProps {
  value: number[];
  onChange: (apertures: number[]) => void;
  disabled?: boolean;
  hasError?: boolean;
  errorMessage?: string;
}

const APERTURE_OPTIONS = getAllApertureOptions();

const STOP_INCREMENT_OPTIONS = [
  { value: "whole", label: "Whole", testID: "increment-whole" },
  { value: "half", label: "Half", testID: "increment-half" },
  { value: "third", label: "Third", testID: "increment-third" },
] as const;

export function ApertureList({
  value,
  onChange,
  disabled,
  hasError,
  errorMessage,
}: ApertureListProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  // Generator state
  const [maxAperture, setMaxAperture] = useState(2.8);
  const [minAperture, setMinAperture] = useState(16);
  const [stopIncrement, setStopIncrement] = useState<StopIncrement>("whole");

  const handleAdd = (aperture: number) => {
    if (!value.includes(aperture)) {
      const newValue = [...value, aperture].sort((a, b) => a - b);
      onChange(newValue);
    }
    setIsPickerOpen(false);
  };

  const handleDelete = (aperture: number) => {
    onChange(value.filter((a) => a !== aperture));
  };

  const handleGenerate = () => {
    const apertures = generateApertureSequence(
      maxAperture,
      minAperture,
      stopIncrement,
    );
    onChange(apertures);
    setIsGeneratorOpen(false);
  };

  // Get apertures that haven't been added yet
  const availableApertures = APERTURE_OPTIONS.filter((a) => !value.includes(a));

  // Validation: min must be narrower (larger f-number) than max
  const isGeneratorValid = maxAperture < minAperture;

  return (
    <View className="gap-sm">
      <Label>Aperture Values</Label>
      <View
        className={`min-h-16 flex-row flex-wrap gap-sm rounded-md border p-sm ${
          hasError ? "border-error bg-cloud" : "border-fog bg-cloud"
        }`}
      >
        {value.map((aperture) => (
          <View
            key={aperture}
            className="flex-row items-center gap-xs rounded-full border border-ink bg-white px-sm py-xs"
          >
            <Text variant="caption">{formatAperture(aperture)}</Text>
            <Pressable
              testID={`delete-aperture-${formatAperture(aperture)}`}
              onPress={() => handleDelete(aperture)}
              disabled={disabled}
              hitSlop={20}
            >
              <Text variant="caption" className="text-error font-bold">
                ×
              </Text>
            </Pressable>
          </View>
        ))}
        <Pressable
          testID="add-aperture-button"
          onPress={() => {
            setIsPickerOpen(!isPickerOpen);
            setIsGeneratorOpen(false);
          }}
          disabled={disabled || availableApertures.length === 0}
          hitSlop={20}
          className={`rounded-full border-2 border-dashed border-stone px-sm py-xs ${
            disabled ? "opacity-50" : ""
          }`}
        >
          <Text variant="caption" color="stone">
            + Add
          </Text>
        </Pressable>
      </View>

      {hasError && errorMessage && (
        <Text variant="small" className="text-error">
          {errorMessage}
        </Text>
      )}

      {isPickerOpen && (
        <View className="max-h-64 rounded-md border border-fog bg-white">
          <ScrollView>
            {availableApertures.map((aperture) => (
              <Pressable
                key={aperture}
                onPress={() => handleAdd(aperture)}
                className="min-h-touch flex-row items-center border-b border-fog px-md py-sm"
              >
                <Text
                  variant="body"
                  className={isWholeStop(aperture) ? "font-semibold" : ""}
                >
                  {formatAperture(aperture)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      <DisclosureButton
        label="Generate from max/min aperture"
        isOpen={isGeneratorOpen}
        onPress={() => {
          setIsGeneratorOpen(!isGeneratorOpen);
          setIsPickerOpen(false);
        }}
        disabled={disabled}
        testID="aperture-generator-toggle"
      />

      {isGeneratorOpen && (
        <View className="rounded-md border border-fog bg-white p-md">
          <AperturePicker
            label="Maximum Aperture (widest)"
            value={maxAperture}
            onChange={setMaxAperture}
            testID="generator-max-aperture"
            disabled={disabled}
          />

          <View className="mb-md">
            <Label>Stop Increments</Label>
            <SegmentedControl
              value={stopIncrement}
              onChange={setStopIncrement}
              options={STOP_INCREMENT_OPTIONS}
              disabled={disabled}
            />
          </View>

          <AperturePicker
            label="Minimum Aperture (narrowest)"
            value={minAperture}
            onChange={setMinAperture}
            testID="generator-min-aperture"
            disabled={disabled}
            hasError={!isGeneratorValid}
          />

          {!isGeneratorValid && (
            <Text variant="small" className="mb-sm text-error">
              Minimum aperture must be narrower than maximum
            </Text>
          )}

          <Pressable
            testID="generate-apertures-button"
            onPress={handleGenerate}
            disabled={disabled || !isGeneratorValid}
            className={`min-h-touch items-center justify-center rounded-md ${
              isGeneratorValid ? "bg-slate-blue" : "bg-fog"
            } ${disabled ? "opacity-50" : ""}`}
          >
            <Text
              variant="body"
              className={
                isGeneratorValid ? "text-white font-semibold" : "text-stone"
              }
            >
              Generate
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
