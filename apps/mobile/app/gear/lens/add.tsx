import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useGearStore } from "@/stores/gearStore";
import { useLensForm } from "@/hooks/useLensForm";
import { LensForm } from "@/components/LensForm";
import { handleError } from "@/lib/handleError";
import { LensForm as LensFormType } from "@/db/schema";
import {
  ScreenHeader,
  HeaderCloseButton,
  HeaderSaveButton,
} from "@/components/ui";

export default function AddLensScreen() {
  const router = useRouter();
  const { addLens } = useGearStore();

  const { form, handleSubmit, isSubmitting, canSubmit } = useLensForm({
    onSubmit: async (data: LensFormType) => {
      try {
        await addLens(data);
        router.back();
      } catch (err) {
        handleError(err, "Failed to add lens. Please try again.");
      }
    },
  });

  return (
    <SafeAreaView className="flex-1 bg-paper" edges={["top"]}>
      <ScreenHeader
        title="Add Lens"
        left={<HeaderCloseButton onPress={() => router.back()} />}
        right={
          <HeaderSaveButton
            onPress={handleSubmit}
            disabled={!canSubmit || isSubmitting}
          />
        }
      />

      <ScrollView className="flex-1 px-md pt-lg">
        <LensForm form={form} disabled={isSubmitting} />
      </ScrollView>
    </SafeAreaView>
  );
}
