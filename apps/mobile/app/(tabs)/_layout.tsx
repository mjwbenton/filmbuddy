import { Tabs } from "expo-router";
import RollsActive from "@assets/icons/rolls-active.svg";
import RollsInactive from "@assets/icons/rolls-inactive.svg";
import GearActive from "@assets/icons/gear-active.svg";
import GearInactive from "@assets/icons/gear-inactive.svg";
import { colors } from "@/theme/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.slateBlue,
        tabBarInactiveTintColor: colors.stone,
        tabBarStyle: {
          backgroundColor: colors.cloud,
          borderTopColor: colors.fog,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Rolls",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <RollsActive width={24} height={24} />
            ) : (
              <RollsInactive width={24} height={24} />
            ),
        }}
      />
      <Tabs.Screen
        name="gear"
        options={{
          title: "Gear",
          tabBarAccessibilityLabel: "gear-tab",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <GearActive width={24} height={24} />
            ) : (
              <GearInactive width={24} height={24} />
            ),
        }}
      />
    </Tabs>
  );
}
