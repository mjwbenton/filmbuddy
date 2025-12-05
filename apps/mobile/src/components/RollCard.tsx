import { Pressable, Text } from "react-native";
import { Roll } from "@/db/schema";
import { formatRelativeDate } from "@/lib/date-format";

interface RollCardProps {
  roll: Roll;
  onPress: () => void;
  testID?: string;
}

export function RollCard({ roll, onPress, testID }: RollCardProps) {
  const isFinished = roll.finishedAt !== null;
  const dateText = roll.finishedAt
    ? formatRelativeDate(roll.finishedAt, "Finished")
    : formatRelativeDate(roll.loadedAt, "Loaded");

  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      className={`mb-sm rounded-md bg-cloud p-md shadow-sm ${
        !isFinished ? "border-l-[3px] border-l-amber" : ""
      }`}
    >
      <Text className="font-heading text-subheading font-medium text-ink">
        {roll.filmStock} @ {roll.iso}
      </Text>
      <Text className="mt-xs text-body text-stone">{roll.camera}</Text>
      <Text className="mt-xs text-sm text-stone">{dateText}</Text>
    </Pressable>
  );
}
