import { View, Pressable } from "react-native";

interface CardProps {
  active?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
  testID?: string;
  accessibilityLabel?: string;
}

export function Card({
  active = false,
  onPress,
  children,
  testID,
  accessibilityLabel,
}: CardProps) {
  const baseStyles = `mb-sm rounded-md bg-cloud p-md shadow-sm ${
    active ? "border-l-[3px] border-l-amber" : ""
  }`;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        className={baseStyles}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      className={baseStyles}
    >
      {children}
    </View>
  );
}
