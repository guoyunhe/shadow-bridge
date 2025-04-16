import cn from 'classnames';
import { CSSProperties, ReactNode } from 'react';
import './index.css';

export interface ShadowBridgeProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function ShadowBridge({ children, className, style }: ShadowBridgeProps) {
  return (
    <ShadowBridge className={cn('shadow-bridge', className)} style={style}>
      {children}
    </ShadowBridge>
  );
}
