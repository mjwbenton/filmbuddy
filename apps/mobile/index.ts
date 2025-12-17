import { LogBox } from "react-native";
import { LaunchArguments } from "react-native-launch-arguments";

// NativeWind's react-native-css-interop imports SafeAreaView from react-native
// to wrap it, triggering a deprecation warning even though we use the correct
// react-native-safe-area-context version throughout our app.
LogBox.ignoreLogs([
  /SafeAreaView has been deprecated and will be removed in a future release.*/,
]);

// Disable LogBox warnings when running under Maestro E2E tests
interface MaestroLaunchArgs {
  maestro?: boolean;
}
const launchArgs = LaunchArguments.value<MaestroLaunchArgs>();
if (launchArgs.maestro) {
  LogBox.ignoreAllLogs();
}

import "expo-router/entry";
