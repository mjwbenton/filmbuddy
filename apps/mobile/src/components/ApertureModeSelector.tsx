import { View, Pressable } from "react-native";
import { Text } from "./ui";
import type { ApertureMode } from "@/db/schema";

interface ApertureModeSelectorProps {
  value: ApertureMode;
  onChange: (mode: ApertureMode) => void;
  disabled?: boolean;
}

export function ApertureModeSelector({
  value,
  onChange,
  disabled,
}: ApertureModeSelectorProps) {
  return (
    <View className="flex-row overflow-hidden rounded-md border-2 border-ink">
      <Pressable
        testID="aperture-mode-standard"
        onPress={() => onChange("standard")}
        disabled={disabled}
        className={`flex-1 items-center py-sm ${
          value === "standard" ? "bg-slate-blue" : "bg-fog"
        }`}
      >
        <Text
          variant="body"
          color={value === "standard" ? undefined : "stone"}
          className={value === "standard" ? "text-white" : ""}
        >
          Standard
        </Text>
      </Pressable>
      <View className="w-0.5 bg-ink" />
      <Pressable
        testID="aperture-mode-custom"
        onPress={() => onChange("custom")}
        disabled={disabled}
        className={`flex-1 items-center py-sm ${
          value === "custom" ? "bg-slate-blue" : "bg-fog"
        }`}
      >
        <Text
          variant="body"
          color={value === "custom" ? undefined : "stone"}
          className={value === "custom" ? "text-white" : ""}
        >
          Custom
        </Text>
      </Pressable>
    </View>
  );
}
