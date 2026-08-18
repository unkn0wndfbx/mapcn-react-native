import { ScrollView, View } from "react-native";

import { Text } from "@/atoms/Text";
import { PageHead } from "@/molecules/PageHead";
import { Footer } from "@/organisms/Footer";

type ArticlePageLayoutProps = {
  title: string;
  description?: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
};

export function ArticlePageLayout({
  title,
  description,
  subtitle,
  children,
}: ArticlePageLayoutProps) {
  return (
    <>
      <PageHead
        title={title}
        description={description}
      />
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="flex-grow"
        showsVerticalScrollIndicator={false}
      >
        <View className="container mx-auto w-full max-w-3xl flex-1 px-4 py-10 md:py-16">
          <View className="gap-3">
            <Text className="text-foreground text-3xl font-semibold tracking-tight">
              {title}
            </Text>
            {subtitle}
          </View>

          <View className="mt-12 gap-10">{children}</View>
        </View>

        <Footer />
      </ScrollView>
    </>
  );
}
