import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "./Text";
import { colors } from "@/theme/colors";

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
      <Ionicons
        name={isOpen ? "chevron-up" : "chevron-down"}
        size={18}
        color={colors.stone}
      />
    </Pressable>
  );
}
