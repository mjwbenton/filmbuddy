import { useEffect } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useGearStore } from "@/stores/gearStore";
import { GearCard } from "@/components/GearCard";
import { SectionHeader } from "@/components/ui";

export default function GearScreen() {
  const router = useRouter();
  const { cameras, lenses, filmStocks, loadGear, isLoading } = useGearStore();

  useEffect(() => {
    loadGear();
  }, [loadGear]);

  const isEmpty =
    cameras.length === 0 && lenses.length === 0 && filmStocks.length === 0;

  return (
    <SafeAreaView className="flex-1 bg-paper" edges={["top"]}>
      <View className="border-b border-fog px-md py-sm">
        <Text className="font-heading text-display font-semibold text-ink">
          Gear
        </Text>
      </View>

      <ScrollView className="flex-1 px-md">
        {isLoading ? (
          <View className="flex-1 items-center justify-center py-xl">
            <Text className="text-body text-stone">Loading...</Text>
          </View>
        ) : (
          <>
            {isEmpty && (
              <View className="items-center py-xl">
                <Text className="text-body text-stone">No gear yet</Text>
                <Text className="mt-xs text-caption text-stone">
                  Add your cameras, lenses, and film stocks
                </Text>
              </View>
            )}

            {/* Cameras Section */}
            <View className="flex-row items-center justify-between">
              <SectionHeader title="Cameras" />
              <Pressable
                onPress={() => router.push("/gear/camera/add")}
                testID="add-camera-button"
                className="min-h-touch min-w-touch items-center justify-center rounded-sm bg-slate-blue"
              >
                <Text className="text-subheading font-medium text-white">
                  +
                </Text>
              </Pressable>
            </View>
            {cameras.map((camera) => (
              <GearCard
                key={camera.id}
                name={camera.name}
                onPress={() => router.push(`/gear/camera/${camera.id}`)}
                testID={`camera-card-${camera.id}`}
              />
            ))}

            {/* Lenses Section */}
            <View className="flex-row items-center justify-between">
              <SectionHeader title="Lenses" />
              <Pressable
                onPress={() => router.push("/gear/lens/add")}
                testID="add-lens-button"
                className="min-h-touch min-w-touch items-center justify-center rounded-sm bg-slate-blue"
              >
                <Text className="text-subheading font-medium text-white">
                  +
                </Text>
              </Pressable>
            </View>
            {lenses.map((lens) => (
              <GearCard
                key={lens.id}
                name={lens.name}
                onPress={() => router.push(`/gear/lens/${lens.id}`)}
                testID={`lens-card-${lens.id}`}
              />
            ))}

            {/* Film Stocks Section */}
            <View className="flex-row items-center justify-between">
              <SectionHeader title="Film Stocks" />
              <Pressable
                onPress={() => router.push("/gear/film-stock/add")}
                testID="add-film-stock-button"
                className="min-h-touch min-w-touch items-center justify-center rounded-sm bg-slate-blue"
              >
                <Text className="text-subheading font-medium text-white">
                  +
                </Text>
              </Pressable>
            </View>
            {filmStocks.map((filmStock) => (
              <GearCard
                key={filmStock.id}
                name={filmStock.name}
                onPress={() => router.push(`/gear/film-stock/${filmStock.id}`)}
                testID={`film-stock-card-${filmStock.id}`}
              />
            ))}

            {/* Bottom padding */}
            <View className="h-lg" />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
