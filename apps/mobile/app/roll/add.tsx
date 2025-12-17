import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useRollStore } from "@/stores/rollStore";
import { RollForm } from "@/components/RollForm";
import { useRollForm } from "@/hooks/useRollForm";

export default function AddRollScreen() {
  const router = useRouter();
  const { addRoll } = useRollStore();

  const { form, handleSubmit, isSubmitting, canSubmit } = useRollForm({
    onSubmit: async (data) => {
      try {
        await addRoll({
          filmStock: data.filmStock,
          iso: data.iso,
          camera: data.camera,
          finishedAt: null,
        });
        router.back();
      } catch {
        Alert.alert("Error", "Failed to add roll. Please try again.");
      }
    },
  });

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-paper" edges={["top"]}>
      <View className="flex-row items-center justify-between border-b border-fog px-md py-sm">
        <Pressable
          onPress={handleCancel}
          testID="cancel-button"
          className="min-h-[44px] min-w-[44px] items-center justify-center"
        >
          <Text className="text-body text-slate-blue">Cancel</Text>
        </Pressable>
        <Text className="font-heading text-subheading font-medium text-ink">
          Add Roll
        </Text>
        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          testID="save-button"
          className="min-h-[44px] min-w-[44px] items-center justify-center"
        >
          <Text
            className={`text-body font-medium ${
              canSubmit && !isSubmitting ? "text-slate-blue" : "text-stone"
            }`}
          >
            Save
          </Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-md py-md">
        <RollForm form={form} />
      </ScrollView>
    </SafeAreaView>
  );
}
