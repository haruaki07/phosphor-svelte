import fs from "fs-extra";
import { minify } from "html-minifier-terser";
import { join } from "path";

/**
 * @param {string} assetsDir
 * @returns
 */
export async function getWeights(assetsDir) {
  const dirents = await fs.readdir(assetsDir, { withFileTypes: true });

  return dirents
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

/**
 *
 * @param {string} str
 * @returns
 */
export function generateIconName(str) {
  const name = str.split("-");
  return name
    .map((substr) => substr.replace(/^\w/, (c) => c.toUpperCase()))
    .join("");
}

/**
 *
 * @param {string} filepath
 * @returns
 */
export async function readSVG(filepath) {
  const svg = await fs.readFile(filepath, "utf-8");

  // prettier-ignore
  return minify(
    svg
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

/**
 *
 * @param {string} assetsDir
 * @param {string} weight
 * @returns
 */
export async function getIcons(assetsDir, weight) {
  return fs.readdir(join(assetsDir, weight));
}

export function getCurrentDirname() {
  return new URL(".", import.meta.url).pathname;
}
