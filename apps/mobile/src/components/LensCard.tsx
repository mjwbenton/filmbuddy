import { Lens } from "@/db/lens";
import { Card } from "./ui/Card";
import { Text } from "./ui/Text";

interface LensCardProps {
  lens: Lens;
  onPress: () => void;
  testID?: string;
}

export function LensCard({
  lens: { name, apertures },
  onPress,
  testID,
}: LensCardProps) {
  const apertureRange = getApertureRange(apertures);

  return (
    <Card onPress={onPress} testID={testID} accessibilityLabel={name}>
      <Text variant="subheading">{name}</Text>
      {apertureRange && (
        <Text
          variant="caption"
          color="stone"
          className="mt-xs"
          testID={`${testID}-aperture-range`}
        >
          {apertureRange}
        </Text>
      )}
    </Card>
  );
}

function getApertureRange(apertures: number[]): string | null {
  if (apertures.length === 0) return null;
  const widest = Math.min(...apertures);
  const narrowest = Math.max(...apertures);
  return `f/${widest} - f/${narrowest}`;
}
