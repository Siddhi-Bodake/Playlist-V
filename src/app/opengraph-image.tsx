import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = site.social.ogTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// One of the real mood photos as the backdrop, so a shared link actually
// looks like this site rather than a generic text-on-gradient card. No
// custom webfont here (see app-icon.tsx) — Satori has to fetch a fallback
// font for any glyph outside its built-in set, which is slow/unreliable for
// an image regenerated per share; plain bold Latin needs no such fetch.
export default async function OpengraphImage() {
  let backgroundSrc: string | null = null;
  try {
    const bytes = await readFile(
      join(process.cwd(), "public/backgrounds/silent-2-beach-sunset.jpg")
    );
    backgroundSrc = `data:image/jpeg;base64,${bytes.toString("base64")}`;
  } catch {
    backgroundSrc = null;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(135deg, #1a1030 0%, #3a1531 55%, #5c1f3a 100%)",
        }}
      >
        {backgroundSrc && (
          <img
            src={backgroundSrc}
            alt=""
            width={size.width}
            height={size.height}
            style={{ position: "absolute", inset: 0, objectFit: "cover" }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(10,6,18,0.25) 0%, rgba(10,6,18,0.8) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            padding: "0 90px",
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", fontSize: 76, fontWeight: 800, color: "#ffffff", letterSpacing: -1 }}>
            Visshuu Ki Playlist
          </div>
          <div style={{ display: "flex", marginTop: 22, fontSize: 30, color: "rgba(255,255,255,0.78)" }}>
            {site.social.ogDescription}
          </div>
        </div>
      </div>
    ),
    size
  );
}
