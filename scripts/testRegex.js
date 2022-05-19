import { readFileSync } from "fs";
import { getWeights, getIcons, ASSETS_PATH } from "../src/utils";
import { resolve } from "path";

(() => {
  const weights = getWeights();
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
    const iconsOfWeight = getIcons(weight);
    for (const iconFileName of iconsOfWeight) {
      const rawSVG = readFileSync(
        resolve(ASSETS_PATH, weight, iconFileName),
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
