import { Pressable } from "react-native";
import { Text } from "./Text";

interface DisclosureButtonProps {
  label: string;
  isOpen: boolean;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
  className?: string;
}

export function DisclosureButton({
  label,
  isOpen,
  onPress,
  disabled = false,
  testID,
  className = "",
}: DisclosureButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessibilityRole="button"
      className={`min-h-touch flex-row items-center justify-between ${
        disabled ? "opacity-50" : ""
      } ${className}`}
    >
      <Text variant="body" color="stone">
        {label}
      </Text>
      <Text variant="body" color="stone">
        {isOpen ? "▲" : "▼"}
      </Text>
    </Pressable>
  );
}
