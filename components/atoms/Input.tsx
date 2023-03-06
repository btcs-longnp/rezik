import { ChangeEvent, FC, HTMLProps, ReactElement } from 'react'

export interface InputProps extends Omit<HTMLProps<HTMLInputElement>, 'label'> {
  label?: string | ReactElement
  description?: string
  isError?: boolean
  onTextChange?: (text: string) => void
  addonBefore?: ReactElement
  addonAfter?: ReactElement
}

const Input: FC<InputProps> = (props) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (props.onTextChange) {
      props.onTextChange(e.target.value)
    }
  }

  return (
    <div>
      {props.label && <div className="mb-1 text-sm">{props.label}</div>}
      <div
        className={`
        grid grid-cols-[auto_1fr_auto] 
        ${props.className} 
        px-3 py-3 rounded border ${
          props.isError ? 'border-rose-400' : 'border-primary-light'
        } bg-primary/70
      `}
      >
        <div className="h-full">{props.addonBefore}</div>
        <input
          {...props}
          className="w-full h-full outline-none bg-transparent"
          onChange={handleChange}
        />
        <div className="h-full">{props.addonAfter}</div>
      </div>
      {props.description && (
        <div
          className={`mt-0.5 text-xs ${
            props.isError ? 'text-rose-400' : 'text-secondary/60'
          }`}
        >
          {props.description}
        </div>
      )}
    </div>
  )
}

export default Input
