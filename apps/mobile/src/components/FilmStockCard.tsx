import { Card, Text } from "./ui";

interface FilmStockCardProps {
  name: string;
  baseIso: number;
  onPress: () => void;
  testID?: string;
}

export function FilmStockCard({
  name,
  baseIso,
  onPress,
  testID,
}: FilmStockCardProps) {
  return (
    <Card onPress={onPress} testID={testID} accessibilityLabel={name}>
      <Text variant="subheading">{name}</Text>
      <Text variant="caption" className="text-stone">
        ISO {baseIso}
      </Text>
    </Card>
  );
}
