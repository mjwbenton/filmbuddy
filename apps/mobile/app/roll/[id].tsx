import { View, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useRollStore } from "@/stores/rollStore";
import { RollForm } from "@/components/RollForm";
import { useRollForm } from "@/hooks/useRollForm";
import { formatRelativeDate } from "@/lib/date-format";
import { handleError } from "@/lib/handleError";
import {
  ScreenHeader,
  HeaderCloseButton,
  HeaderSaveButton,
  Text,
  Button,
} from "@/components/ui";

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
        handleError(error, "Failed to save roll. Please try again.");
      }
    },
  });

  if (!roll || !id) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-paper">
        <Text color="stone">Roll not found</Text>
      </SafeAreaView>
    );
  }

  const isFinished = roll.finishedAt !== null;

  const handleMarkFinished = async () => {
    try {
      await markFinished(id);
      router.back();
    } catch (error) {
      handleError(error, "Failed to mark roll as finished. Please try again.");
    }
  };

  const handleMarkActive = async () => {
    try {
      await markActive(id);
      router.back();
    } catch (error) {
      handleError(error, "Failed to mark roll as active. Please try again.");
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
              handleError(error, "Failed to delete roll. Please try again.");
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-paper" edges={["top"]}>
      <ScreenHeader
        title={isFinished ? "Finished Roll" : "Edit Roll"}
        left={<HeaderCloseButton onPress={() => router.back()} />}
        right={
          isFinished ? null : (
            <HeaderSaveButton
              onPress={handleSubmit}
              disabled={!canSubmit || isSubmitting}
            />
          )
        }
      />

      <ScrollView className="flex-1 px-md py-md">
        <RollForm form={form} disabled={isFinished} />

        <View className="mt-lg">
          <Text variant="small" color="stone">
            {formatRelativeDate(roll.loadedAt, "Loaded")}
          </Text>
          {roll.finishedAt && (
            <Text variant="small" color="stone" className="mt-xs">
              {formatRelativeDate(roll.finishedAt, "Finished")}
            </Text>
          )}
        </View>

        <View className="mt-xl gap-sm">
          {isFinished ? (
            <Button
              variant="secondary"
              onPress={handleMarkActive}
              testID="mark-active-button"
            >
              Mark as Active
            </Button>
          ) : (
            <Button
              variant="secondary"
              onPress={handleMarkFinished}
              testID="mark-finished-button"
            >
              Mark as Finished
            </Button>
          )}

          <Button
            variant="secondary-destructive"
            onPress={handleDelete}
            testID="delete-button"
          >
            Delete Roll
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
