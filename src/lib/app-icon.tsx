/**
 * Shared visual for every generated app icon (favicon, apple-touch-icon,
 * PWA manifest icons). One monogram, rendered at whatever size is asked for.
 *
 * Deliberately plain ASCII ("V") rather than a heart glyph — Satori (used by
 * next/og's ImageResponse) has to fetch a fallback font for glyphs outside
 * its built-in Latin set, which is slow and can fail without network access
 * at build/runtime. Plain letters render instantly with no extra fetch.
 */
export function appIconElement(size: number) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1a1030 0%, #3a1531 55%, #5c1f3a 100%)",
        color: "#f3d9e6",
      }}
    >
      <span style={{ fontSize: size * 0.52, lineHeight: 1 }}>V</span>
      <div
        style={{
          marginTop: size * 0.06,
          width: size * 0.22,
          height: size * 0.045,
          borderRadius: size,
          background: "#ff6fa5",
        }}
      />
    </div>
  );
}
