import { Card } from "./ui/Card";
import { Text } from "./ui/Text";

interface GearCardProps {
  name: string;
  onPress: () => void;
  testID?: string;
}

export function GearCard({ name, onPress, testID }: GearCardProps) {
  return (
    <Card onPress={onPress} testID={testID} accessibilityLabel={name}>
      <Text variant="subheading">{name}</Text>
    </Card>
  );
}
