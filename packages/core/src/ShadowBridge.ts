export class ShadowBridge {
  constructor(private shadowRoot: ShadowRoot) {}

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
