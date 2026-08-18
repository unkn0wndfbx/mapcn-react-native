import fs from "fs";
import path from "path";

const REGISTRY_DIR = path.join(process.cwd(), "public", "r");

const IMPORT_REPLACEMENTS: Record<string, string> = {
  "@/registry/map": "@/atoms/Map",
  "@/lib/utils": "@/lib/Utils/Cn",
  "@/lib/use-world-data": "@/hooks/WorldData",
};

interface RegistryFile {
  path: string;
  content?: string;
  type?: string;
  target?: string;
}

interface RegistryItem {
  files?: RegistryFile[];
}

interface RegistryData {
  files?: RegistryFile[];
  items?: RegistryItem[];
}

function fixContent(content: string): string {
  let next = content;

  for (const [from, to] of Object.entries(IMPORT_REPLACEMENTS)) {
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    next = next.replace(new RegExp(escaped, "g"), to);
  }

  return next;
}

function processFile(filePath: string): void {
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw) as RegistryData;
  let changed = false;

  const fixFiles = (files: RegistryFile[]) => {
    for (const file of files) {
      if (!file.content) {
        continue;
      }

      const updated = fixContent(file.content);
      if (updated !== file.content) {
        file.content = updated;
        changed = true;
      }
    }
  };

  if (Array.isArray(data.files)) {
    fixFiles(data.files);
  }

  if (Array.isArray(data.items)) {
    for (const item of data.items) {
      if (Array.isArray(item.files)) {
        fixFiles(item.files);
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
    console.log("Fixed imports in:", path.relative(process.cwd(), filePath));
  }
}

const files = fs.readdirSync(REGISTRY_DIR).filter((f) => f.endsWith(".json"));
for (const file of files) {
  processFile(path.join(REGISTRY_DIR, file));
}
