import { ImageResponse } from "next/og";

import { brandColors } from "@/config/theme";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: brandColors.green,
          color: brandColors.gold,
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: -1,
        }}
      >
        L
      </div>
    ),
    size,
  );
}
