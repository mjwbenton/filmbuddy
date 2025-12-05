import { useState, useEffect, useRef } from "react";
import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useRollStore } from "@/stores/rollStore";
import { RollForm } from "@/components/RollForm";
import {
  RollFormData,
  ValidationErrors,
  isValidRoll,
  getValidationErrors,
} from "@/lib/roll-validation";
import { formatRelativeDate } from "@/lib/date-format";
import { ISOValue } from "@/types/roll";

export default function RollDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getRollById, updateRoll, markFinished, markActive, deleteRoll } =
    useRollStore();

  const roll = id ? getRollById(id) : undefined;
  const isInitialized = useRef(false);

  const [formData, setFormData] = useState<RollFormData>({
    filmStock: roll?.filmStock ?? "",
    iso: (roll?.iso as ISOValue) ?? null,
    camera: roll?.camera ?? "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (roll && !isInitialized.current) {
      setFormData({
        filmStock: roll.filmStock,
        iso: roll.iso as ISOValue,
        camera: roll.camera,
      });
      isInitialized.current = true;
    }
  }, [roll]);

  if (!roll || !id) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-paper">
        <Text className="text-body text-stone">Roll not found</Text>
      </SafeAreaView>
    );
  }

  const isFinished = roll.finishedAt !== null;
  const canSave = isValidRoll(formData);

  const handleChange = (
    field: keyof RollFormData,
    value: string | ISOValue | null,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleClose = () => {
    router.back();
  };

  const handleSave = async () => {
    const validationErrors = getValidationErrors(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);
    try {
      await updateRoll(id, {
        filmStock: formData.filmStock.trim(),
        iso: formData.iso!,
        camera: formData.camera.trim(),
      });
      router.back();
    } catch {
      Alert.alert("Error", "Failed to save roll. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarkFinished = async () => {
    try {
      await markFinished(id);
      router.back();
    } catch {
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
    } catch {
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
            } catch {
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
            onPress={handleSave}
            disabled={!canSave || isSaving}
            testID="save-button"
            className="min-h-[44px] min-w-[44px] items-center justify-center"
          >
            <Text
              className={`text-body font-medium ${
                canSave && !isSaving ? "text-slate-blue" : "text-stone"
              }`}
            >
              Save
            </Text>
          </Pressable>
        )}
      </View>

      <ScrollView className="flex-1 px-md py-md">
        <RollForm
          data={formData}
          errors={errors}
          onChange={handleChange}
          disabled={isFinished}
        />

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
