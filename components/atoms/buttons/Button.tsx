import { FC, HTMLProps } from 'react'

export interface ButtonProps
  extends Omit<HTMLProps<HTMLButtonElement>, 'size'> {
  type?: 'primary' | 'text' | 'default'
  size?: 'small' | 'medium' | 'large'
  component?: 'link' | 'button' | 'nextLink'
  href?: string
  target?: '_blank' | '_self'
}

const Button: FC<ButtonProps> = (props) => {
  const btn = (
    <button
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(props as any)}
      className={`
    ${props.className}
    flex items-center justify-center
    ${
      props.type === 'primary'
        ? 'text-secondary bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-700'
        : ''
    }
    ${
      !props.type || props.type === 'default'
        ? 'text-secondary bg-primary/80 hover:bg-primary/60 active:bg-primary/80'
        : ''
    }
    ${
      props.type === 'text'
        ? 'text-secondary hover:bg-primary/60 active:bg-primary/80'
        : ''
    }
    transition-colors duration-100
    ${props.size === 'small' && 'h-6 text-xs px-2 rounded-sm'}
    ${(!props.size || props.size === 'medium') && 'h-8 text-sm px-4 rounded'}
    ${props.size === 'large' && 'h-10 px-6 rounded'}
 `}
    >
      {props.children}
    </button>
  )

  return props.component === 'link' ? (
    <a href={props.href} target={props.target}>
      {btn}
    </a>
  ) : (
    btn
  )
}

export default Button
