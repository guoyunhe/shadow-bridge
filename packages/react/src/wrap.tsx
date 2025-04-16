import { ShadowBridge } from '@shadow-bridge/core';
import { ComponentType, useEffect, useState } from 'react';
import { createRoot, Root } from 'react-dom/client';

export function wrap(Comp: ComponentType<any>) {
  return class ReactShadowBridge extends ShadowBridge {
    rootElement: HTMLElement | null = null;
    reactRoot: Root | null = null;
    eventTarget = new EventTarget();

    mount(initProps: any) {
      const that = this;

      const Wrapper = () => {
        const [props, setProps] = useState(initProps);
        useEffect(() => {
          const handleUpdate = (e: Event) => {
            setProps((e as CustomEvent).detail);
          };
          that.addEventListener('update', handleUpdate);
          return () => {
            that.removeEventListener('update', handleUpdate);
          };
        }, []);
        return <Comp shadowRoot={that.shadowRoot} {...props} />;
      };

      const rootElement = document.createElement('div');
      rootElement.className = 'shadow-bridge-react-root';
      this.shadowRoot.appendChild(rootElement);
      this.reactRoot = createRoot(rootElement);
      this.reactRoot.render(<Wrapper />);
      this.mounted = true;
    }

    update(nextProps: any) {
      this.dispatchEvent(new CustomEvent('update', { detail: nextProps }));
    }

    unmount() {
      this.reactRoot?.unmount();
      this.rootElement?.remove();
      this.mounted = false;
    }
  };
}
