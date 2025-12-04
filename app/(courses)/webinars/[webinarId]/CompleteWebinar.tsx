// Кнопка завершения вебинара
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { CheckCircle2 } from 'lucide-react'

export function CompleteWebinar({ webinarId }: { webinarId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleComplete = async () => {
    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { data: existing } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_type', 'webinar')
        .eq('lesson_id', webinarId)
        .single()

      if (existing) {
        await supabase
          .from('course_progress')
          .update({ completed: true, completed_at: new Date().toISOString() })
          .eq('id', existing.id)
      } else {
        await supabase
          .from('course_progress')
          .insert([
            {
              user_id: user.id,
              course_type: 'webinar',
              lesson_id: webinarId,
              completed: true,
              completed_at: new Date().toISOString(),
            },
          ])
      }

      toast.success('Вебинар отмечен как просмотренный! 🎉')
      router.refresh()
    } catch (error) {
      toast.error('Ошибка сохранения прогресса')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6 bg-gradient-secondary text-white">
      <CheckCircle2 className="w-12 h-12 mb-3" />
      <h3 className="text-lg font-bold mb-2">Просмотрели вебинар?</h3>
      <p className="text-sm mb-4 opacity-90">
        Отметьте вебинар как просмотренный
      </p>
      <Button 
        variant="accent"
        className="w-full"
        onClick={handleComplete}
        isLoading={isLoading}
      >
        Отметить как просмотренный
      </Button>
    </Card>
  )
}
