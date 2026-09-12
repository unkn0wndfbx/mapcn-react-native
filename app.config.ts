import type { ConfigContext, ExpoConfig } from "expo/config";

const SITE_URL = process.env.EXPO_PUBLIC_SITE_URL ?? "http://localhost:8081";

export default ({ config }: ConfigContext): ExpoConfig => {
  const plugins = config.plugins?.map((plugin) => {
    if (plugin === "expo-router") {
      const routerPlugin: [string, { origin: string }] = [
        "expo-router",
        {
          origin: SITE_URL,
        },
      ];
      return routerPlugin;
    }

    return plugin;
  });

  return {
    ...config,
    name: config.name ?? "mapcn-react-native",
    slug: config.slug ?? "mapcn-react-native",
    plugins,
  };
};
