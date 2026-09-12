import { useMemo, useState } from "react";
import { useWindowDimensions, View } from "react-native";

import { MAP_CENTER, stores } from "./data";
import { LocatorMap } from "./ui/locator-map";
import { StoreList } from "./ui/store-list";

export default function Page() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(stores[0].id);
  const { width } = useWindowDimensions();
  const isCompact = width < 768;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return stores;
    return stores.filter(
      (store) =>
        store.name.toLowerCase().includes(q) ||
        store.address.toLowerCase().includes(q) ||
        store.neighborhood.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <View className={isCompact ? "flex-1 flex-col" : "flex-1 flex-row"}>
      <View className={isCompact ? "h-[48%] min-h-72" : "min-w-0 flex-1"}>
        <LocatorMap
          stores={filtered}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onClearSelection={() => {
            setSelectedId(null);
          }}
          center={MAP_CENTER}
        />
      </View>
      <StoreList
        stores={filtered}
        query={query}
        onQueryChange={setQuery}
        selectedId={selectedId}
        onSelect={setSelectedId}
        compact={isCompact}
      />
    </View>
  );
}
