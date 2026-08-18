import { StyleProp, View, ViewStyle } from "react-native";

import { getAllBlocks } from "@/lib/Registry/Blocks";
import { BlockDisplay } from "@/organisms/BlockDisplay";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/organisms/PageHeader";
import { ScrollPageLayout } from "@/templates/ScrollPageLayout";

export function BlocksPage() {
  const blocks = getAllBlocks();

  return (
    <ScrollPageLayout
      header={
        <PageHeader
          align="left"
          size="sm"
        >
          <PageHeaderHeading>Blocks</PageHeaderHeading>
          <PageHeaderDescription>
            Pre-built, ready-to-use map blocks. Browse, preview, and copy them
            into your app with one command.
          </PageHeaderDescription>
        </PageHeader>
      }
    >
      <View
        className="animate-fade-up animate-stagger container gap-20 pb-20"
        style={
          {
            "--stagger": 3.5,
          } as StyleProp<ViewStyle>
        }
      >
        {blocks.map((block) => (
          <BlockDisplay
            key={block.name}
            name={block.name}
          />
        ))}
      </View>
    </ScrollPageLayout>
  );
}
