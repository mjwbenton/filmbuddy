import { useState } from "react";
import { Modal, Pressable, Text, View, ScrollView } from "react-native";
import { ISO_VALUES, ISOValue } from "@/types/roll";

interface ISOPickerProps {
  value: ISOValue | null;
  onChange: (iso: ISOValue) => void;
  hasError?: boolean;
  testID?: string;
}

export function ISOPicker({
  value,
  onChange,
  hasError,
  testID,
}: ISOPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (iso: ISOValue) => {
    onChange(iso);
    setIsOpen(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setIsOpen(true)}
        testID={testID}
        className={`min-h-[44px] flex-row items-center justify-between rounded-md border bg-white px-md py-sm ${
          hasError ? "border-error" : "border-fog"
        }`}
      >
        <Text className={`text-body ${value ? "text-ink" : "text-stone"}`}>
          {value ? String(value) : "Select ISO"}
        </Text>
        <Text className="text-stone">▼</Text>
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <View className="flex-1 justify-end">
          <Pressable
            className="absolute inset-0 bg-black/50"
            onPress={() => setIsOpen(false)}
          />
          <View className="rounded-t-lg bg-paper">
            <View className="flex-row items-center justify-between border-b border-fog px-md py-sm">
              <Text className="font-heading text-subheading font-medium text-ink">
                Select ISO
              </Text>
              <Pressable
                onPress={() => setIsOpen(false)}
                testID="iso-picker-close"
                className="min-h-[44px] min-w-[44px] items-center justify-center"
              >
                <Text className="text-body text-slate-blue">Done</Text>
              </Pressable>
            </View>
            <ScrollView className="max-h-[300px]">
              {ISO_VALUES.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => handleSelect(item)}
                  testID={`iso-option-${item}`}
                  accessibilityLabel={`ISO ${item}`}
                  className={`min-h-[44px] flex-row items-center justify-between border-b border-fog px-md py-sm ${
                    value === item ? "bg-cloud" : ""
                  }`}
                >
                  <Text className="text-body text-ink">{item}</Text>
                  {value === item && <Text className="text-slate-blue">✓</Text>}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
