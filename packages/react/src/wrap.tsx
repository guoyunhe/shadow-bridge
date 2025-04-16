import { ShadowBridge } from '@shadow-bridge/core';
import { ComponentType, useEffect, useState } from 'react';
import { createRoot, Root } from 'react-dom/client';

export function wrap(Comp: ComponentType<any>) {
  return class ReactShadowBridge extends ShadowBridge {
    reactRoot: Root;
    eventTarget = new EventTarget();

    constructor(shadowRoot: ShadowRoot) {
      super(shadowRoot);
      this.reactRoot = createRoot(this.shadowRoot);
    }

    mount(initProps: any) {
      const { eventTarget, shadowRoot } = this;

      const Wrapper = () => {
        const [props, setProps] = useState(initProps);
        useEffect(() => {
          const handleUpdate = (e: CustomEvent) => {
            setProps(e.detail);
          };
          eventTarget.addEventListener('update', handleUpdate);
          return () => {
            eventTarget.removeEventListener('update', handleUpdate);
          };
        }, []);
        return <Comp shadowRoot={shadowRoot} {...props} />;
      };

      this.reactRoot.render(<Wrapper />);
    }

    update(nextProps: any) {
      this.eventTarget.dispatchEvent(new CustomEvent('update', { detail: nextProps }));
    }

    unmount() {
      this.reactRoot.unmount();
    }
  };
}
