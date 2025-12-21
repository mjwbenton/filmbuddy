import { View, Text, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useGearStore } from "@/stores/gearStore";
import { useLensForm } from "@/hooks/useLensForm";
import { LensForm } from "@/components/LensForm";
import { UserFacingError } from "@/lib/errors";
import { handleError } from "@/lib/handleError";
import { LensForm as LensFormType } from "@/db/schema";

export default function EditLensScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getLensById, updateLens, deleteLens } = useGearStore();

  const lens = id ? getLensById(id) : undefined;

  const { form, handleSubmit, isSubmitting, canSubmit } = useLensForm({
    defaultValues: { name: lens?.name ?? "" },
    onSubmit: async (data: LensFormType) => {
      if (!id) return;
      try {
        await updateLens(id, data.name);
        router.back();
      } catch (err) {
        if (err instanceof UserFacingError) {
          form.setError("name", { message: err.message });
        } else {
          handleError(err, "Failed to save lens. Please try again.");
        }
      }
    },
  });

  if (!lens || !id) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-paper">
        <Text className="text-body text-stone">Lens not found</Text>
      </SafeAreaView>
    );
  }

  const handleCancel = () => {
    router.back();
  };

  const handleDelete = () => {
    Alert.alert("Delete Lens", "Are you sure you want to delete this lens?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteLens(id);
            router.back();
          } catch (err) {
            handleError(err, "Failed to delete lens. Please try again.");
          }
        },
      },
    ]);
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
          Edit Lens
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

      <View className="px-md pb-lg">
        <Pressable
          onPress={handleDelete}
          testID="delete-button"
          accessibilityRole="button"
          accessibilityLabel="Delete lens"
          className="min-h-touch items-center justify-center rounded-md border border-error"
        >
          <Text className="text-body font-medium text-error">Delete Lens</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
