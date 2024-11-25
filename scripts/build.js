import fs from "fs-extra";
import logUpdate from "log-update";
import pMap, { pMapSkip } from "p-map";
import path from "path";
import {
  componentDefinitionTempalte,
  componentTemplate,
  definitionsTemplate,
  moduleTemplate,
} from "./template.js";
import {
  generateIconName,
  getCurrentDirname,
  getIcons,
  getWeights,
  readSVG,
} from "./utils.js";

const isTTY = process.stdout.isTTY;
const __dirname = getCurrentDirname();

const rootDir = path.resolve(__dirname, "..");
const outputDir = path.join(rootDir, "lib");
const assetsDir = path.join(rootDir, "core", "assets");

/** @type {string[]} */
let progress = [];

/** @param {string} str */
function logProgress(str) {
  if (isTTY) {
    progress.push(str);
    logUpdate(progress.join("\n"));
  } else {
    console.log(str);
  }

  return {
    done: () => {
      if (isTTY) progress = progress.filter((p) => p !== str);
    },
  };
}

/**
 *
 * @param {string} icon - icon file name, eg. activity.svg
 * @param {string[]} weightVariants - all icon weights
 */
export async function generateComponents(icon, weightVariants) {
  try {
    const p = logProgress(`Generating ${icon}...`);
    const iconName = icon.slice(0, -4); // activity.svg -> activity

    const iconWeights = await pMap(weightVariants, async (weight) => {
      let fileName = iconName;
      if (weight !== "regular") fileName += `-${weight}`;

      const svgPath = await readSVG(
        path.join(assetsDir, weight, `${fileName}.svg`)
      );

      return {
        weight,
        svgPath,
      };
    });

    let componentString = componentTemplate(iconWeights);
    let componentName = generateIconName(iconName);

    await fs.writeFile(
      path.join(outputDir, `${componentName}.svelte`),
      componentString
    );
    await fs.writeFile(
      path.join(outputDir, `${componentName}.svelte.d.ts`),
      componentDefinitionTempalte(componentName)
    );

    p.done();
    return {
      iconName: icon,
      name: componentName,
      weights: iconWeights,
    };
  } catch (e) {
    return pMapSkip;
  }
}

export async function main() {
  let concurrency = 5;

  const weights = await getWeights(assetsDir);
  const regularIcons = await getIcons(assetsDir, "regular");

  await fs.remove(outputDir);
  await fs.copy(path.join(rootDir, "src", "lib"), outputDir);

  const components = await pMap(
    regularIcons,
    (icon) => generateComponents(icon, weights),
    {
      concurrency,
    }
  );

  const moduleString = moduleTemplate(components);
  const definitionsString = definitionsTemplate(components);

  await fs.writeFile(path.join(outputDir, "index.js"), moduleString);
  await fs.writeFile(path.join(outputDir, "index.d.ts"), definitionsString);

  if (isTTY) {
    logUpdate.clear();
    logUpdate.done();
  }

  const passes = components.length;
  console.log(`✔ ${passes} component${passes > 1 ? "s" : ""} generated`);
}

if (process.env.NODE_ENV !== "test") main();
