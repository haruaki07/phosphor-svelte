const fs = require("fs-extra");
const path = require("path");
const minify = require("html-minifier-terser").minify;

const ASSETS_PATH = "phosphor-icons/assets";

function getWeights() {
  return fs
    .readdirSync(ASSETS_PATH, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

function generateIconName(str) {
  const name = str.split("-");
  return name
    .map((substr) => substr.replace(/^\w/, (c) => c.toUpperCase()))
    .join("");
}

function readSVG(filepath) {
  return minify(
    fs
      .readFileSync(filepath, "utf-8")
      .replace(/<svg.*/g, "")
      .replace(/<\/svg>/g, ""),
    {
      collapseWhitespace: true,
      removeEmptyAttributes: true,
      removeRedundantAttributes: true,
      keepClosingSlash: true,
    }
  );
}

function getIcons(weight) {
  return fs.readdirSync(path.join(ASSETS_PATH, weight));
}

module.exports = {
  readSVG,
  generateIconName,
  getWeights,
  getIcons,
  ASSETS_PATH,
};
