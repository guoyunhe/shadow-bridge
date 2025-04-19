import { ShadowBridge } from '@shadow-bridge/core';
import { Component, ComponentType, render } from 'preact';

export function wrap(Comp: ComponentType<any>) {
  return class ReactShadowBridge extends ShadowBridge {
    rootElement: HTMLElement | null = null;

    mount(initProps: any) {
      const that = this;

      class Wrapper extends Component {
        state = {
          ...initProps,
        };

        handleUpdate = (e: Event) => {
          this.setState({ ...(e as CustomEvent).detail });
        };

        componentDidMount() {
          that.addEventListener('update', this.handleUpdate);
        }

        componentWillUnmount(): void {
          that.removeEventListener('update', this.handleUpdate);
        }

        render() {
          return <Comp shadowRoot={that.shadowRoot} {...this.state} />;
        }
      }

      this.rootElement = document.createElement('div');
      this.rootElement.className = 'shadow-bridge-react-root';
      this.shadowRoot.appendChild(this.rootElement);
      render(<Wrapper />, this.rootElement!);
      this.mounted = true;
    }

    update(nextProps: any) {
      this.dispatchEvent(new CustomEvent('update', { detail: nextProps }));
    }

    unmount() {
      if (this.rootElement) {
        // Preact's way of unmount
        render(null, this.rootElement);
        this.rootElement.remove();
      }
      this.mounted = false;
    }
  };
}
