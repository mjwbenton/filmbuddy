import { View, Pressable } from "react-native";
import { Text, Label } from "./ui";
import type { StopIncrement } from "@/lib/aperture";

interface StopIncrementSelectorProps {
  value: StopIncrement;
  onChange: (increment: StopIncrement) => void;
  disabled?: boolean;
}

const INCREMENTS: { value: StopIncrement; label: string; testID: string }[] = [
  { value: "whole", label: "Whole", testID: "increment-whole" },
  { value: "half", label: "Half", testID: "increment-half" },
  { value: "third", label: "Third", testID: "increment-third" },
];

export function StopIncrementSelector({
  value,
  onChange,
  disabled,
}: StopIncrementSelectorProps) {
  return (
    <View className="mb-md">
      <Label>Stop Increments</Label>
      <View className="flex-row gap-sm">
        {INCREMENTS.map((increment) => (
          <Pressable
            key={increment.value}
            testID={increment.testID}
            onPress={() => onChange(increment.value)}
            disabled={disabled}
            className={`flex-1 items-center rounded-md border-2 py-sm ${
              value === increment.value
                ? "border-slate-blue bg-slate-blue"
                : "border-ink bg-white"
            } ${disabled ? "opacity-50" : ""}`}
          >
            <Text
              variant="body"
              className={value === increment.value ? "text-white" : ""}
            >
              {increment.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
