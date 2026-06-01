import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const COMPONENTS_DIR = path.join(process.cwd(), "ai-components");

// Ensure directory exists
if (!fs.existsSync(COMPONENTS_DIR)) {
  fs.mkdirSync(COMPONENTS_DIR, { recursive: true });
}

export async function GET() {
  try {
    if (!fs.existsSync(COMPONENTS_DIR)) {
      return NextResponse.json({ components: [] });
    }
    const files = fs
      .readdirSync(COMPONENTS_DIR)
      .filter((file) => file.endsWith(".json"));
    const components = files
      .map((file) => {
        try {
          const content = fs.readFileSync(
            path.join(COMPONENTS_DIR, file),
            "utf-8"
          );
          return JSON.parse(content);
        } catch (e) {
          console.error(`Failed to parse ${file}`, e);
          return null;
        }
      })
      .filter(Boolean);

    // Sort by most recently created/modified if possible, or just return list
    return NextResponse.json({ components });
  } catch (error) {
    console.error("Error loading AI components:", error);
    return NextResponse.json(
      { error: "Failed to load components" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const component = await req.json();
    if (!component || !component.id) {
      return NextResponse.json(
        { error: "Invalid component data" },
        { status: 400 }
      );
    }

    const filePath = path.join(COMPONENTS_DIR, `${component.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(component, null, 2));

    return NextResponse.json({
      success: true,
      filename: `${component.id}.json`,
    });
  } catch (error) {
    console.error("Error saving AI component:", error);
    return NextResponse.json(
      { error: "Failed to save component" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing component ID" },
        { status: 400 }
      );
    }

    const filePath = path.join(COMPONENTS_DIR, `${id}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return NextResponse.json({ success: true });
    } else {
      // It might have been deleted already or never saved, which is fine
      return NextResponse.json({
        success: true,
        message: "File not found, assuming deleted",
      });
    }
  } catch (error) {
    console.error("Error deleting AI component:", error);
    return NextResponse.json(
      { error: "Failed to delete component" },
      { status: 500 }
    );
  }
}
