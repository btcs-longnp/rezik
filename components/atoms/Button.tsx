import { FC, HTMLProps } from 'react';

export interface ButtonProps
  extends Omit<HTMLProps<HTMLButtonElement>, 'size'> {
  size?: 'small' | 'medium' | 'large';
  link?: boolean;
  href?: string;
  target?: '_blank' | '_self';
}

const Button: FC<ButtonProps> = (props) => {
  return props.link ? (
    <a
      {...(props as any)}
      className={`
        ${props.className}
        flex items-center justify-center rounded-sm
        text-secondary bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-700
        transition-colors duration-100
        ${props.size === 'small' && 'h-6 text-xs px-2'}
        ${(!props.size || props.size === 'medium') && 'h-10 text-sm px-4'}
        ${props.size === 'large' && 'h-12 px-6'}
      `}
      href={props.href}
      target={props.target}
    >
      {props.children}
    </a>
  ) : (
    <button
      {...(props as any)}
      className={`
        ${props.className}
        flex items-center justify-center rounded-sm
        text-secondary bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-700
        transition-colors duration-100
        ${props.size === 'small' && 'h-6 text-xs px-2'}
        ${(!props.size || props.size === 'medium') && 'h-10 text-sm px-4'}
        ${props.size === 'large' && 'h-12 px-6'}
     `}
    >
      {props.children}
    </button>
  );
};

export default Button;
