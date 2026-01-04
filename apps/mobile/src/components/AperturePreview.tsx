import { View } from "react-native";
import { Text, Label } from "./ui";
import { formatAperture } from "@/lib/aperture";

interface AperturePreviewProps {
  apertures: number[];
  note?: string;
}

export function AperturePreview({ apertures, note }: AperturePreviewProps) {
  return (
    <View className="mb-md">
      <Label>Preview</Label>
      <View
        testID="aperture-preview"
        className="min-h-16 flex-row flex-wrap gap-sm rounded-md border border-fog bg-cloud p-sm"
      >
        {apertures.length === 0 ? (
          <Text variant="caption" color="stone">
            No apertures configured
          </Text>
        ) : (
          apertures.map((aperture) => (
            <View
              key={aperture}
              className="rounded-full border border-ink bg-white px-sm py-xs"
            >
              <Text variant="caption">{formatAperture(aperture)}</Text>
            </View>
          ))
        )}
      </View>
      {note && (
        <Text variant="small" color="stone" className="mt-xs">
          {note}
        </Text>
      )}
    </View>
  );
}
