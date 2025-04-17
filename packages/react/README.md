# @shadow-bridge/react

![Version](https://img.shields.io/npm/v/@shadow-bridge/react)
![Downloads](https://img.shields.io/npm/dw/@shadow-bridge/react)
![Bundle size](https://img.shields.io/bundlephobia/minzip/@shadow-bridge/react)

## Install

```bash
npm i -S @shadow-bridge/react
```

## Wrap a React component into a SB component

> ⚠️ Require React 18+

Write a React component:

```jsx
// src/antd.tsx
import { StyleProvider } from '@ant-design/cssinjs';
import { wrap } from '@shadow-bridge/react';
import { Button, ConfigProvider, Empty, Input, Modal } from 'antd';
import './antd.css';

export interface AntdBlockProps {
  // 💡 ShadowBridge will always pass shadowRoot prop to the component
  shadowRoot?: ShadowRoot;

  open: boolean;
  onCancel: () => void;
  onOk: () => void;
}

export function AntdBlock({ open, onCancel, onOk, shadowRoot }: AntdBlockProps) {
  return (
    <StyleProvider
      // 💡 Mount css-in-js <style> under shadowRoot
      container={shadowRoot}
    >
      <ConfigProvider
        // 💡 Mount popups (modal, message, notice, tooltip) under shadowRoot
        getPopupContainer={() => (shadowRoot as any) || document.body}
      >
        <Input placeholder="Input" />
        <Button>Button</Button>
        <Modal title="Modal" open={open} onOk={onOk} onCancel={onCancel}>
          <Empty />
        </Modal>
      </ConfigProvider>
    </StyleProvider>
  );
}

// 💡 Wrap component with ShadowBridge
export default wrap(AntdBlock);
```

Build ESM or UMD output:

```js
// vite.config.ts
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// 💡 More config options see https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: ['./src/antd.tsx'],
      // 💡 Use ESM or UMD
      formats: ['es'],
      fileName: 'antd',
    },
  },
  define: {
    // 💡 Fix `process is not defined` error thrown by React
    'process.env': {},
  },
  plugins: [react()],
  server: {
    open: true,
  },
});
```

## Load a SB component as a React component

> ⚠️ Require React 15+

```tsx
import { load } from '@shadow-bridge/react';
import { useState } from 'react';

const AntdBlock = load<any>({
  script: 'https://guoyunhe.github.io/sb-react-component-vite-example/antd.js',
  styles: ['https://guoyunhe.github.io/sb-react-component-vite-example/antd.css'],
  prefetch: true,
  loadingFallback: () => <span>Loading</span>,
  failedFallback: (error) => <span>Failed to load: {error.message}</span>,
});

export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Ant Design Modal</button>
      <AntdBlock
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        onOk={() => {
          setOpen(false);
        }}
      />
    </div>
  );
}
```

[ShadowRoot]: https://developer.mozilla.org/docs/Web/API/ShadowRoot
