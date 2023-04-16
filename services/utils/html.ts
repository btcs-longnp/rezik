export const getElementByScrollOffsetLeft = (
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
