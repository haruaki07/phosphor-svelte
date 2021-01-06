const fs = require("fs-extra");
const path = require("path");
const minify = require("html-minifier-terser").minify;

function getWeights() {
  return fs
    .readdirSync("assets", { withFileTypes: true })
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
      .replace(/^.*<\?xml.*/g, "")
      .replace(/<svg.*/g, "")
      .replace(/<\/svg>/g, "")
      .replace(
        /<rect width="25[\d,\.]+" height="25[\d,\.]+" fill="none".*\/>/g,
        ""
      )
      .replace(/<title.*/, ""),
    {
      collapseWhitespace: true,
      removeEmptyAttributes: true,
      removeRedundantAttributes: true,
      keepClosingSlash: true,
    }
  );
}

function getIcons(weight) {
  return fs.readdirSync(path.join("assets", weight));
}

module.exports = {
  readSVG,
  generateIconName,
  getWeights,
  getIcons,
};
