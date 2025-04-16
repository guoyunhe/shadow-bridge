import { ShadowBridge } from '@shadow-bridge/core';
import cn from 'classnames';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';

export interface LoadOptions {
  script: string;
  styles?: string[];
  loadingFallback?: () => ReactNode;
  failedFallback?: (error: Error) => ReactNode;
}

export function load<Props>({ script, styles, loadingFallback, failedFallback }: LoadOptions) {
  const Wrapper: FC<Props> = (props) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const sbRef = useRef<ShadowBridge>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
      setLoading(true);

      if (rootRef.current?.shadowRoot && styles) {
        for (const style of styles) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = style;
          rootRef.current.shadowRoot.append(link);
        }
      }

      import(script)
        .then(({ default: SB }) => {
          if (rootRef.current) {
            if (!rootRef.current?.shadowRoot) {
              rootRef.current.attachShadow({ mode: 'open' });
            }
            sbRef.current = new SB(rootRef.current!.shadowRoot);
          }
        })
        .catch((e) => {
          if (rootRef.current) {
            setError(e);
          }
        })
        .finally(() => {
          if (rootRef.current) {
            setLoading(false);
          }
        });

      return () => {
        if (sbRef.current) {
          sbRef.current.unmount();
        }
      };
    }, []);

    useEffect(() => {
      if (sbRef.current) {
        if (sbRef.current.mounted) {
          sbRef.current.update(props);
        } else {
          sbRef.current.mount(props);
        }
      }
    }, [props, loading]);

    return (
      <div ref={rootRef} className={cn('shadow-bridge-react-host', (props as any).className)}>
        {loading && loadingFallback?.()}
        {error && failedFallback?.(error)}
      </div>
    );
  };

  return Wrapper;
}
