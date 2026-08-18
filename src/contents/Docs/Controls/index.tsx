import { MapControlsExample } from "../Common/Examples/MapControls";

import { Text } from "@/atoms/Text";
import { getExampleSource } from "@/lib/Docs/ExampleSource";
import { getPreviewImages } from "@/lib/Docs/PreviewImages";
import { ComponentPreview } from "@/molecules/ComponentPreview";
import { DocsCode } from "@/molecules/DocsCode";
import { DocsNote } from "@/molecules/DocsNote";
import { DocsSection } from "@/molecules/DocsSection";
import { DocsPageLayout } from "@/templates/DocsPageLayout";

export function ControlsPage() {
  const controlsPreview = getPreviewImages("controls");
  const controlsSource = getExampleSource("map-controls-example.tsx");

  return (
    <DocsPageLayout
      title="Controls"
      description="Add interactive controls to your map for zoom, compass, location, and fullscreen."
      prev={{ title: "Map", href: "/docs/basic-map" }}
      next={{ title: "Markers", href: "/docs/markers" }}
      toc={[{ title: "Basic Example", slug: "basic-example" }]}
    >
      <DocsSection>
        <Text className="leading-7">
          The <DocsCode>MapControls</DocsCode> component provides a set of
          interactive controls that can be positioned on any corner of the map.
          Place it inside <DocsCode>Map</DocsCode> - it uses{" "}
          <DocsCode>useMap</DocsCode> for camera and viewport state.
        </Text>
        <DocsNote>
          <Text className="font-medium">Native:</Text>{" "}
          <DocsCode>showLocate</DocsCode> requests location permission via
          MapLibre&apos;s <DocsCode>LocationManager</DocsCode>.{" "}
          <DocsCode>showFullscreen</DocsCode> only renders when you pass{" "}
          <DocsCode>onFullscreenRequest</DocsCode> - wire it to your own
          full-screen UI (modal, screen navigation, etc.).
        </DocsNote>
      </DocsSection>

      <DocsSection title="Basic Example">
        <ComponentPreview
          code={controlsSource}
          previewImage={controlsPreview.light}
          previewImageDark={controlsPreview.dark}
        >
          <MapControlsExample />
        </ComponentPreview>
      </DocsSection>
    </DocsPageLayout>
  );
}
