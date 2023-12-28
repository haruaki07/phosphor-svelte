<img src="./meta/phosphor-mark-tight-yellow.png" width="128" align="right" />

# phosphor-svelte

Phosphor is a flexible icon family for interfaces, diagrams, presentations — whatever, really. More icons at [phosphoricons.com](https://phosphoricons.com).

[![npm](https://img.shields.io/npm/v/phosphor-svelte)](https://npm.im/phosphor-svelte)

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
  import { Horse, Heart } from "phosphor-svelte"
  // or
  import Cube from "phosphor-svelte/lib/Cube" // Recommended for faster compiling
</script>

<Horse />
<Heart color="#AE2983" weight="fill" size="{32}" />
<Cube color="teal" weight="duotone" />
```

> [!WARNING]
> You might encounter slower compilation when importing phosphor-svelte icons using named exports (`import { X } from "phosphor-svelte"`).
> This is caused by the [dependency pre-bundling](https://vitejs.dev/guide/dep-pre-bundling.html#dependency-pre-bundling).
> I've created a preprocessor as a workaround, please read the [Import Optimizer](#import-optimizer-experimental) section.

### Props

- **color?**: `string` – Icon stroke/fill color. Can be any CSS color string, including `hex`, `rgb`, `rgba`, `hsl`, `hsla`, named colors, or the special `currentColor` variable.
- **size?**: `number | string` – Icon height & width. As with standard React elements, this can be a number, or a string with units in `px`, `%`, `em`, `rem`, `pt`, `cm`, `mm`, `in`.
- **weight?**: `"thin" | "light" | "regular" | "bold" | "fill" | "duotone"` – Icon weight/style. Can also be used, for example, to "toggle" an icon's state: a rating component could use Stars with `weight="regular"` to denote an empty star, and `weight="fill"` to denote a filled star.
- **mirrored?**: `boolean` – Flip the icon horizontally. Can be useful in RTL languages where normal icon orientation is not appropriate.

### Context

Apply default style to all icons. Create an IconContext at the root of the app (or anywhere above the icons in the tree) and pass in a configuration object with props to be applied by default to all icons inside context:

```html
<script>
  import IconContext from "phosphor-svelte/lib/IconContext";
  // or
  // import { IconContext } from "phosphor-svelte";

  import Cube from "phosphor-svelte/lib/Cube";
  import Horse from "phosphor-svelte/lib/Horse";
  import Heart from "phosphor-svelte/lib/Heart";
</script>

<IconContext
  values={{ color: 'limegreen', size: 32, mirrored: false, weight: 'bold' }}>
  <Horse /> <!-- I'm lime-green, 32px, and bold! -->
  <Heart /> <!-- Me too! -->
  <Cube color="red" /> <!-- red -->
</IconContext>
```

### Composability

<img src="./meta/cube-rotate.svg" width="128" align="right" />

Components can accept arbitrary SVG elements as children, so long as they are valid children of the `<svg>` element. This can be used to modify an icon with background layers or shapes, filters, animations and more. The children will be placed _below_ the normal icon contents.

The following will cause the Cube icon to rotate and pulse:

```html
<Cube color="darkorchid" weight="duotone">
  <animate
    attributeName="opacity"
    values="0;1;0"
    dur="4s"
    repeatCount="indefinite"
  ></animate>
  <animateTransform
    attributeName="transform"
    attributeType="XML"
    type="rotate"
    dur="5s"
    from="0 0 0"
    to="360 0 0"
    repeatCount="indefinite"
  ></animateTransform>
</Cube>
```

> **Note:** The coordinate space of slotted elements is relative to the contents of the icon `viewBox`, which is a 256x256 square. Only [valid SVG elements](https://developer.mozilla.org/en-US/docs/Web/SVG/Element#SVG_elements_by_category) will be rendered.

### Import Optimizer (Experimental)

It is a simple Svelte preprocessor that rewrite imports named export from phosphor-svelte into their source path. This will speed up compile times during development.

> [!WARNING]  
> Please note that this preprocessor is still experimental and has only been tested on the latest version of Svelte+Vite and SvelteKit.
> Errors and bugs are to be expected.
> Any feedbacks are welcome.

#### Usage

First exclude phosphor-svelte from being pre-bundled by adding `exlude` in `optimizeDeps` on your Vite config.

```javascript
// vite.config.js

export default defineConfig({
  plugins: [svelte()],
  optimizeDeps: {
    exclude: ["phosphor-svelte"],
  },
})
```

Then add the preprocessor into your `svelte.config.js` file before the `vitePreprocess()`.

```javascript
// svelte.config.js

import { phosphorSvelteOptimize } from "phosphor-svelte/preprocessor"

export default {
  preprocess: [phosphorSvelteOptimize(), vitePreprocess()],
}
```

So, when you import like this:

```html
<script>
  import { Cube, Heart, Horse } from "phosphor-svelte"
</script>
```

It will be rewritten into this:

```html
<script>
  import Cube from "phosphor-svelte/lib/Cube"
  import Heart from "phosphor-svelte/lib/Heart"
  import Horse from "phosphor-svelte/lib/Horse"
</script>
```

## License

MIT © [Phosphor Icons](https://github.com/phosphor-icons)

## Knowledge

- [Phosphor React](https://github.com/phosphor-icons/phosphor-react/)
- [Carbon Icons Svelte](https://github.com/IBM/carbon-icons-svelte/)
