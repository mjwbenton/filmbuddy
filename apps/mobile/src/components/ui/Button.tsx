import { Pressable } from "react-native";
import { Text } from "./Text";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "primary-destructive"
  | "secondary-destructive";

interface ButtonProps {
  variant?: ButtonVariant;
  disabled?: boolean;
  onPress: () => void;
  children: React.ReactNode;
  testID?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-slate-blue",
  secondary: "border border-slate-blue bg-transparent",
  "primary-destructive": "bg-error",
  "secondary-destructive": "border border-error bg-transparent",
};

const textColors: Record<ButtonVariant, string> = {
  primary: "text-white",
  secondary: "text-slate-blue",
  "primary-destructive": "text-white",
  "secondary-destructive": "text-error",
};

export function Button({
  variant = "primary",
  disabled = false,
  onPress,
  children,
  testID,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessibilityRole="button"
      className={`min-h-touch items-center justify-center rounded-sm px-md ${variantStyles[variant]} ${disabled ? "opacity-50" : ""}`}
    >
      <Text variant="body" className={`font-medium ${textColors[variant]}`}>
        {children}
      </Text>
    </Pressable>
  );
}
