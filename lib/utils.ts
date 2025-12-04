// Утилиты для работы с классами и общие хелперы
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Удобная функция для объединения классов Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Форматирование даты на русском языке
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Вычисление процента прогресса
export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}
