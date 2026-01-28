import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useRollStore } from "@/stores/rollStore";
import { RollForm } from "@/components/RollForm";
import { useRollForm } from "@/hooks/useRollForm";
import { handleError } from "@/lib/handleError";
import {
  HeaderCloseButton,
  HeaderSaveButton,
  ScreenHeader,
} from "@/components/ui/ScreenHeader";

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
      } catch (error) {
        handleError(error, "Failed to add roll. Please try again.");
      }
    },
  });

  return (
    <SafeAreaView className="flex-1 bg-paper" edges={["top"]}>
      <ScreenHeader
        title="Add Roll"
        left={<HeaderCloseButton onPress={() => router.back()} />}
        right={
          <HeaderSaveButton
            onPress={handleSubmit}
            disabled={!canSubmit || isSubmitting}
          />
        }
      />

      <ScrollView className="flex-1 px-md py-md">
        <RollForm form={form} />
      </ScrollView>
    </SafeAreaView>
  );
}
