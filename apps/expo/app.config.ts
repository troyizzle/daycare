import { ExpoConfig, ConfigContext } from "@expo/config";

const CLERK_PUBLISHABLE_KEY = "your-clerk-publishable-key";

const defineConfig = (_ctx: ConfigContext): ExpoConfig => ({
  name: "daycare",
  slug: "daycare",
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
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "your.bundle.identifier",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/splash.png",
    },
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
