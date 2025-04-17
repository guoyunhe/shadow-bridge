import { ShadowBridge } from '@shadow-bridge/core';
import {
  App,
  Component,
  createApp,
  defineComponent,
  getCurrentInstance,
  h,
  onBeforeUnmount,
  onMounted,
} from 'vue';

export function wrap(Comp: Component) {
  return class VueShadowBridge extends ShadowBridge {
    rootElement: HTMLDivElement | null = null;
    vueApp: App<Element> | null = null;
    props: any;

    mount(initProps: any): void {
      this.props = initProps;
      const that = this;

      const Wrap = defineComponent({
        setup() {
          const instance = getCurrentInstance();

          const update = () => {
            instance?.update();
          };

          onMounted(() => {
            that.addEventListener('update', update);
          });
          onBeforeUnmount(() => {
            that.removeEventListener('update', update);
          });
        },

        render() {
          return h(Comp, that.props);
        },
      });

      this.rootElement = document.createElement('div');
      this.rootElement.className = 'shadow-bridge-vue-root';
      this.shadowRoot.append(this.rootElement);
      this.vueApp = createApp(Wrap);
      this.vueApp.mount(this.rootElement);
      this.mounted = true;
    }

    unmount(): void {
      this.vueApp?.unmount();
      this.rootElement?.remove();
      this.mounted = false;
    }

    update(nextProps: any) {
      this.props = nextProps;
      this.dispatchEvent(new CustomEvent('update'));
    }
  };
}
