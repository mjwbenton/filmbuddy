import { useState } from "react";
import { View, Text, Pressable, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useGearStore } from "@/stores/gearStore";
import { colors } from "@/theme/colors";
import { UserFacingError } from "@/lib/errors";
import { handleError } from "@/lib/handleError";

export default function EditFilmStockScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getFilmStockById, updateFilmStock, deleteFilmStock } = useGearStore();

  const filmStock = id ? getFilmStockById(id) : undefined;
  const [name, setName] = useState(filmStock?.name ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!filmStock || !id) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-paper">
        <Text className="text-body text-stone">Film stock not found</Text>
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
      await updateFilmStock(id, name.trim());
      router.back();
    } catch (err) {
      if (err instanceof UserFacingError) {
        setError(err.message);
      } else {
        handleError(err, "Failed to save film stock. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Film Stock",
      "Are you sure you want to delete this film stock?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteFilmStock(id);
              router.back();
            } catch (err) {
              handleError(
                err,
                "Failed to delete film stock. Please try again.",
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
          Edit Film Stock
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
          testID="film-stock-name-input"
          value={name}
          onChangeText={setName}
          placeholder="e.g., Kodak Portra 400"
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
          accessibilityLabel="Delete film stock"
          className="min-h-[44px] items-center justify-center rounded-md border border-error"
        >
          <Text className="text-body font-medium text-error">
            Delete Film Stock
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
