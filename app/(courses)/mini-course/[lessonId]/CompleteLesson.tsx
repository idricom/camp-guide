// Клиентский компонент для отметки урока как завершенного
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { CheckCircle2 } from 'lucide-react'

export function CompleteLesson({ lessonId }: { lessonId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleComplete = async () => {
    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      // Проверяем, есть ли уже запись
      const { data: existing } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_type', 'mini_course')
        .eq('lesson_id', lessonId)
        .single()

      if (existing) {
        // Обновляем существующую запись
        await supabase
          .from('course_progress')
          .update({ completed: true, completed_at: new Date().toISOString() })
          .eq('id', existing.id)
      } else {
        // Создаем новую запись
        await supabase
          .from('course_progress')
          .insert([
            {
              user_id: user.id,
              course_type: 'mini_course',
              lesson_id: lessonId,
              completed: true,
              completed_at: new Date().toISOString(),
            },
          ])
      }

      toast.success('Урок завершен! 🎉', {
        description: 'Ваш прогресс сохранен',
      })

      router.refresh()
    } catch (error) {
      toast.error('Ошибка', {
        description: 'Не удалось сохранить прогресс',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gradient-primary rounded-xl p-8 text-center text-white">
      <CheckCircle2 className="w-16 h-16 mx-auto mb-4" />
      <h3 className="text-2xl font-bold mb-2">Завершить урок</h3>
      <p className="mb-6 opacity-90">
        Отметьте урок как завершенный, чтобы отслеживать свой прогресс
      </p>
      <Button 
        variant="secondary" 
        size="lg" 
        onClick={handleComplete}
        isLoading={isLoading}
      >
        Отметить как завершенный
      </Button>
    </div>
  )
}
