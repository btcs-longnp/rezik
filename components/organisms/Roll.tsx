import {
  FC,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react'
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'
import IconButtonOutline from '../atoms/IconButtonOutline'

const getElementByScrollOffset = (
  offsetLeft: number,
  parentEle: HTMLElement
): HTMLElement | undefined => {
  for (let i = 0; i < parentEle.children.length; i += 1) {
    const ele = parentEle.children.item(i) as HTMLDivElement
    const offsetLeftOnScroll = ele.offsetLeft - parentEle.offsetLeft

    if (
      offsetLeftOnScroll <= offsetLeft &&
      offsetLeft <= offsetLeftOnScroll + ele.clientWidth
    ) {
      return ele
    }
  }

  return undefined
}

export interface RollProps {
  title?: ReactElement
  childrenData?: unknown
}

const Roll: FC<PropsWithChildren<RollProps>> = ({
  title,
  children,
  childrenData,
}) => {
  const [btnEnable, setBtnEnable] = useState({ prev: false, next: false })
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollRight = () => {
    if (!scrollRef.current) {
      return
    }

    const { clientWidth, scrollLeft } = scrollRef.current

    const ele = getElementByScrollOffset(
      scrollLeft + clientWidth,
      scrollRef.current
    )

    if (!ele) {
      return
    }

    const left = ele.offsetLeft - scrollRef.current.offsetLeft

    scrollRef.current.scrollTo({ left, behavior: 'smooth' })
  }

  const scrollLeft = () => {
    if (!scrollRef.current) {
      return
    }

    const { clientWidth, scrollLeft } = scrollRef.current

    const ele = getElementByScrollOffset(scrollLeft, scrollRef.current)

    if (!ele) {
      return
    }

    const left = Math.max(
      0,
      ele.offsetLeft +
        ele.clientWidth -
        clientWidth -
        scrollRef.current.offsetLeft
    )

    scrollRef.current.scrollTo({ left, behavior: 'smooth' })
  }

  useEffect(() => {
    if (!scrollRef.current) {
      return
    }

    const handleScroll = () => {
      if (!scrollRef.current) {
        return
      }

      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current

      setBtnEnable({
        next: scrollLeft + clientWidth < scrollWidth - 10,
        prev: scrollLeft >= 10,
      })
    }

    handleScroll()

    scrollRef.current.onscroll = handleScroll
  }, [childrenData])

  return (
    <>
      <div className="grid grid-cols-[1fr_auto] mb-4">
        {title}
        <div className="flex h-full items-end space-x-4">
          <IconButtonOutline disabled={!btnEnable.prev} onClick={scrollLeft}>
            <IoChevronBackOutline
              className={
                btnEnable.prev ? 'text-secondary/80' : 'text-secondary/20'
              }
            />
          </IconButtonOutline>
          <IconButtonOutline disabled={!btnEnable.next} onClick={scrollRight}>
            <IoChevronForwardOutline
              className={
                btnEnable.next ? 'text-secondary/80' : 'text-secondary/20'
              }
            />
          </IconButtonOutline>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="w-full overflow-x-auto flex space-x-6 scrollbar-hide"
      >
        {children}
      </div>
    </>
  )
}

export default Roll
