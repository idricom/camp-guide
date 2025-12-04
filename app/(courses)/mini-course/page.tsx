// Главная страница мини-курса со списком уроков
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { calculateProgress } from '@/lib/utils'
import { CheckCircle2, Circle, Clock, Download } from 'lucide-react'
import dynamic from 'next/dynamic'

const FloatingIcons = dynamic(() => import('@/components/3d/FloatingIcons').then(mod => mod.FloatingIcons), {
  ssr: false,
})

const lessons = [
  {
    id: 'lesson-1',
    title: 'Психологическая подготовка',
    description: 'Как правильно говорить с ребенком о предстоящей поездке в лагерь',
    duration: '15 мин',
    order: 1,
  },
  {
    id: 'lesson-2',
    title: 'Что собрать в лагерь',
    description: 'Полный чек-лист вещей и документов для детского лагеря',
    duration: '20 мин',
    order: 2,
  },
  {
    id: 'lesson-3',
    title: 'Адаптация в первые дни',
    description: 'Что происходит в первые дни и как помочь ребенку адаптироваться',
    duration: '18 мин',
    order: 3,
  },
  {
    id: 'lesson-4',
    title: 'Как поддерживать связь',
    description: 'Правила общения с ребенком во время смены',
    duration: '12 мин',
    order: 4,
  },
  {
    id: 'lesson-5',
    title: 'Возвращение домой',
    description: 'Как правильно встретить ребенка и разобрать впечатления',
    duration: '15 мин',
    order: 5,
  },
]

export default async function MiniCoursePage() {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Получаем прогресс пользователя
  const { data: progressData } = await supabase
    .from('course_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('course_type', 'mini_course')

  const completedLessons = progressData?.filter(p => p.completed) || []
  const progress = calculateProgress(completedLessons.length, lessons.length)

  const isLessonCompleted = (lessonId: string) => {
    return completedLessons.some(p => p.lesson_id === lessonId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative">
          <FloatingIcons />
          
          {/* Заголовок курса */}
          <div className="mb-12">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4 transition-colors"
            >
              ← Вернуться в личный кабинет
            </Link>
            
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
                  Как подготовить ребенка к первому лагерю
                </h1>
                <p className="text-xl text-gray-600 mb-6 max-w-3xl">
                  Пошаговая инструкция для родителей: от психологической подготовки до возвращения домой. 
                  Практические советы от экспертов ООО Резорт-Юг с 11-летним опытом.
                </p>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>5 уроков • ~80 минут</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Download className="w-5 h-5 mr-2" />
                    <span>Скачиваемые материалы</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Прогресс */}
            <Card className="p-6 bg-gradient-to-r from-primary-50 to-accent-50">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-900">Ваш прогресс по курсу</span>
                <span className="text-2xl font-bold text-primary-600">{progress}%</span>
              </div>
              <ProgressBar value={progress} showLabel={false} />
              <p className="text-sm text-gray-600 mt-2">
                {completedLessons.length} из {lessons.length} уроков завершено
              </p>
            </Card>
          </div>

          {/* Список уроков */}
          <div className="space-y-4">
            {lessons.map((lesson, index) => {
              const isCompleted = isLessonCompleted(lesson.id)
              const isAvailable = index === 0 || isLessonCompleted(lessons[index - 1].id)
              
              return (
                <Card 
                  key={lesson.id} 
                  className={`p-6 transition-all ${!isAvailable && 'opacity-60'}`}
                  hover={isAvailable}
                >
                  <div className="flex items-center gap-6">
                    {/* Иконка статуса */}
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-7 h-7 text-green-600" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <Circle className="w-7 h-7 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Контент урока */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-semibold text-primary-600">
                          Урок {lesson.order}
                        </span>
                        <span className="text-sm text-gray-500">• {lesson.duration}</span>
                        {isCompleted && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                            Завершено
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {lesson.title}
                      </h3>
                      <p className="text-gray-600">
                        {lesson.description}
                      </p>
                    </div>

                    {/* Кнопка */}
                    <div className="flex-shrink-0">
                      {isAvailable ? (
                        <Button variant={isCompleted ? 'outline' : 'primary'} asChild>
                          <Link href={`/mini-course/${lesson.id}`}>
                            {isCompleted ? 'Повторить' : 'Начать'}
                          </Link>
                        </Button>
                      ) : (
                        <Button variant="ghost" disabled>
                          Заблокировано
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Информационный блок */}
          <Card className="p-6 mt-8 bg-blue-50 border-2 border-blue-200">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center">
              <span className="text-2xl mr-2">💡</span>
              Совет от экспертов
            </h3>
            <p className="text-gray-700">
              Рекомендуем проходить уроки последовательно и не спешить. Каждый урок содержит практические 
              задания и чек-листы, которые помогут вам системно подготовиться к отправке ребенка в лагерь. 
              Если у вас возникают вопросы, вы всегда можете связаться с нами.
            </p>
          </Card>
        </div>
      </main>
    </div>
  )
}
