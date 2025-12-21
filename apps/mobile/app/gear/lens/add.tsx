import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useGearStore } from "@/stores/gearStore";
import { useLensForm } from "@/hooks/useLensForm";
import { LensForm } from "@/components/LensForm";
import { handleError } from "@/lib/handleError";
import { LensForm as LensFormType } from "@/db/schema";

export default function AddLensScreen() {
  const router = useRouter();
  const { addLens } = useGearStore();

  const { form, handleSubmit, isSubmitting, canSubmit } = useLensForm({
    onSubmit: async (data: LensFormType) => {
      try {
        await addLens(data.name);
        router.back();
      } catch (err) {
        handleError(err, "Failed to add lens. Please try again.");
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
          accessibilityRole="button"
          accessibilityLabel="Cancel"
          className="min-h-touch min-w-touch items-center justify-center"
        >
          <Text className="text-body text-slate-blue">Cancel</Text>
        </Pressable>
        <Text className="font-heading text-subheading font-medium text-ink">
          Add Lens
        </Text>
        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          testID="save-button"
          accessibilityRole="button"
          accessibilityLabel="Save"
          className="min-h-touch min-w-touch items-center justify-center"
        >
          <Text
            className={`text-body font-medium ${canSubmit && !isSubmitting ? "text-slate-blue" : "text-stone"}`}
          >
            Save
          </Text>
        </Pressable>
      </View>

      <View className="flex-1 px-md pt-lg">
        <LensForm form={form} disabled={isSubmitting} />
      </View>
    </SafeAreaView>
  );
}
