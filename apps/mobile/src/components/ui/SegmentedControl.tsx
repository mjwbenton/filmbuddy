import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "./Text";
import { colors } from "@/theme/colors";

interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
  testID?: string;
}

interface SegmentedControlProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: readonly SegmentedControlOption<T>[];
  disabled?: boolean;
}

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  disabled,
}: SegmentedControlProps<T>) {
  return (
    <View className="flex-row gap-sm">
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <Pressable
            key={option.value}
            testID={option.testID}
            onPress={() => onChange(option.value)}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected, disabled }}
            accessibilityLabel={option.label}
            className={`min-h-touch flex-1 flex-row items-center justify-center gap-xs rounded-sm border bg-white py-sm ${
              isSelected ? "border-slate-blue" : "border-fog"
            } ${disabled ? "opacity-50" : ""}`}
          >
            {isSelected && (
              <Ionicons name="checkmark" size={18} color={colors.slateBlue} />
            )}
            <Text variant="body">{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
