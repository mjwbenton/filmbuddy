import { Text, View } from "react-native";

interface SectionHeaderProps {
  title: string;
  testID?: string;
}

export function SectionHeader({ title, testID }: SectionHeaderProps) {
  return (
    <View className="mt-lg mb-sm" testID={testID}>
      <Text className="font-heading text-caption font-medium uppercase tracking-wider text-stone">
        {title}
      </Text>
    </View>
  );
}
