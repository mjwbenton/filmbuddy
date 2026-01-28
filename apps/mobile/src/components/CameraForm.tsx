import { View } from "react-native";
import { UseFormReturn } from "react-hook-form";
import { CameraForm as CameraFormType } from "@/db/camera";
import { TextInput } from "./ui/TextInput";

interface CameraFormProps {
  form: UseFormReturn<CameraFormType>;
  disabled?: boolean;
}

export function CameraForm({ form, disabled }: CameraFormProps) {
  return (
    <View>
      <TextInput
        label="Name"
        name="name"
        control={form.control}
        placeholder="e.g., Leica M6"
        disabled={disabled}
        autoFocus
        testID="camera-name-input"
      />
    </View>
  );
}
