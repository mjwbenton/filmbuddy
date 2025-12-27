import { View, Pressable } from "react-native";
import { Text } from "./Text";

interface ScreenHeaderProps {
  title: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export function ScreenHeader({ title, left, right }: ScreenHeaderProps) {
  return (
    <View className="flex-row items-center justify-between border-b border-fog px-md py-sm">
      <View className="min-h-touch min-w-touch items-center justify-center">
        {left}
      </View>
      <Text variant="subheading">{title}</Text>
      <View className="min-h-touch min-w-touch items-center justify-center">
        {right}
      </View>
    </View>
  );
}

// Convenience components for common header buttons

interface HeaderButtonProps {
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
  children: React.ReactNode;
}

export function HeaderButton({
  onPress,
  disabled = false,
  testID,
  children,
}: HeaderButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessibilityRole="button"
    >
      {children}
    </Pressable>
  );
}

interface HeaderTextButtonProps {
  onPress: () => void;
  testID?: string;
}

export function HeaderCloseButton({
  onPress,
  testID = "close-button",
}: HeaderTextButtonProps) {
  return (
    <HeaderButton onPress={onPress} testID={testID}>
      <Text variant="body" className="text-slate-blue">
        Close
      </Text>
    </HeaderButton>
  );
}

interface HeaderSaveButtonProps {
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
}

export function HeaderSaveButton({
  onPress,
  disabled = false,
  testID = "save-button",
}: HeaderSaveButtonProps) {
  return (
    <HeaderButton onPress={onPress} disabled={disabled} testID={testID}>
      <Text
        variant="body"
        className={`font-medium ${disabled ? "text-stone" : "text-slate-blue"}`}
      >
        Save
      </Text>
    </HeaderButton>
  );
}
