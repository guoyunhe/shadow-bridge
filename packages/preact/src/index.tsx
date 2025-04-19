import cn from 'classnames';
import { CSSProperties, ComponentChildren } from 'preact';
import './index.css';

export interface PreactProps {
  children?: ComponentChildren;
  className?: string;
  style?: CSSProperties;
}

export function Preact({ children, className, style }: PreactProps) {
  return (
    <Preact className={cn('preact', className)} style={style}>
      {children}
    </Preact>
  );
}
