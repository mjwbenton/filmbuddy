import { useState } from "react";
import { View, Pressable, TextInput as RNTextInput } from "react-native";
import { Text, Label, Button, DisclosureButton, SegmentedControl } from "./ui";
import {
  formatAperture,
  generateApertureSequence,
  validateApertureInput,
  isValidApertureRange,
  type StopIncrement,
} from "@/lib/aperture";
import { colors } from "@/theme/colors";

interface ApertureListProps {
  value: number[];
  onChange: (apertures: number[]) => void;
  disabled?: boolean;
  hasError?: boolean;
  errorMessage?: string;
}

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
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  const [addInput, setAddInput] = useState("");
  const [addError, setAddError] = useState<string | null>(null);

  const [maxApertureInput, setMaxApertureInput] = useState("2.8");
  const [minApertureInput, setMinApertureInput] = useState("16");
  const [maxAperture, setMaxAperture] = useState(2.8);
  const [minAperture, setMinAperture] = useState(16);
  const [maxApertureError, setMaxApertureError] = useState<string | null>(null);
  const [minApertureError, setMinApertureError] = useState<string | null>(null);
  const [stopIncrement, setStopIncrement] = useState<StopIncrement>("whole");

  const handleAdd = (aperture: number) => {
    if (value.includes(aperture)) {
      setAddError("Already added");
      return;
    }
    const newValue = [...value, aperture].sort((a, b) => a - b);
    onChange(newValue);
    setAddInput("");
    setAddError(null);
    setIsAddOpen(false);
  };

  const handleAddInputBlur = () => {
    if (!addInput.trim()) {
      setAddError(null);
      return;
    }
    const result = validateApertureInput(addInput);
    if (!result.valid) {
      setAddError(result.error);
    } else {
      setAddError(null);
    }
  };

  const handleConfirmAdd = () => {
    const result = validateApertureInput(addInput);
    if (!result.valid) {
      setAddError(result.error);
      return;
    }
    handleAdd(result.value!);
  };

  const handleDelete = (aperture: number) => {
    onChange(value.filter((a) => a !== aperture));
  };

  const handleMaxApertureBlur = () => {
    const result = validateApertureInput(maxApertureInput);
    if (result.valid) {
      setMaxAperture(result.value!);
      setMaxApertureError(null);
    } else {
      setMaxApertureError(result.error);
    }
  };

  const handleMinApertureBlur = () => {
    const result = validateApertureInput(minApertureInput);
    if (result.valid) {
      setMinAperture(result.value!);
      setMinApertureError(null);
    } else {
      setMinApertureError(result.error);
    }
  };

  const handleGenerate = () => {
    // Validate both inputs first
    const maxResult = validateApertureInput(maxApertureInput);
    const minResult = validateApertureInput(minApertureInput);

    if (!maxResult.valid) {
      setMaxApertureError(maxResult.error);
      return;
    }
    if (!minResult.valid) {
      setMinApertureError(minResult.error);
      return;
    }

    const apertures = generateApertureSequence(
      maxResult.value!,
      minResult.value!,
      stopIncrement,
    );
    onChange(apertures);
    setIsGeneratorOpen(false);
  };

  const isGeneratorValid =
    !maxApertureError &&
    !minApertureError &&
    isValidApertureRange(maxAperture, minAperture);

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
            className="flex-row items-center gap-xs rounded-full border border-fog bg-white px-sm py-xs"
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
      </View>

      {hasError && errorMessage && (
        <Text variant="small" className="text-error">
          {errorMessage}
        </Text>
      )}

      <DisclosureButton
        label="Add single aperture"
        isOpen={isAddOpen}
        onPress={() => {
          setIsAddOpen(!isAddOpen);
          setIsGeneratorOpen(false);
        }}
        disabled={disabled}
        testID="add-aperture-button"
      />

      {isAddOpen && (
        <View className="flex-row gap-sm items-end">
          <View className="flex-1">
            <Label>Aperture</Label>
            <RNTextInput
              value={addInput}
              onChangeText={setAddInput}
              onBlur={handleAddInputBlur}
              placeholder="e.g. 2.8"
              keyboardType="decimal-pad"
              autoCorrect={false}
              autoCapitalize="none"
              editable={!disabled}
              testID="add-aperture-input"
              className={`min-h-touch rounded-md border bg-white px-md py-sm text-body ${
                addError ? "border-error" : "border-fog"
              } ${disabled ? "opacity-50" : ""}`}
              placeholderTextColor={colors.stone}
            />
            {addError && (
              <Text variant="small" className="text-error mt-xs">
                {addError}
              </Text>
            )}
          </View>
          <Button
            testID="confirm-add-aperture"
            onPress={handleConfirmAdd}
            disabled={disabled}
          >
            Add
          </Button>
        </View>
      )}

      <DisclosureButton
        label="Generate from max/min aperture"
        isOpen={isGeneratorOpen}
        onPress={() => {
          setIsGeneratorOpen(!isGeneratorOpen);
          setIsAddOpen(false);
        }}
        disabled={disabled}
        testID="aperture-generator-toggle"
      />

      {isGeneratorOpen && (
        <View className="rounded-md border border-fog bg-white p-md gap-md">
          <View>
            <Label>Maximum Aperture (widest)</Label>
            <RNTextInput
              value={maxApertureInput}
              onChangeText={setMaxApertureInput}
              onBlur={handleMaxApertureBlur}
              placeholder="e.g. 2.8"
              keyboardType="decimal-pad"
              autoCorrect={false}
              autoCapitalize="none"
              editable={!disabled}
              testID="generator-max-aperture"
              className={`min-h-touch rounded-md border bg-white px-md py-sm text-body ${
                maxApertureError ? "border-error" : "border-fog"
              } ${disabled ? "opacity-50" : ""}`}
              placeholderTextColor={colors.stone}
            />
            {maxApertureError && (
              <Text variant="small" className="text-error mt-xs">
                {maxApertureError}
              </Text>
            )}
          </View>

          <View>
            <Label>Stop Increments</Label>
            <SegmentedControl
              value={stopIncrement}
              onChange={setStopIncrement}
              options={STOP_INCREMENT_OPTIONS}
              disabled={disabled}
            />
          </View>

          <View>
            <Label>Minimum Aperture (narrowest)</Label>
            <RNTextInput
              value={minApertureInput}
              onChangeText={setMinApertureInput}
              onBlur={handleMinApertureBlur}
              placeholder="e.g. 16"
              keyboardType="decimal-pad"
              autoCorrect={false}
              autoCapitalize="none"
              editable={!disabled}
              testID="generator-min-aperture"
              className={`min-h-touch rounded-md border bg-white px-md py-sm text-body ${
                minApertureError ||
                (!minApertureError && !maxApertureError && !isGeneratorValid)
                  ? "border-error"
                  : "border-fog"
              } ${disabled ? "opacity-50" : ""}`}
              placeholderTextColor={colors.stone}
            />
            {minApertureError && (
              <Text variant="small" className="text-error mt-xs">
                {minApertureError}
              </Text>
            )}
            {!minApertureError && !maxApertureError && !isGeneratorValid && (
              <Text variant="small" className="text-error mt-xs">
                Minimum aperture must be narrower than maximum
              </Text>
            )}
          </View>

          <Pressable
            testID="generate-apertures-button"
            onPress={handleGenerate}
            disabled={disabled || !isGeneratorValid}
            className={`min-h-touch items-center justify-center rounded-sm ${
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
