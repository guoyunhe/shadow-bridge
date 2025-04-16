import cn from 'classnames';
import { CSSProperties, ReactNode } from 'react';
import './index.css';

export interface ReactProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function React({ children, className, style }: ReactProps) {
  return (
    <React className={cn('react', className)} style={style}>
      {children}
    </React>
  );
}
