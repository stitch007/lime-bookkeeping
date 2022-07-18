import type { UnwrapRef } from "vue"

interface PopupRef {
  toggle: () => boolean
}

export const usePopup = <T>(value?: T) => {
  const el = ref<PopupRef | null>(null)
  const current = ref<T | null>(value || null)

  const onSelect = (value: UnwrapRef<T>) => {
    current.value = value
  }

  return {
    el,
    current,
    onSelect,
  }
}
