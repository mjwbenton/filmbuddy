import { useEffect, useState, useCallback } from "react";
import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGearStore, DuplicateNameError } from "@/stores/gearStore";
import { GearCard } from "@/components/GearCard";
import { GearSheet } from "@/components/GearSheet";
import { SectionHeader } from "@/components/SectionHeader";
import { GearType, Camera, Lens, FilmStock } from "@/schemas/gear";
import { logger } from "@/lib/logger";

type SheetState =
  | { visible: false }
  | {
      visible: true;
      gearType: GearType;
      mode: "add";
    }
  | {
      visible: true;
      gearType: GearType;
      mode: "edit";
      itemId: string;
      initialName: string;
    };

export default function GearScreen() {
  const {
    cameras,
    lenses,
    filmStocks,
    loadGear,
    isLoading,
    addCamera,
    updateCamera,
    deleteCamera,
    addLens,
    updateLens,
    deleteLens,
    addFilmStock,
    updateFilmStock,
    deleteFilmStock,
  } = useGearStore();

  const [sheetState, setSheetState] = useState<SheetState>({ visible: false });
  const [sheetError, setSheetError] = useState<string | null>(null);

  useEffect(() => {
    loadGear();
  }, [loadGear]);

  const isEmpty =
    cameras.length === 0 && lenses.length === 0 && filmStocks.length === 0;

  const openAddSheet = useCallback((gearType: GearType) => {
    setSheetError(null);
    setSheetState({ visible: true, gearType, mode: "add" });
  }, []);

  const openEditSheet = useCallback(
    (gearType: GearType, item: Camera | Lens | FilmStock) => {
      setSheetError(null);
      setSheetState({
        visible: true,
        gearType,
        mode: "edit",
        itemId: item.id,
        initialName: item.name,
      });
    },
    [],
  );

  const closeSheet = useCallback(() => {
    setSheetState({ visible: false });
    setSheetError(null);
  }, []);

  const handleSave = useCallback(
    async (name: string) => {
      if (!sheetState.visible) return;

      try {
        const { gearType, mode } = sheetState;

        if (mode === "add") {
          if (gearType === "camera") {
            await addCamera(name);
          } else if (gearType === "lens") {
            await addLens(name);
          } else {
            await addFilmStock(name);
          }
        } else {
          const { itemId } = sheetState;
          if (gearType === "camera") {
            await updateCamera(itemId, name);
          } else if (gearType === "lens") {
            await updateLens(itemId, name);
          } else {
            await updateFilmStock(itemId, name);
          }
        }

        closeSheet();
      } catch (error) {
        if (error instanceof DuplicateNameError) {
          setSheetError(error.message);
        } else {
          logger.error("Failed to save gear item", error);
          Alert.alert("Error", "Failed to save. Please try again.");
        }
      }
    },
    [
      sheetState,
      addCamera,
      addLens,
      addFilmStock,
      updateCamera,
      updateLens,
      updateFilmStock,
      closeSheet,
    ],
  );

  const handleDelete = useCallback(async () => {
    if (!sheetState.visible || sheetState.mode !== "edit") return;

    try {
      const { gearType, itemId } = sheetState;

      if (gearType === "camera") {
        await deleteCamera(itemId);
      } else if (gearType === "lens") {
        await deleteLens(itemId);
      } else {
        await deleteFilmStock(itemId);
      }

      closeSheet();
    } catch (error) {
      logger.error("Failed to delete gear item", error);
      Alert.alert("Error", "Failed to delete. Please try again.");
    }
  }, [sheetState, deleteCamera, deleteLens, deleteFilmStock, closeSheet]);

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
                onPress={() => openAddSheet("camera")}
                testID="add-camera-button"
                className="min-h-[44px] min-w-[44px] items-center justify-center rounded-sm bg-slate-blue"
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
                onPress={() => openEditSheet("camera", camera)}
                testID={`camera-card-${camera.id}`}
              />
            ))}

            {/* Lenses Section */}
            <View className="flex-row items-center justify-between">
              <SectionHeader title="Lenses" />
              <Pressable
                onPress={() => openAddSheet("lens")}
                testID="add-lens-button"
                className="min-h-[44px] min-w-[44px] items-center justify-center rounded-sm bg-slate-blue"
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
                onPress={() => openEditSheet("lens", lens)}
                testID={`lens-card-${lens.id}`}
              />
            ))}

            {/* Film Stocks Section */}
            <View className="flex-row items-center justify-between">
              <SectionHeader title="Film Stocks" />
              <Pressable
                onPress={() => openAddSheet("filmStock")}
                testID="add-film-stock-button"
                className="min-h-[44px] min-w-[44px] items-center justify-center rounded-sm bg-slate-blue"
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
                onPress={() => openEditSheet("filmStock", filmStock)}
                testID={`film-stock-card-${filmStock.id}`}
              />
            ))}

            {/* Bottom padding */}
            <View className="h-lg" />
          </>
        )}
      </ScrollView>

      {/* Gear Sheet */}
      <GearSheet
        visible={sheetState.visible}
        gearType={sheetState.visible ? sheetState.gearType : "camera"}
        mode={sheetState.visible ? sheetState.mode : "add"}
        initialName={
          sheetState.visible && sheetState.mode === "edit"
            ? sheetState.initialName
            : ""
        }
        onSave={handleSave}
        onDelete={
          sheetState.visible && sheetState.mode === "edit"
            ? handleDelete
            : undefined
        }
        onClose={closeSheet}
        error={sheetError}
      />
    </SafeAreaView>
  );
}
