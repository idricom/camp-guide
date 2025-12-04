// Прогресс-бар с анимацией
'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number // 0-100
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ProgressBar({ value, showLabel = true, size = 'md', className }: ProgressBarProps) {
  const [animatedValue, setAnimatedValue] = useState(0)

  // Анимация заполнения прогресс-бара
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value)
    }, 100)
    return () => clearTimeout(timer)
  }, [value])

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  }

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Прогресс</span>
          <span className="text-sm font-bold text-primary-600">{Math.round(animatedValue)}%</span>
        </div>
      )}
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizes[size])}>
        <div
          className="h-full bg-gradient-primary transition-all duration-1000 ease-out rounded-full"
          style={{ width: `${animatedValue}%` }}
        />
      </div>
    </div>
  )
}
