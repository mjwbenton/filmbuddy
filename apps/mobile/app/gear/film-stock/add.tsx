import { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useGearStore } from "@/stores/gearStore";
import { colors } from "@/theme/colors";
import { UserFacingError } from "@/lib/errors";
import { handleError } from "@/lib/handleError";

export default function AddFilmStockScreen() {
  const router = useRouter();
  const { addFilmStock } = useGearStore();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const canSave = name.trim().length > 0 && !isSaving;

  const handleCancel = () => {
    router.back();
  };

  const handleSave = async () => {
    if (!canSave) return;
    setIsSaving(true);
    setError(null);

    try {
      await addFilmStock(name.trim());
      router.back();
    } catch (err) {
      if (err instanceof UserFacingError) {
        setError(err.message);
      } else {
        handleError(err, "Failed to add film stock. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
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
          Add Film Stock
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
    </SafeAreaView>
  );
}
