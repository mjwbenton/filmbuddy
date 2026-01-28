import { Roll } from "@/db/roll";
import { formatRelativeDate } from "@/lib/date-format";
import { Card } from "./ui/Card";
import { Text } from "./ui/Text";

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
    <Card
      active={!isFinished}
      onPress={onPress}
      testID={testID}
      accessibilityLabel={`${roll.filmStock} @ ${roll.iso}, ${roll.camera}, ${dateText}`}
    >
      <Text
        variant="subheading"
        testID={testID ? `${testID}-title` : undefined}
      >
        {roll.filmStock} @ {roll.iso}
      </Text>
      <Text
        variant="body"
        color="stone"
        className="mt-xs"
        testID={testID ? `${testID}-camera` : undefined}
      >
        {roll.camera}
      </Text>
      <Text
        variant="small"
        color="stone"
        className="mt-xs"
        testID={testID ? `${testID}-date` : undefined}
      >
        {dateText}
      </Text>
    </Card>
  );
}
