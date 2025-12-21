import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useGearStore } from "@/stores/gearStore";
import { useFilmStockForm } from "@/hooks/useFilmStockForm";
import { FilmStockForm } from "@/components/FilmStockForm";
import { handleError } from "@/lib/handleError";
import { FilmStockForm as FilmStockFormType } from "@/db/schema";

export default function AddFilmStockScreen() {
  const router = useRouter();
  const { addFilmStock } = useGearStore();

  const { form, handleSubmit, isSubmitting, canSubmit } = useFilmStockForm({
    onSubmit: async (data: FilmStockFormType) => {
      try {
        await addFilmStock(data.name);
        router.back();
      } catch (err) {
        handleError(err, "Failed to add film stock. Please try again.");
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
          Add Film Stock
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
        <FilmStockForm form={form} disabled={isSubmitting} />
      </View>
    </SafeAreaView>
  );
}
