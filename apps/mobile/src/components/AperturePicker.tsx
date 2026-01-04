import { useState } from "react";
import { Pressable, View, ScrollView } from "react-native";
import { Text, Label } from "./ui";
import {
  formatAperture,
  getAllApertureOptions,
  isWholeStop,
} from "@/lib/aperture";

interface AperturePickerProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  testID: string;
  disabled?: boolean;
  hasError?: boolean;
}

const APERTURE_OPTIONS = getAllApertureOptions();

export function AperturePicker({
  label,
  value,
  onChange,
  testID,
  disabled,
  hasError,
}: AperturePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (aperture: number) => {
    onChange(aperture);
    setIsOpen(false);
  };

  return (
    <View className="mb-md">
      <Label>{label}</Label>
      <Pressable
        testID={testID}
        onPress={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`min-h-touch flex-row items-center justify-between rounded-md border bg-white px-md py-sm ${
          hasError ? "border-error" : "border-fog"
        } ${disabled ? "opacity-50" : ""}`}
      >
        <Text variant="body">{formatAperture(value)}</Text>
        <Text variant="body" color="stone">
          {isOpen ? "▲" : "▼"}
        </Text>
      </Pressable>

      {isOpen && (
        <View className="mt-xs max-h-64 rounded-md border border-fog bg-white">
          <ScrollView>
            {APERTURE_OPTIONS.map((aperture) => (
              <Pressable
                key={aperture}
                onPress={() => handleSelect(aperture)}
                testID={`aperture-option-${formatAperture(aperture)}`}
                className={`min-h-touch flex-row items-center justify-between border-b border-fog px-md py-sm ${
                  value === aperture ? "bg-cloud" : ""
                }`}
              >
                <Text
                  variant="body"
                  className={isWholeStop(aperture) ? "font-semibold" : ""}
                >
                  {formatAperture(aperture)}
                </Text>
                {value === aperture && (
                  <Text variant="body" color="stone">
                    ✓
                  </Text>
                )}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
