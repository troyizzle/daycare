import { ExpoConfig, ConfigContext } from "@expo/config";

const CLERK_PUBLISHABLE_KEY = "pk_live_Y2xlcmsuc3RlcHBpbmctc3RvbmUtZGF5Y2FyZS5jb20k";

const defineConfig = (_ctx: ConfigContext): ExpoConfig => ({
  name: "splashing-stone-daycare",
  slug: "daycare",
  scheme: "daycare",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  notification: {
    icon: "./assets/icon.png",
  },
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: "https://u.expo.dev/192b81d6-e739-44f5-ae0d-764207dde324"
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.troyizzle.daycare",
    buildNumber: "16.0.1",
    runtimeVersion: {
      policy: "sdkVersion"
    }
  },
  android: {
    runtimeVersion: "1.0.0",
    adaptiveIcon: {
      foregroundImage: "./assets/splash.png",
    },
    package: "com.troyizzle.daycare"
  },
  extra: {
    eas: {
      projectId: "192b81d6-e739-44f5-ae0d-764207dde324",
    },
    CLERK_PUBLISHABLE_KEY,
  },
  plugins: ["./expo-plugins/with-modify-gradle.js"],
});

export default defineConfig;
