import { Link } from "expo-router";
import { Platform, StyleProp, View, ViewStyle } from "react-native";

import { ExamplesGrid } from "./ExamplesGrid";

import { Button } from "@/atoms/Button";
import { Text } from "@/atoms/Text";
import { AgentPrompt } from "@/molecules/AgentPrompt";
import { GetTheApp } from "@/organisms/GetTheApp";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/organisms/PageHeader";
import { ScrollPageLayout } from "@/templates/ScrollPageLayout";

export const HomePage = () => {
  return (
    <ScrollPageLayout
      lockParentScroll
      header={
        <PageHeader>
          <PageHeaderHeading>Beautiful maps, made simple</PageHeaderHeading>
          <PageHeaderDescription>
            Ready to use, customizable map components for React Native. Built on
            MapLibre. Styled with Tailwind.
          </PageHeaderDescription>

          <PageActions className="mt-5 flex-col gap-4">
            <View className="flex-row flex-wrap items-center justify-center gap-3">
              <Link
                href="/docs"
                asChild
              >
                <Button className="min-w-36 justify-center">
                  <Text>Get Started</Text>
                </Button>
              </Link>

              <Link
                href="/docs/basic-map"
                asChild
              >
                <Button
                  variant="outline"
                  className="min-w-36 justify-center"
                >
                  <Text>View Components</Text>
                </Button>
              </Link>
            </View>

            <AgentPrompt />
          </PageActions>
        </PageHeader>
      }
    >
      <View
        className="animate-fade-up animate-stagger mx-auto w-full flex-1 container"
        style={
          {
            "--stagger": 4.5,
          } as StyleProp<ViewStyle>
        }
      >
        {Platform.OS === "web" ? <GetTheApp /> : <ExamplesGrid />}
      </View>
    </ScrollPageLayout>
  );
};
