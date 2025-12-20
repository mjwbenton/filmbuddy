import { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GearType } from "@/schemas/gear";
import { colors } from "@/theme/colors";

interface GearSheetProps {
  visible: boolean;
  gearType: GearType;
  mode: "add" | "edit";
  initialName?: string;
  onSave: (name: string) => Promise<void>;
  onDelete?: () => Promise<void>;
  onClose: () => void;
  error?: string | null;
}

const GEAR_TYPE_LABELS: Record<GearType, { singular: string; field: string }> =
  {
    camera: { singular: "Camera", field: "camera-name" },
    lens: { singular: "Lens", field: "lens-name" },
    filmStock: { singular: "Film Stock", field: "film-stock-name" },
  };

const PLACEHOLDERS: Record<GearType, string> = {
  camera: "e.g., Leica M6",
  lens: "e.g., Summicron 50mm f/2",
  filmStock: "e.g., Kodak Portra 400",
};

export function GearSheet({
  visible,
  gearType,
  mode,
  initialName = "",
  onSave,
  onDelete,
  onClose,
  error,
}: GearSheetProps) {
  const [name, setName] = useState(initialName);
  const [isSaving, setIsSaving] = useState(false);

  const labels = GEAR_TYPE_LABELS[gearType];
  const title =
    mode === "add" ? `Add ${labels.singular}` : `Edit ${labels.singular}`;
  const canSave = name.trim().length > 0 && !isSaving;

  // Reset name when sheet opens with new initial value
  useEffect(() => {
    if (visible) {
      setName(initialName);
    }
  }, [visible, initialName]);

  const handleSave = async () => {
    if (!canSave) return;
    setIsSaving(true);
    try {
      await onSave(name.trim());
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (!onDelete) return;
    Alert.alert(
      `Delete ${labels.singular}`,
      `Are you sure you want to delete this ${labels.singular.toLowerCase()}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await onDelete();
          },
        },
      ],
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-paper" edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-fog px-md py-sm">
            <Pressable
              onPress={onClose}
              testID="cancel-button"
              className="min-h-[44px] min-w-[44px] items-center justify-center"
            >
              <Text className="text-body text-slate-blue">Cancel</Text>
            </Pressable>
            <Text className="font-heading text-subheading font-medium text-ink">
              {title}
            </Text>
            <Pressable
              onPress={handleSave}
              testID="save-button"
              disabled={!canSave}
              className="min-h-[44px] min-w-[44px] items-center justify-center"
            >
              <Text
                className={`text-body font-medium ${canSave ? "text-slate-blue" : "text-stone"}`}
              >
                Save
              </Text>
            </Pressable>
          </View>

          {/* Content */}
          <View className="flex-1 px-md pt-lg">
            <Text className="mb-sm text-caption font-medium text-stone">
              Name
            </Text>
            <TextInput
              testID={`${labels.field}-input`}
              value={name}
              onChangeText={setName}
              placeholder={PLACEHOLDERS[gearType]}
              placeholderTextColor={colors.stone}
              autoFocus
              className="min-h-[44px] rounded-md border border-fog bg-white px-md py-sm text-body text-ink"
            />
            {error && (
              <Text className="mt-sm text-caption text-error">{error}</Text>
            )}
          </View>

          {/* Delete button (edit mode only) */}
          {mode === "edit" && onDelete && (
            <View className="px-md pb-lg">
              <Pressable
                onPress={handleDelete}
                testID="delete-button"
                className="min-h-[44px] items-center justify-center rounded-sm bg-error"
              >
                <Text className="text-body font-medium text-white">
                  Delete {labels.singular}
                </Text>
              </Pressable>
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
