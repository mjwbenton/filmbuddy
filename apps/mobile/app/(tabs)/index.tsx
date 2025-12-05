import { useEffect } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Href } from "expo-router";
import { useRollStore } from "@/stores/rollStore";
import { RollCard } from "@/components/RollCard";
import { SectionHeader } from "@/components/SectionHeader";

export default function RollsScreen() {
  const router = useRouter();
  const { activeRolls, finishedRolls, loadRolls, isLoading } = useRollStore();

  useEffect(() => {
    loadRolls();
  }, [loadRolls]);

  const handleAddRoll = () => {
    router.push("/roll/add" as Href);
  };

  const handleRollPress = (rollId: string) => {
    router.push(`/roll/${rollId}` as Href);
  };

  return (
    <SafeAreaView className="flex-1 bg-paper" edges={["top"]}>
      <View className="flex-row items-center justify-between border-b border-fog px-md py-sm">
        <Text className="font-heading text-display font-semibold text-ink">
          Rolls
        </Text>
        <Pressable
          onPress={handleAddRoll}
          testID="add-roll-button"
          className="min-h-[44px] min-w-[44px] items-center justify-center rounded-md bg-slate-blue"
        >
          <Text className="text-2xl font-medium text-white">+</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-md">
        {isLoading ? (
          <View className="flex-1 items-center justify-center py-xl">
            <Text className="text-body text-stone">Loading...</Text>
          </View>
        ) : activeRolls.length === 0 && finishedRolls.length === 0 ? (
          <View className="flex-1 items-center justify-center py-xl">
            <Text className="text-body text-stone">
              No rolls yet. Tap + to add one.
            </Text>
          </View>
        ) : (
          <>
            {activeRolls.length > 0 && (
              <>
                <SectionHeader title="Active" testID="active-section-header" />
                {activeRolls.map((roll) => (
                  <RollCard
                    key={roll.id}
                    roll={roll}
                    onPress={() => handleRollPress(roll.id)}
                    testID={`roll-card-${roll.id}`}
                  />
                ))}
              </>
            )}

            {finishedRolls.length > 0 && (
              <>
                <SectionHeader
                  title="Finished"
                  testID="finished-section-header"
                />
                {finishedRolls.map((roll) => (
                  <RollCard
                    key={roll.id}
                    roll={roll}
                    onPress={() => handleRollPress(roll.id)}
                    testID={`roll-card-${roll.id}`}
                  />
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
