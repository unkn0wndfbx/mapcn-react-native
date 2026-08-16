import { Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Separator } from "../../atoms/Separator";
import { GitHubButton } from "../../molecules/GitHubButton";
import { Logo } from "../../molecules/Logo";
import { MainNav } from "../../molecules/MainNav";
import { CommandSearch } from "../CommandSearch";
import { MobileNav } from "../MobileNav";

import { ThemeToggle } from "@/atoms/ThemeToggle";
import { cn } from "@/lib/utils";

type HeaderProps = {
  className?: string;
};

export function Header({ className }: HeaderProps) {
  return (
    <View
      className={cn(
        "bg-background/85 supports-backdrop-filter:bg-background/70 w-full backdrop-blur",
        Platform.select({ web: "z-50" }),
        className,
      )}
    >
      <SafeAreaView edges={["top"]}>
        <View className="container flex flex-row h-14 w-full items-center gap-2">
          <MobileNav />
          <Logo className="hidden shrink-0 lg:flex" />
          <Separator
            className="bg-primary/15 ml-2.5 hidden h-4! lg:block"
            orientation="vertical"
          />
          <MainNav className="hidden lg:flex" />
          <View className="ml-auto flex flex-row items-center gap-1.5">
            <CommandSearch />
            <GitHubButton />
            <ThemeToggle />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
