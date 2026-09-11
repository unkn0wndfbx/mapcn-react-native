const REGISTRY_BASE_URL =
  "https://raw.githubusercontent.com/unkn0wndfbx/mapcn-react-native/main/public/r";

export function getRegistryItemUrl(name: string): string {
  return `${REGISTRY_BASE_URL}/${encodeURIComponent(name)}.json`;
}
