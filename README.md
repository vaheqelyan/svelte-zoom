### react-use-zoom

Nearly native image scaling (:iphone:/:computer:), rich in functionality. It is extremely easy to use. It's built on the comparison, like smartphone galleries. It doesn't seem slow, but it doesn't seem fast either. to be honest, I didn't measure performance. This will also boost your mobile app and website user experience.

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

> The image must be full width and full height

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
<Zoom src="..." alt="..." />

<script>

</script>

```

### Manual zooming

If for some reason you want to zoom in by calling the function manually. You can use the `zoomIn` and `zoomOut` functions. It will scale in the center of the image.

```markdown
<script>
import Zoom from 'svelte-zoom'

let zoom;
</script>
<Zoom src="..." alt="..." bind:this={zoom} />

<button on:click={() => zoom.zoomIn()}>Zoom in</button>
<button on:click={() => zoom.zoomOut()}>Zoom out</button>
```
