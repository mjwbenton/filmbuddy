import { View, TextInput as RNTextInput } from "react-native";
import {
  Controller,
  Control,
  FieldValues,
  FieldPath,
  FieldPathValue,
} from "react-hook-form";
import { Label } from "./Label";
import { ErrorMessage } from "./ErrorMessage";
import { colors } from "@/theme/colors";

interface TextInputProps<T extends FieldValues> {
  label: string;
  name: FieldPath<T>;
  control: Control<T>;
  placeholder?: string;
  defaultValue?: FieldPathValue<T, FieldPath<T>>;
  disabled?: boolean;
  autoFocus?: boolean;
  testID?: string;
}

export function TextInput<T extends FieldValues>({
  label,
  name,
  control,
  placeholder,
  defaultValue,
  disabled = false,
  autoFocus = false,
  testID,
}: TextInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View>
          <Label>{label}</Label>
          <RNTextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            editable={!disabled}
            autoFocus={autoFocus}
            autoCorrect={false}
            autoCapitalize="none"
            spellCheck={false}
            testID={testID}
            className={`min-h-touch rounded-md border bg-white px-md py-sm text-body ${
              error ? "border-error" : "border-fog"
            } ${disabled ? "opacity-50" : ""}`}
            placeholderTextColor={colors.stone}
          />
          <ErrorMessage
            message={error?.message}
            testID={testID ? `${testID}-error` : undefined}
          />
        </View>
      )}
    />
  );
}
