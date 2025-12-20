import { useState } from "react";
import { View, Text, Pressable, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useGearStore, DuplicateNameError } from "@/stores/gearStore";
import { colors } from "@/theme/colors";
import { logger } from "@/lib/logger";

export default function EditCameraScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCameraById, updateCamera, deleteCamera } = useGearStore();

  const camera = id ? getCameraById(id) : undefined;
  const [name, setName] = useState(camera?.name ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!camera || !id) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-paper">
        <Text className="text-body text-stone">Camera not found</Text>
      </SafeAreaView>
    );
  }

  const canSave = name.trim().length > 0 && !isSaving;

  const handleCancel = () => {
    router.back();
  };

  const handleSave = async () => {
    if (!canSave) return;
    setIsSaving(true);
    setError(null);

    try {
      await updateCamera(id, name.trim());
      router.back();
    } catch (err) {
      if (err instanceof DuplicateNameError) {
        setError(err.message);
      } else {
        logger.error("Failed to update camera", err);
        Alert.alert("Error", "Failed to save camera. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

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
              logger.error("Failed to delete camera", err);
              Alert.alert(
                "Error",
                "Failed to delete camera. Please try again.",
              );
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-paper" edges={["top"]}>
      <View className="flex-row items-center justify-between border-b border-fog px-md py-sm">
        <Pressable
          onPress={handleCancel}
          testID="cancel-button"
          accessibilityRole="button"
          accessibilityLabel="Cancel"
          className="min-h-[44px] min-w-[44px] items-center justify-center"
        >
          <Text className="text-body text-slate-blue">Cancel</Text>
        </Pressable>
        <Text className="font-heading text-subheading font-medium text-ink">
          Edit Camera
        </Text>
        <Pressable
          onPress={handleSave}
          disabled={!canSave}
          testID="save-button"
          accessibilityRole="button"
          accessibilityLabel="Save"
          className="min-h-[44px] min-w-[44px] items-center justify-center"
        >
          <Text
            className={`text-body font-medium ${canSave ? "text-slate-blue" : "text-stone"}`}
          >
            Save
          </Text>
        </Pressable>
      </View>

      <View className="flex-1 px-md pt-lg">
        <Text className="mb-sm text-caption font-medium text-stone">Name</Text>
        <TextInput
          testID="camera-name-input"
          value={name}
          onChangeText={setName}
          placeholder="e.g., Leica M6"
          placeholderTextColor={colors.stone}
          autoFocus
          className="min-h-[44px] rounded-md border border-fog bg-white px-md py-sm text-body text-ink"
        />
        {error && (
          <Text className="mt-sm text-caption text-error">{error}</Text>
        )}
      </View>

      <View className="px-md pb-lg">
        <Pressable
          onPress={handleDelete}
          testID="delete-button"
          accessibilityRole="button"
          accessibilityLabel="Delete camera"
          className="min-h-[44px] items-center justify-center rounded-md border border-error"
        >
          <Text className="text-body font-medium text-error">
            Delete Camera
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
