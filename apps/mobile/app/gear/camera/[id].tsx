import { View, Text, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useGearStore } from "@/stores/gearStore";
import { useCameraForm } from "@/hooks/useCameraForm";
import { CameraForm } from "@/components/CameraForm";
import { handleError } from "@/lib/handleError";
import { CameraForm as CameraFormType } from "@/db/schema";
import {
  ScreenHeader,
  HeaderCancelButton,
  HeaderSaveButton,
} from "@/components/ui";

export default function EditCameraScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCameraById, updateCamera, deleteCamera } = useGearStore();

  const camera = id ? getCameraById(id) : undefined;

  const { form, handleSubmit, isSubmitting, canSubmit } = useCameraForm({
    defaultValues: { name: camera?.name ?? "" },
    onSubmit: async (data: CameraFormType) => {
      if (!id) return;
      try {
        await updateCamera(id, data.name);
        router.back();
      } catch (err) {
        handleError(err, "Failed to save camera. Please try again.");
      }
    },
  });

  if (!camera || !id) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-paper">
        <Text className="text-body text-stone">Camera not found</Text>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Delete Camera",
      "Are you sure you want to delete this camera?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCamera(id);
              router.back();
            } catch (err) {
              handleError(err, "Failed to delete camera. Please try again.");
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-paper" edges={["top"]}>
      <ScreenHeader
        title="Edit Camera"
        left={<HeaderCancelButton onPress={() => router.back()} />}
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

      <View className="px-md pb-lg">
        <Pressable
          onPress={handleDelete}
          testID="delete-button"
          accessibilityRole="button"
          accessibilityLabel="Delete camera"
          className="min-h-touch items-center justify-center rounded-md border border-error"
        >
          <Text className="text-body font-medium text-error">
            Delete Camera
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
