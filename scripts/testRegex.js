import fs from "fs-extra";
import { resolve } from "path";

const { readFileSync, readdirSync } = fs;

(() => {
  const weights = readdirSync(resolve("phosphor-icons", "assets"), {
    withFileTypes: true,
  })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  let patterns = {
    xmlTag: { pattern: /^.*<\?xml.*?>/g, match: 0 },
    svgTagOpen: { pattern: /<svg.*?>/g, match: 0 },
    svgTagClose: { pattern: /<\/svg>/g, match: 0 },
    svgRectTag: {
      pattern: /<rect width="25[\d,\.]+" height="25[\d,\.]+" fill="none".*\/>/g,
      match: 0,
    },
    svgTitleTag: { pattern: /<title.*/g, match: 0 },
    hexColorCode: { pattern: /"#0+"/g, match: 0 },
  };

  for (const weight of weights) {
    const iconsOfWeight = readdirSync(
      resolve("phosphor-icons", "assets", weight)
    );
    for (const iconFileName of iconsOfWeight) {
      const rawSVG = readFileSync(
        resolve("phosphor-icons", "assets", weight, iconFileName),
        "utf-8"
      );
      for (const [patternName, { pattern }] of Object.entries(patterns)) {
        if (pattern.test(rawSVG)) {
          patterns[patternName].match++;
        }
      }
    }
  }

  const strResult = Object.entries(patterns).reduce((str, [key, { match }]) => {
    return str + `${key}: ${match}\n`;
  }, "");

  console.log(strResult);
})();
