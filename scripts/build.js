import fs from "fs-extra";
import logUpdate from "log-update";
import pMap, { pMapSkip } from "p-map";
import path from "path";
import { componentTemplate, definitionsTemplate } from "./template.js";
import { generateIconName, getIcons, getWeights, readSVG } from "./utils.js";

const isTTY = process.stdout.isTTY;
const __dirname = new URL(".", import.meta.url).pathname;

const rootDir = path.resolve(__dirname, "..");
const outputDir = path.join(rootDir, "lib");
const assetsDir = path.join(rootDir, "phosphor-icons", "assets");

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
async function generateComponents(icon, weightVariants) {
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

    await fs.ensureDir(`./lib/${componentName}`);
    await fs.writeFile(
      `./lib/${componentName}/${componentName}.svelte`,
      componentString
    );
    await fs.writeFile(
      `./lib/${componentName}/index.js`,
      `import ${componentName} from "./${componentName}.svelte"\nexport default ${componentName};`
    );
    await fs.writeFile(
      `lib/${componentName}/index.d.ts`,
      `export { ${componentName} as default } from "../";\n`
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

async function main() {
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

  const indexString = components.map(
    (cmp) => `export { default as ${cmp.name} } from './${cmp.name}';`
  );
  indexString.unshift(
    "export { default as IconContext } from './IconContext';\n"
  );

  const definitionsString = definitionsTemplate(components);

  await fs.writeFile("./lib/index.js", indexString.join("\n"));
  await fs.writeFile("./lib/index.d.ts", definitionsString);

  if (isTTY) {
    logUpdate.clear();
    logUpdate.done();
  }

  const passes = components.length;
  console.log(`✔ ${passes} component${passes > 1 ? "s" : ""} generated`);
}

main();
