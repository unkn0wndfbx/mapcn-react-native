import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { FileText, SearchIcon } from "lucide-react-native";
import * as React from "react";
import { Platform, View } from "react-native";

import { Button } from "@/atoms/Button";
import { Icon } from "@/atoms/Icon";
import { Kbd } from "@/atoms/Kbd";
import { Text } from "@/atoms/Text";
import { siteNavigation } from "@/lib/Config/SiteNavigation";
import { cn } from "@/lib/Utils/Cn";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/molecules/Command";

type CommandSearchProps = {
  className?: string;
};

export function CommandSearch({ className }: CommandSearchProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    if (Platform.OS !== "web") {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const filteredNavigation = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return siteNavigation;
    }

    return siteNavigation
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          item.title.toLowerCase().includes(query),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [search]);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSearch("");
    }
  }

  function handleSelect(href: Href) {
    handleOpenChange(false);
    router.push(href);
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onPress={() => {
          setOpen(true);
        }}
        accessibilityLabel="Jump to pages, components, and docs"
        className={cn(
          "bg-muted dark:bg-muted/50 text-muted-foreground hover:bg-muted/60 dark:hover:bg-muted/60 hover:text-foreground mr-2.5 hidden w-48 md:flex",
          className,
        )}
      >
        <Icon
          as={SearchIcon}
          className="text-muted-foreground size-3.5 group-active:text-foreground group-hover:text-foreground"
        />
        <Text className="text-muted-foreground group-active:text-foreground group-hover:text-foreground">
          Search...
        </Text>
        {Platform.OS === "web" ? (
          <Kbd className="ml-auto bg-transparent">⌘K</Kbd>
        ) : null}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onPress={() => {
          setOpen(true);
        }}
        accessibilityLabel="Jump to pages, components, and docs"
        className={cn("md:hidden", className)}
      >
        <Icon
          as={SearchIcon}
          size={16}
        />
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={handleOpenChange}
        title="Search..."
        description="Jump to pages, components, and docs"
        showCloseButton={false}
      >
        <CommandInput
          placeholder="Search..."
          value={search}
          onChangeText={setSearch}
          autoFocus={Platform.OS === "web"}
          className="h-10 border-none text-sm"
        />
        <CommandList>
          {filteredNavigation.length === 0 ? (
            <CommandEmpty className="gap-1.5 py-8">
              <Icon
                as={FileText}
                className="size-5 opacity-40"
              />
              <Text className="text-muted-foreground text-sm">
                No results found
              </Text>
            </CommandEmpty>
          ) : (
            filteredNavigation.map((group) => (
              <CommandGroup
                key={group.title}
                heading={group.title}
              >
                {group.items.map((item) => (
                  <CommandItem
                    key={`${group.title}-${item.title}`}
                    onSelect={() => {
                      handleSelect(item.href);
                    }}
                  >
                    <Icon
                      as={item.icon}
                      className="text-muted-foreground size-4"
                    />
                    <Text className="text-sm">{item.title}</Text>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))
          )}
        </CommandList>
        {Platform.OS === "web" ? (
          <View className="border-border flex flex-row items-center justify-end border-t p-3">
            <View className="flex flex-row items-baseline gap-1.5">
              <Kbd>esc</Kbd>
              <Text className="text-muted-foreground/80 text-xs">close</Text>
            </View>
          </View>
        ) : null}
      </CommandDialog>
    </>
  );
}
