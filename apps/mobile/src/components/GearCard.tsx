import { Pressable, Text } from "react-native";

interface GearCardProps {
  name: string;
  onPress: () => void;
  testID?: string;
}

export function GearCard({ name, onPress, testID }: GearCardProps) {
  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      accessibilityLabel={name}
      accessibilityRole="button"
      className="mb-sm min-h-[44px] rounded-md bg-cloud p-md shadow-sm"
    >
      <Text className="font-heading text-subheading font-medium text-ink">
        {name}
      </Text>
    </Pressable>
  );
}
