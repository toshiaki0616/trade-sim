import { useEffect, useRef, useState } from 'react'

interface UseScrollRevealOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export const useScrollReveal = (options: UseScrollRevealOptions = {}) => {
  const { threshold = 0.15, rootMargin = '0px 0px -40px 0px', once = true } = options
  const ref = useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return { ref, isVisible }
}

// 複数要素に stagger（時差）アニメーション用
export const useStaggerReveal = (count: number, options: UseScrollRevealOptions = {}) => {
  const { threshold = 0.1, rootMargin = '0px 0px -40px 0px', once = true } = options
  const containerRef = useRef<HTMLElement | null>(null)
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let current = 0
          const interval = setInterval(() => {
            current++
            setVisibleCount(current)
            if (current >= count) {
              clearInterval(interval)
              if (once) observer.disconnect()
            }
          }, 80)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [count, threshold, rootMargin, once])

  return { containerRef, visibleCount }
}
