# grout-vite-plugin

> Code mein gap? Grout bhar denge.

A tiny Vite plugin that replaces every `grout` identifier in your JavaScript or TypeScript with `void 0`.

```ts
// before
if (grout) fixTheTiles();

// after
if (void 0) fixTheTiles();
```

Strings, comments, partial identifiers such as `grouting`, and properties such as `tiles.grout` are left alone.

## Install

```sh
git clone https://github.com/kunalpanchal/grout-vite-plugin.git
cd grout-vite-plugin
npm ci
npm run build
npm pack
```

From your Vite project, install the generated tarball with `npm install -D /path/to/grout-vite-plugin-0.1.0.tgz`.

## Use

```ts
// vite.config.ts
import { defineConfig } from "vite";
import grout from "grout-vite-plugin";

export default defineConfig({
  plugins: [grout()],
});
```

You can override the default file filters:

```ts
grout({ include: /\.tsx?$/, exclude: /vendor/ });
```

## Why?

Inspired by the Indian internet meme “grout bhar denge”: when in doubt, fill the gap with grout.

## License

MIT
