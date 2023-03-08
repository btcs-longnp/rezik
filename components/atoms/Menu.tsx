import { FC, HTMLProps } from 'react'

export const MenuItem: FC<HTMLProps<HTMLDivElement>> = (props) => {
  return (
    <div
      {...props}
      className={`${props.className} py-3 px-3 hover:bg-primary/30 active:bg-primary/50 cursor-pointer rounded`}
    >
      {props.children}
    </div>
  )
}

const Menu: FC<HTMLProps<HTMLDivElement>> = (props) => {
  return (
    <div
      {...props}
      className={`${props.className} bg-primary-light border-separate text-sm rounded p-1 text-secondary`}
    >
      {props.children}
    </div>
  )
}

export default Menu
