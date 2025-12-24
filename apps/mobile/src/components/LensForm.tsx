import { View } from "react-native";
import { UseFormReturn } from "react-hook-form";
import { LensForm as LensFormType } from "@/db/schema";
import { TextInput } from "./ui";

interface LensFormProps {
  form: UseFormReturn<LensFormType>;
  disabled?: boolean;
}

export function LensForm({ form, disabled }: LensFormProps) {
  return (
    <View>
      <TextInput
        label="Name"
        name="name"
        control={form.control}
        placeholder="e.g., Summicron 50mm f/2"
        disabled={disabled}
        autoFocus
        testID="lens-name-input"
      />
    </View>
  );
}
