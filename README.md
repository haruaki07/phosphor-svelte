<img src="/meta/phosphor-mark-tight-yellow.png" width="128" align="right" />

# phosphor-svelte

Phosphor is a flexible icon family for interfaces, diagrams, presentations — whatever, really. More icons at [phosphoricons.com](https://phosphoricons.com).

## Installation

```bash
yarn add --dev phosphor-svelte
```

or

```bash
npm install --save-dev phosphor-svelte
```

## Usage

```html
<script>
	import { Horse, Heart, Cube } from "phosphor-svelte";
</script>

<Horse />
<Heart color="#AE2983" weight="fill" size="{32}" />
<Cube color="teal" weight="duotone" />
```

## Props

- **color?**: `string` – Icon stroke/fill color. Can be any CSS color string, including `hex`, `rgb`, `rgba`, `hsl`, `hsla`, named colors, or the special `currentColor` variable.
- **size?**: `number | string` – Icon height & width. As with standard React elements, this can be a number, or a string with units in `px`, `%`, `em`, `rem`, `pt`, `cm`, `mm`, `in`.
- **weight?**: `"thin" | "light" | "regular" | "bold" | "fill" | "duotone"` – Icon weight/style. Can also be used, for example, to "toggle" an icon's state: a rating component could use Stars with `weight="regular"` to denote an empty star, and `weight="fill"` to denote a filled star.
- **mirrored?**: `boolean` – Flip the icon horizontally. Can be useful in RTL languages where normal icon orientation is not appropriate.

## License

MIT © [Phosphor Icons](https://github.com/phosphor-icons)
