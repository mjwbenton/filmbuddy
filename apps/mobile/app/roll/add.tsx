import { useState } from "react";
import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useRollStore } from "@/stores/rollStore";
import { RollForm } from "@/components/RollForm";
import {
  RollFormData,
  ValidationErrors,
  isValidRoll,
  getValidationErrors,
} from "@/lib/roll-validation";
import { ISOValue } from "@/types/roll";

export default function AddRollScreen() {
  const router = useRouter();
  const { addRoll } = useRollStore();

  const [formData, setFormData] = useState<RollFormData>({
    filmStock: "",
    iso: null,
    camera: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSaving, setIsSaving] = useState(false);

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

  const handleCancel = () => {
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
      await addRoll({
        filmStock: formData.filmStock.trim(),
        iso: formData.iso!,
        camera: formData.camera.trim(),
        finishedAt: null,
      });
      router.back();
    } catch (error) {
      console.error("Failed to add roll:", error);
      Alert.alert("Error", "Failed to add roll. Please try again.");
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
          className="min-h-[44px] min-w-[44px] items-center justify-center"
        >
          <Text className="text-body text-slate-blue">Cancel</Text>
        </Pressable>
        <Text className="font-heading text-subheading font-medium text-ink">
          Add Roll
        </Text>
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
      </View>

      <ScrollView className="flex-1 px-md py-md">
        <RollForm data={formData} errors={errors} onChange={handleChange} />
      </ScrollView>
    </SafeAreaView>
  );
}
