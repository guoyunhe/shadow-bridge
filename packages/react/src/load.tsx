import type { ShadowBridge } from '@shadow-bridge/core';
import { prefetch as prefetchFn } from '@shadow-bridge/core';
import cn from 'classnames';
import { Component, createRef, ReactNode } from 'react';

export interface LoadOptions {
  script: string;
  styles?: string[];
  /** Prefetch script and styles before mounting */
  prefetch?: boolean;
  loadingFallback?: () => ReactNode;
  failedFallback?: (error: Error) => ReactNode;
}

export function load<Props>({
  script,
  styles = [],
  prefetch,
  loadingFallback,
  failedFallback,
}: LoadOptions) {
  if (prefetch) {
    prefetchFn([script, ...styles]);
  }

  // To support React < 16.8, we use class component here
  class Host extends Component<Props, { loading: boolean; error: Error | null }> {
    state = { loading: false, error: null };

    sb: ShadowBridge | null = null;
    rootRef = createRef<HTMLDivElement>();

    componentDidMount(): void {
      this.setState({ loading: true });

      if (!this.rootRef.current?.shadowRoot) {
        this.rootRef.current?.attachShadow({ mode: 'open' });
      }

      for (const style of styles) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = style;
        this.rootRef.current?.shadowRoot?.append(link);
      }

      // Tell webpack to not resolve script
      import(/* webpackIgnore: true */ script)
        .then(({ default: SB }) => {
          if (this.rootRef.current) {
            this.sb = new SB(this.rootRef.current.shadowRoot);
            this.sb?.mount(this.props);
          }
        })
        .catch((error) => {
          if (this.rootRef.current) {
            this.setState({ error });
          }
        })
        .finally(() => {
          if (this.rootRef.current) {
            this.setState({ loading: false });
          }
        });
    }

    componentWillUnmount(): void {
      this.sb?.unmount();
    }

    componentDidUpdate(): void {
      this.sb?.update(this.props);
    }

    render() {
      return (
        <>
          <div
            ref={this.rootRef}
            className={cn('shadow-bridge-react-host', (this.props as any).className)}
          />
          {this.state.loading && loadingFallback?.()}
          {this.state.error && failedFallback?.(this.state.error)}
        </>
      );
    }
  }

  return Host;
}
