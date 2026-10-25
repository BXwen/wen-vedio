/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);

// 'angle' composites the SVG layers on the GPU instead of the CPU raster path.
// Measured on this project: 25s -> 12s per 300 frames, and it scales with the
// layer count, so the card section benefits most. Default (swangle) is a
// software GL backend; leaving it unset is what made renders slow.
Config.setChromiumOpenGlRenderer("angle");
