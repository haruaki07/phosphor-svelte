const fs = require("fs-extra");
const path = require("path");
const logUpdate = require("log-update");
const chalk = require("chalk");

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
	return fs
		.readFileSync(filepath, "utf-8")
		.replace(/^.*<\?xml.*/g, "")
		.replace(/<svg.*/g, "")
		.replace(/<\/svg>/g, "")
		.replace(
			/<rect width="25[\d,\.]+" height="25[\d,\.]+" fill="none".*\/>/g,
			""
		)
		.replace(/<title.*/, "");
}

function getIcons(weight) {
	return fs.readdirSync(path.join("assets", weight));
}

(() => {
	let passes = 0;
	const icons = [];
	const weights = getWeights();
	const weightsWithoutRegular = weights.filter((w) => w !== "regular");
	const regulars = getIcons("regular");

	Promise.all(
		regulars.map((reg) => {
			logUpdate(`Generating ${reg}`);
			const types = [];
			const regular = reg.slice(0, -4); // activity

			weightsWithoutRegular.forEach((weight) => {
				getIcons(weight).forEach((file) => {
					// activity-bold.svg -> ['activity', 'bold']
					const filename = file.slice(0, -4).split("-");
					if (filename.slice(0, -1).join("-") === regular) {
						types.push({
							weight: filename.pop(),
							path: readSVG(path.join("assets", weight, file)),
						});
					}
				});
			});

			types.push({
				weight: "regular",
				path: readSVG(path.join("assets", "regular", reg)),
			});

			icons.push({ name: regular, weights: types });

			let componentString = `<!-- GENERATED FILE -->
<script>
	export let weight = "regular";
	export let color = "currentColor";
	export let size = "1em";
	export let mirrored = false;
</script>

<svg 
	xmlns="http://www.w3.org/2000/svg" 
	width={size} 
	height={size}
	fill={color} 
	transform={mirrored ? "scale(-1, 1)" : undefined} 
	viewBox="0 0 256 256">
	`;

			types.forEach(({ weight, path }, i) => {
				const cond =
					i === 0
						? `{#if weight === "${weight}"}`
						: `{:else if weight === "${weight}"}`;
				componentString += `${cond}
		${path.trim()}
	`;
			});

			componentString += `{:else}
		{(console.error('Unsupported icon weight. Choose from "thin", "light", "regular", "bold", "fill", or "duotone".'), "")}
	{/if}
</svg>`;

			const filepath = `./src/icons/${generateIconName(regular)}.svelte`;
			fs.ensureDirSync(path.dirname(filepath));
			fs.writeFileSync(filepath, componentString, "utf8");

			passes++;
		})
	).then(() => {
		logUpdate.clear();
		logUpdate.done();
		const index = icons
			.map(
				(icon) =>
					`export { default as ${generateIconName(
						icon.name
					)} } from './icons/${generateIconName(icon.name)}.svelte'`
			)
			.join("\n");
		chalk.green("generated exports");
		return fs.writeFileSync("./src/index.js", index, "utf8");
	});
	chalk.green(
		`${passes} component${passes > 1 ? "s" : ""} of ${icons.length
		} icons generated`
	);
})();
