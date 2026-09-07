import { ImageResponse } from "next/og";
import { appIconElement } from "@/lib/app-icon";

const SIZE = 192;

export async function GET() {
  return new ImageResponse(appIconElement(SIZE), { width: SIZE, height: SIZE });
}
