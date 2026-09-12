const PREVIEW_BASE_PATH = "/images/previews";

export function getPreviewImages(name: string) {
  return {
    light: `${PREVIEW_BASE_PATH}/light/${name}.png`,
    dark: `${PREVIEW_BASE_PATH}/dark/${name}.png`,
  };
}

export function getBlockPreviewImages(blockName: string) {
  return {
    light: `${PREVIEW_BASE_PATH}/blocks/light/${blockName}.png`,
    dark: `${PREVIEW_BASE_PATH}/blocks/dark/${blockName}.png`,
  };
}
