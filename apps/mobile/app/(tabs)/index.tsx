import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-paper">
      <View className="flex-1 items-center justify-center p-md">
        <Text className="text-display font-heading text-ink mb-sm">
          FilmBuddy
        </Text>
        <Text className="text-body font-body text-stone">
          Your film photography companion
        </Text>
      </View>
    </SafeAreaView>
  );
}
