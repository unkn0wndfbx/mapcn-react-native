import { StandalonePopupExample } from "../Common/Examples/Popup/Standalone";

import { Text } from "@/atoms/Text";
import { getExampleSource } from "@/lib/Docs/ExampleSource";
import { getPreviewImages } from "@/lib/Docs/PreviewImages";
import { ComponentPreview } from "@/molecules/ComponentPreview";
import { DocsCode } from "@/molecules/DocsCode";
import { DocsNote } from "@/molecules/DocsNote";
import { DocsSection } from "@/molecules/DocsSection";
import { DocsPageLayout } from "@/templates/DocsPageLayout";

export function PopupsPage() {
  const standalonePopupPreview = getPreviewImages("standalone-popup");
  const popupSource = getExampleSource("standalone-popup-example.tsx");

  return (
    <DocsPageLayout
      title="Standalone Popups"
      description="Display popups anywhere on the map without markers."
      prev={{ title: "Markers", href: "/docs/markers" }}
      next={{ title: "Routes", href: "/docs/routes" }}
      toc={[{ title: "Basic Example", slug: "basic-example" }]}
    >
      <DocsSection>
        <Text className="leading-7">
          Use <DocsCode>MapPopup</DocsCode> to display a popup at any location
          on the map. Unlike <DocsCode>MarkerPopup</DocsCode>, standalone popups
          are not attached to visible markers and can be controlled
          programmatically.
        </Text>
        <DocsNote>
          <Text className="font-medium">Native:</Text>{" "}
          <DocsCode>MapPopup</DocsCode> is implemented as a marker with an
          attached <DocsCode>MarkerPopup</DocsCode>. Set{" "}
          <DocsCode>closeOnClick={false}</DocsCode> when you need to dismiss the
          popup only from your own UI.
        </DocsNote>
      </DocsSection>

      <DocsSection title="Basic Example">
        <ComponentPreview
          code={popupSource}
          previewImage={standalonePopupPreview.light}
          previewImageDark={standalonePopupPreview.dark}
        >
          <StandalonePopupExample />
        </ComponentPreview>
      </DocsSection>
    </DocsPageLayout>
  );
}
