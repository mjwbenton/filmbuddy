import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useGearStore } from "@/stores/gearStore";
import { useCameraForm } from "@/hooks/useCameraForm";
import { CameraForm } from "@/components/CameraForm";
import { handleError } from "@/lib/handleError";
import { CameraForm as CameraFormType } from "@/db/camera";
import {
  HeaderCloseButton,
  HeaderSaveButton,
  ScreenHeader,
} from "@/components/ui/ScreenHeader";

export default function AddCameraScreen() {
  const router = useRouter();
  const { addCamera } = useGearStore();

  const { form, handleSubmit, isSubmitting, canSubmit } = useCameraForm({
    onSubmit: async (data: CameraFormType) => {
      try {
        await addCamera(data.name);
        router.back();
      } catch (err) {
        handleError(err, "Failed to add camera. Please try again.");
      }
    },
  });

  return (
    <SafeAreaView className="flex-1 bg-paper" edges={["top"]}>
      <ScreenHeader
        title="Add Camera"
        left={<HeaderCloseButton onPress={() => router.back()} />}
        right={
          <HeaderSaveButton
            onPress={handleSubmit}
            disabled={!canSubmit || isSubmitting}
          />
        }
      />

      <View className="flex-1 px-md pt-lg">
        <CameraForm form={form} disabled={isSubmitting} />
      </View>
    </SafeAreaView>
  );
}
