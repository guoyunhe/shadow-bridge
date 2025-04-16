# ShadowBridge

Only concept design, no implementation, yet.

- Use [ShadowRoot] to isolate styles and avoid pollution
- Use dynamic import to load ESM or UMD other than `eval()` (slow CPU and waste RAM)

## Make a ShadowBridge component

Write a React component:

```jsx
// src/foobar.jsx
import { make } from '@shadow-bridge/react';

export default function Foobar({ foo, bar }) {
  return (
    <div>
      {foo}, {bar}
    </div>
  );
}

// this special export make it shadow-bridge loadable
export const __SB__ = make(Foobar);
```

Build ESM or UMD output:

```js
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/foobar.jsx',
      formats: ['es'], // or umd
      fileName: 'foobar',
      cssFileName: 'foobar',
    },
  },
});
```

> ⚠️ Do **NOT** external react or react-dom, since we may load the component in vue or preact apps

Publish output assets to web server. You will need the full URL of css and js:

- https://example.com/assets/foobar.css
- https://example.com/assets/foobar.js

TODO:

- Preact + Vite
- React + Webpack
- Vue + Vite

## Load a ShadowBridge component

```jsx
import { load } from '@shadow-bridge/react';

const Foobar = load({
  script: 'https://example.com/assets/foobar.js',
  style: 'https://example.com/assets/foobar.css',
  loadingFallback: <div>Loading...</div>,
  failedFallback: (error, reload) => (
    <div>
      Failed to load. (Error: {error.message}) <button onClick={reload}>Retry</button>
    </div>
  ),
});

function App() {
  return (
    <div>
      <Foobar foo="Hello" bar="World" />
    </div>
  );
}
```

[ShadowRoot]: https://developer.mozilla.org/docs/Web/API/ShadowRoot
