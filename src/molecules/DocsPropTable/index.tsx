import { Platform, View } from "react-native";

import { Text } from "@/atoms/Text";
import { cn } from "@/lib/Utils/Cn";
import { DocsCode } from "@/molecules/DocsCode";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/molecules/Table";

interface DocsPropTableProps {
  props: {
    name: string;
    type: string;
    default?: string;
    description: string;
  }[];
}

export function DocsPropTable({ props }: DocsPropTableProps) {
  if (Platform.OS === "web") {
    return (
      <View className="my-6 overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface">
              <TableHead className="h-10 px-4 text-xs font-medium">
                Prop
              </TableHead>
              <TableHead className="h-10 px-4 text-xs font-medium">
                Type
              </TableHead>
              <TableHead className="h-10 px-4 text-xs font-medium">
                Default
              </TableHead>
              <TableHead className="h-10 px-4 text-xs font-medium">
                Description
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.map((prop) => (
              <TableRow key={prop.name}>
                <TableCell className="px-4 py-3 align-top">
                  <DocsCode className="text-[13px]">{prop.name}</DocsCode>
                </TableCell>
                <TableCell className="px-4 py-3 align-top whitespace-normal">
                  <DocsCode className="text-foreground/70 text-xs">
                    {prop.type}
                  </DocsCode>
                </TableCell>
                <TableCell className="px-4 py-3 align-top">
                  <DocsCode className="text-foreground/70 text-xs whitespace-normal">
                    {prop.default ?? "-"}
                  </DocsCode>
                </TableCell>
                <TableCell className="text-foreground/70 min-w-45 px-4 py-3 text-sm leading-relaxed whitespace-normal">
                  {prop.description}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </View>
    );
  }

  return (
    <View className="my-6 overflow-hidden rounded-lg border border-border">
      {props.map((prop, index) => (
        <View
          key={prop.name}
          className={cn(
            "gap-3 px-4 py-3",
            index < props.length - 1 && "border-b border-border",
          )}
        >
          <View className="flex-row flex-wrap items-center gap-2">
            <Text className="text-muted-foreground text-xs font-medium">
              Prop
            </Text>
            <DocsCode className="text-[13px]">{prop.name}</DocsCode>
          </View>
          <View className="gap-1">
            <Text className="text-muted-foreground text-xs font-medium">
              Type
            </Text>
            <DocsCode className="text-foreground/70 text-xs">
              {prop.type}
            </DocsCode>
          </View>
          <View className="gap-1">
            <Text className="text-muted-foreground text-xs font-medium">
              Default
            </Text>
            <DocsCode className="text-foreground/70 text-xs">
              {prop.default ?? "-"}
            </DocsCode>
          </View>
          <View className="gap-1">
            <Text className="text-muted-foreground text-xs font-medium">
              Description
            </Text>
            <Text className="text-foreground/70 text-sm leading-relaxed">
              {prop.description}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
