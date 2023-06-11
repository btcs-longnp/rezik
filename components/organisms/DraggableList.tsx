'use client'

import { useSprings, animated } from '@react-spring/web'
import { useEffect, useRef } from 'react'
import { useDrag } from 'react-use-gesture'

const getSongReqStyle =
  (
    orders: number[],
    itemHeight: number,
    active = false,
    dragItemCurIndex = 0,
    dragItemOrgIndex = 0,
    y = 0,
    preventAnimation = false
  ) =>
  (index: number) => {
    if (active && dragItemOrgIndex === index) {
      return {
        y: dragItemCurIndex * itemHeight + y,
        scale: 1.04,
        zIndex: 99999,
        immediate: (key: string) => key === 'y' || key === 'zIndex',
      }
    }

    let curIndex = orders.findIndex((item) => item === index)
    curIndex = curIndex >= 0 ? curIndex : index

    return {
      y: curIndex * itemHeight,
      scale: 1,
      zIndex: 9900,
      immediate: preventAnimation,
    }
  }

export interface DraggableListProps<T> {
  list: T[]
  getItemId: (item: T) => string | number
  renderItem: (item: T) => React.ReactNode
  itemHeight: number
  changeListOrder?: (newOrder: number[]) => void | Promise<void>
}

export function DraggableList<T>(props: DraggableListProps<T>) {
  const { list, itemHeight } = props

  const orders = useRef(list.map((item, i) => i))

  const [springs, api] = useSprings(
    list.length,
    getSongReqStyle(orders.current, itemHeight),
    [list]
  )

  const bind = useDrag(
    ({ args: [dragItemOrgIndex], active, movement: [, y] }) => {
      const curIndex = orders.current.findIndex(
        (item) => item === dragItemOrgIndex
      )

      const bias = y > 0 ? itemHeight / 2 : 0

      const newIndex = Math.min(
        Math.max(Math.round(curIndex + (y + bias) / itemHeight), 0),
        list.length
      )

      let newOrders = orders.current

      if (curIndex !== newIndex) {
        newOrders = [
          ...orders.current.slice(0, newIndex),
          orders.current[curIndex],
          ...orders.current.slice(newIndex),
        ]

        const deleteIndex = newIndex > curIndex ? curIndex : curIndex + 1
        newOrders.splice(deleteIndex, 1)
      }

      api.start(
        getSongReqStyle(
          newOrders,
          itemHeight,
          active,
          curIndex,
          dragItemOrgIndex,
          y
        )
      )

      if (!active && curIndex !== newIndex) {
        console.log(`change order ${curIndex} -> ${newIndex}`)

        orders.current = newOrders
        setTimeout(() => {
          if (props.changeListOrder) {
            props.changeListOrder(newOrders)
          }
        }, 600)
      }
    }
  )

  useEffect(() => {
    orders.current = list.map((item, i) => i)

    api.start(getSongReqStyle(orders.current, itemHeight, false, 0, 0, 0, true))
  }, [list, api, itemHeight])

  return (
    <>
      {springs.map((style, index) => (
        <animated.div
          className="absolute w-full"
          key={props.getItemId(list[index])}
          style={style}
          {...bind(index)}
        >
          {props.renderItem(list[index])}
        </animated.div>
      ))}
    </>
  )
}
