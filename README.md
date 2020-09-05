### react-use-zoom

Nearly native image scaling (:iphone:/:computer:), rich in functionality. It is extremely easy to use. it's built by comparing scaling features existing in 'Gallery' apps for smartphones. It doesn't seem slow, but it doesn't seem ridiculously fast either, to be honest, I didn't measure performance. This will also boost your mobile app and website user experience.

[Preview](https://svelte.dev/repl/1b2917a84eca46868fee174dd8a81218?version=3.24.1)

<p align="center">
  <img width="257" src="https://res.cloudinary.com/dxv8p5zck/image/upload/v1599324008/zoom-software.gif"/>
</p>

<p>
  <a href="https://www.npmjs.com/package/svelte-zoom"><img  src="https://img.shields.io/npm/v/svelte-zoom?style=for-the-badge"/></a>

<a href="https://bundlephobia.com/result?p=svelte-zoom@latest">
  <img src="https://img.shields.io/bundlephobia/min/svelte-zoom?style=for-the-badge"/>
</a>
  
<a href="https://bundlephobia.com/result?p=svelte-zoom@latest">
  <img src="https://img.shields.io/bundlephobia/minzip/svelte-zoom?style=for-the-badge"/>
</a>

</p>

###### Note

> The image must take up the entire width and height of the page

### Features

---

#### Mobile

- Pinch
- Pan
- Touch move

#### Desktop

- Mouse wheel
- Mouse move

#### General

- Maximum scaling value calculated automatically
- The image is limited by its aspect ratio
- It is lightweight
- It feels "native"

### Installation

###### via NPM

```
npm i svelte-zoom
```

### Usage

```svelte
<Zoom src="URL" alt="..." />

```

### Manual zooming

If for some reason you want to zoom in by calling the function manually. You can use the `zoomIn` and `zoomOut` functions. It will scale in the center of the image.

```svelte
<script>
import Zoom from 'svelte-zoom'

let zoom;
</script>
<Zoom src="..." alt="..." bind:this={zoom} />

<button on:click={() => zoom.zoomIn()}>Zoom in</button>
<button on:click={() => zoom.zoomOut()}>Zoom out</button>
```
