import { ShadowBridge } from '@shadow-bridge/core';
import { ComponentType, useEffect, useState } from 'react';
import { createRoot, Root } from 'react-dom/client';

export function wrap(Comp: ComponentType<any>) {
  return class ReactShadowBridge extends ShadowBridge {
    rootElement: HTMLElement | null = null;
    reactRoot: Root | null = null;

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

      this.rootElement = document.createElement('div');
      this.rootElement.className = 'shadow-bridge-react-root';
      this.shadowRoot.appendChild(this.rootElement);
      this.reactRoot = createRoot(this.rootElement);
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
