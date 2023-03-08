import fs from "fs-extra";
import { join } from "path";
import htmlMinifierTerser from "html-minifier-terser";

const { minify } = htmlMinifierTerser;

export const ASSETS_PATH = "core/assets";

export function getWeights() {
  return fs
    .readdirSync(ASSETS_PATH, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

export function generateIconName(str) {
  const name = str.split("-");
  return name
    .map((substr) => substr.replace(/^\w/, (c) => c.toUpperCase()))
    .join("");
}

export function readSVG(filepath) {
  return minify(
    fs
      .readFileSync(filepath, "utf-8")
      .replace(/<svg.*?>/g, "")
      .replace(/<\/svg>/g, ""),
    {
      collapseWhitespace: true,
      removeEmptyAttributes: true,
      removeRedundantAttributes: true,
      keepClosingSlash: true,
    }
  );
}

export function getIcons(weight) {
  return fs.readdirSync(join(ASSETS_PATH, weight));
}
