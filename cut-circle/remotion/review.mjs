import path from "node:path";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const frames = process.argv.slice(2).map(Number);
const outDir = path.resolve("out/review2");
fs.mkdirSync(outDir, { recursive: true });

const serveUrl = await bundle({
  entryPoint: path.resolve("src/index.ts"),
});
const composition = await selectComposition({
  serveUrl,
  id: "CutCircleLong",
});

for (const frame of frames) {
  const output = path.join(outDir, `f${String(frame).padStart(4, "0")}.png`);
  await renderStill({
    composition,
    serveUrl,
    output,
    frame,
    imageFormat: "png",
    chromiumOptions: { gl: "angle" },
  });
  console.log(output);
}

if (frames.length > 1) {
  const cols = Math.ceil(Math.sqrt(frames.length));
  const tileW = Math.floor(1280 / cols);
  const tileH = Math.round((tileW * 9) / 16);
  const inputs = frames.flatMap((frame) => [
    "-i",
    path.join(outDir, `f${String(frame).padStart(4, "0")}.png`),
  ]);
  const filters = frames
    .map((_, i) => `[${i}:v]scale=${tileW}:${tileH}[v${i}]`)
    .join(";");
  const layout = frames
    .map(
      (_, i) =>
        `${(i % cols) * tileW}_${Math.floor(i / cols) * tileH}`,
    )
    .join("|");
  const sheet = path.join(outDir, `sheet-${frames[0]}-${frames.at(-1)}.jpg`);
  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-loglevel",
      "error",
      ...inputs,
      "-filter_complex",
      `${filters};${frames.map((_, i) => `[v${i}]`).join("")}xstack=inputs=${frames.length}:layout=${layout}`,
      "-q:v",
      "3",
      sheet,
    ],
    { stdio: "inherit" },
  );
  console.log(sheet);
}
