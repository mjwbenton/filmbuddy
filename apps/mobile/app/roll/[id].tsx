import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useRollStore } from "@/stores/rollStore";
import { RollForm } from "@/components/RollForm";
import { useRollForm } from "@/hooks/useRollForm";
import { formatRelativeDate } from "@/lib/date-format";
import { logger } from "@/lib/logger";

export default function RollDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getRollById, updateRoll, markFinished, markActive, deleteRoll } =
    useRollStore();

  const roll = id ? getRollById(id) : undefined;

  const { form, handleSubmit, isSubmitting, canSubmit } = useRollForm({
    defaultValues: roll
      ? {
          filmStock: roll.filmStock,
          iso: roll.iso,
          camera: roll.camera,
        }
      : undefined,
    onSubmit: async (data) => {
      if (!id) return;
      try {
        await updateRoll(id, {
          filmStock: data.filmStock,
          iso: data.iso,
          camera: data.camera,
        });
        router.back();
      } catch (error) {
        logger.error("Failed to save roll", error);
        Alert.alert("Error", "Failed to save roll. Please try again.");
      }
    },
  });

  if (!roll || !id) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-paper">
        <Text className="text-body text-stone">Roll not found</Text>
      </SafeAreaView>
    );
  }

  const isFinished = roll.finishedAt !== null;

  const handleClose = () => {
    router.back();
  };

  const handleMarkFinished = async () => {
    try {
      await markFinished(id);
      router.back();
    } catch (error) {
      logger.error("Failed to mark roll as finished", error);
      Alert.alert(
        "Error",
        "Failed to mark roll as finished. Please try again.",
      );
    }
  };

  const handleMarkActive = async () => {
    try {
      await markActive(id);
      router.back();
    } catch (error) {
      logger.error("Failed to mark roll as active", error);
      Alert.alert("Error", "Failed to mark roll as active. Please try again.");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Roll",
      "Are you sure you want to delete this roll? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteRoll(id);
              router.back();
            } catch (error) {
              logger.error("Failed to delete roll", error);
              Alert.alert("Error", "Failed to delete roll. Please try again.");
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
          onPress={handleClose}
          testID="close-button"
          className="min-h-[44px] min-w-[44px] items-center justify-center"
        >
          <Text className="text-body text-slate-blue">
            {isFinished ? "Close" : "Cancel"}
          </Text>
        </Pressable>
        <Text className="font-heading text-subheading font-medium text-ink">
          {isFinished ? "Finished Roll" : "Edit Roll"}
        </Text>
        {isFinished ? (
          <View className="min-h-[44px] min-w-[44px]" />
        ) : (
          <Pressable
            onPress={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            testID="save-button"
            className="min-h-[44px] min-w-[44px] items-center justify-center"
          >
            <Text
              className={`text-body font-medium ${
                canSubmit && !isSubmitting ? "text-slate-blue" : "text-stone"
              }`}
            >
              Save
            </Text>
          </Pressable>
        )}
      </View>

      <ScrollView className="flex-1 px-md py-md">
        <RollForm form={form} disabled={isFinished} />

        <View className="mt-lg">
          <Text className="text-sm text-stone">
            {formatRelativeDate(roll.loadedAt, "Loaded")}
          </Text>
          {roll.finishedAt && (
            <Text className="mt-xs text-sm text-stone">
              {formatRelativeDate(roll.finishedAt, "Finished")}
            </Text>
          )}
        </View>

        <View className="mt-xl gap-sm">
          {isFinished ? (
            <Pressable
              onPress={handleMarkActive}
              testID="mark-active-button"
              className="min-h-[44px] items-center justify-center rounded-md border border-slate-blue"
            >
              <Text className="text-body font-medium text-slate-blue">
                Mark as Active
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={handleMarkFinished}
              testID="mark-finished-button"
              className="min-h-[44px] items-center justify-center rounded-md border border-slate-blue"
            >
              <Text className="text-body font-medium text-slate-blue">
                Mark as Finished
              </Text>
            </Pressable>
          )}

          <Pressable
            onPress={handleDelete}
            testID="delete-button"
            className="min-h-[44px] items-center justify-center rounded-md border border-error"
          >
            <Text className="text-body font-medium text-error">
              Delete Roll
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
