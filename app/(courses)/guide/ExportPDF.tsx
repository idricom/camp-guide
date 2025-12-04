// Экспорт гида в PDF
'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'

export function ExportPDF() {
  const [isLoading, setIsLoading] = useState(false)

  const handleExport = async () => {
    setIsLoading(true)
    toast.info('Подготовка PDF...', {
      description: 'Это может занять несколько секунд'
    })

    try {
      // Простая реализация: печать страницы
      // Для полноценного PDF можно использовать библиотеку jspdf или html2pdf
      window.print()
      
      toast.success('PDF готов к сохранению')
    } catch (error) {
      toast.error('Ошибка экспорта')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="accent"
      size="sm"
      onClick={handleExport}
      isLoading={isLoading}
      className="whitespace-nowrap"
    >
      <Download className="w-4 h-4 mr-2" />
      Скачать PDF
    </Button>
  )
}
