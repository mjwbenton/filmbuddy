import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useGearStore } from "@/stores/gearStore";
import { useFilmStockForm } from "@/hooks/useFilmStockForm";
import { FilmStockForm } from "@/components/FilmStockForm";
import { handleError } from "@/lib/handleError";
import { FilmStockForm as FilmStockFormType } from "@/db/schema";
import {
  ScreenHeader,
  HeaderCancelButton,
  HeaderSaveButton,
} from "@/components/ui";

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

  return (
    <SafeAreaView className="flex-1 bg-paper" edges={["top"]}>
      <ScreenHeader
        title="Add Film Stock"
        left={<HeaderCancelButton onPress={() => router.back()} />}
        right={
          <HeaderSaveButton
            onPress={handleSubmit}
            disabled={!canSubmit || isSubmitting}
          />
        }
      />

      <View className="flex-1 px-md pt-lg">
        <FilmStockForm form={form} disabled={isSubmitting} />
      </View>
    </SafeAreaView>
  );
}
