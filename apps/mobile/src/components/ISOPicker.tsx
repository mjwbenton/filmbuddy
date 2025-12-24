import { useState } from "react";
import { Pressable, Text, View } from "react-native";

// Common ISO values for film photography
const ISO_VALUES = [25, 50, 80, 100, 160, 200, 400, 800, 1600, 3200] as const;

interface ISOPickerProps {
  value: number;
  onChange: (iso: number) => void;
  hasError?: boolean;
  testID?: string;
}

export function ISOPicker({
  value,
  onChange,
  hasError,
  testID,
}: ISOPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (iso: number) => {
    onChange(iso);
    setIsOpen(false);
  };

  return (
    <View>
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        testID={testID}
        className={`min-h-touch flex-row items-center justify-between rounded-md border bg-white px-md py-sm ${
          hasError ? "border-error" : "border-fog"
        }`}
      >
        <Text className="text-body text-ink">{value}</Text>
        <Text className="text-stone">{isOpen ? "▲" : "▼"}</Text>
      </Pressable>

      {isOpen && (
        <View className="mt-xs rounded-md border border-fog bg-white">
          {ISO_VALUES.map((item) => (
            <Pressable
              key={item}
              onPress={() => handleSelect(item)}
              testID={`iso-option-${item}`}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`ISO ${item}`}
              className={`min-h-touch flex-row items-center justify-between border-b border-fog px-md py-sm last:border-b-0 ${
                value === item ? "bg-cloud" : ""
              }`}
            >
              <Text className="text-body text-ink">{item}</Text>
              {value === item && <Text className="text-slate-blue">✓</Text>}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
