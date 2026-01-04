import { useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { Text, Label } from "./ui";
import { formatAperture, getAllApertureOptions } from "@/lib/aperture";

interface CustomApertureListProps {
  value: number[];
  onChange: (apertures: number[]) => void;
  disabled?: boolean;
  hasError?: boolean;
  errorMessage?: string;
}

const APERTURE_OPTIONS = getAllApertureOptions();

export function CustomApertureList({
  value,
  onChange,
  disabled,
  hasError,
  errorMessage,
}: CustomApertureListProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

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

  // Get apertures that haven't been added yet
  const availableApertures = APERTURE_OPTIONS.filter((a) => !value.includes(a));

  return (
    <View className="mb-md">
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
              hitSlop={8}
            >
              <Text variant="caption" className="text-error font-bold">
                ×
              </Text>
            </Pressable>
          </View>
        ))}
        <Pressable
          testID="add-aperture-button"
          onPress={() => setIsPickerOpen(true)}
          disabled={disabled || availableApertures.length === 0}
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
        <Text variant="small" className="mt-xs text-error">
          {errorMessage}
        </Text>
      )}

      {isPickerOpen && (
        <View className="mt-xs max-h-64 rounded-md border border-fog bg-white">
          <ScrollView>
            {availableApertures.map((aperture) => (
              <Pressable
                key={aperture}
                onPress={() => handleAdd(aperture)}
                className="min-h-touch flex-row items-center border-b border-fog px-md py-sm"
              >
                <Text variant="body">{formatAperture(aperture)}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
