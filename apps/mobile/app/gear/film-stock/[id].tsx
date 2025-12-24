import { View, Text, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
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

export default function EditFilmStockScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getFilmStockById, updateFilmStock, deleteFilmStock } = useGearStore();

  const filmStock = id ? getFilmStockById(id) : undefined;

  const { form, handleSubmit, isSubmitting, canSubmit } = useFilmStockForm({
    defaultValues: { name: filmStock?.name ?? "" },
    onSubmit: async (data: FilmStockFormType) => {
      if (!id) return;
      try {
        await updateFilmStock(id, data.name);
        router.back();
      } catch (err) {
        handleError(err, "Failed to save film stock. Please try again.");
      }
    },
  });

  if (!filmStock || !id) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-paper">
        <Text className="text-body text-stone">Film stock not found</Text>
      </SafeAreaView>
    );
  }

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
      <ScreenHeader
        title="Edit Film Stock"
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

      <View className="px-md pb-lg">
        <Pressable
          onPress={handleDelete}
          testID="delete-button"
          accessibilityRole="button"
          accessibilityLabel="Delete film stock"
          className="min-h-touch items-center justify-center rounded-md border border-error"
        >
          <Text className="text-body font-medium text-error">
            Delete Film Stock
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
