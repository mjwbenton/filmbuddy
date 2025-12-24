import { View } from "react-native";
import { Text } from "./Text";

interface SectionHeaderProps {
  title: string;
  testID?: string;
}

export function SectionHeader({ title, testID }: SectionHeaderProps) {
  return (
    <View className="mb-sm mt-lg" testID={testID}>
      <Text
        variant="caption"
        color="stone"
        className="font-heading-medium uppercase tracking-wider"
      >
        {title}
      </Text>
    </View>
  );
}
