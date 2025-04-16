export class ShadowBridge {
  mounted = false;
  shadowRoot: ShadowRoot;

  constructor(shadowRoot: ShadowRoot) {
    this.shadowRoot = shadowRoot;
  }

  mount(initProps: any): void {
    console.log('mount', initProps);
  }
  update(nextProps: any): void {
    console.log('update', nextProps);
  }
  unmount(): void {
    console.log('unmount');
  }
}
