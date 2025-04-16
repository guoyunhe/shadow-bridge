import { ShadowBridge } from '@shadow-bridge/core';
import { ComponentType, useEffect, useState } from 'react';
import { createRoot, Root } from 'react-dom/client';

export function wrap(Comp: ComponentType<any>) {
  return class ReactShadowBridge extends ShadowBridge {
    reactRoot: Root;
    eventTarget = new EventTarget();

    constructor(shadowRoot: ShadowRoot) {
      super(shadowRoot);
      const rootElement = document.createElement('div');
      rootElement.className = 'shadow-bridge-react-root';
      shadowRoot.appendChild(rootElement);
      this.reactRoot = createRoot(rootElement);
    }

    mount(initProps: any) {
      const { eventTarget, shadowRoot } = this;

      const Wrapper = () => {
        const [props, setProps] = useState(initProps);
        useEffect(() => {
          const handleUpdate = (e: Event) => {
            setProps((e as CustomEvent).detail);
            console.log((e as CustomEvent).detail);
          };
          eventTarget.addEventListener('update', handleUpdate);
          return () => {
            eventTarget.removeEventListener('update', handleUpdate);
          };
        }, []);
        return <Comp shadowRoot={shadowRoot} {...props} />;
      };

      this.reactRoot.render(<Wrapper />);
      this.mounted = true;
    }

    update(nextProps: any) {
      this.eventTarget.dispatchEvent(new CustomEvent('update', { detail: nextProps }));
    }

    unmount() {
      this.reactRoot.unmount();
      this.mounted = false;
    }
  };
}
