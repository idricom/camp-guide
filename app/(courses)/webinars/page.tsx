// Список вебинаров по детской психологии
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { calculateProgress } from '@/lib/utils'
import { Play, CheckCircle2, Clock } from 'lucide-react'

const webinars = [
  {
    id: 'webinar-1',
    title: 'Развитие самостоятельности через отдых',
    description: 'Как детский лагерь помогает развить навыки самообслуживания и независимость',
    duration: '45 мин',
    videoId: 'dQw4w9WgXcQ', // Замените на реальный YouTube ID
    topics: ['Психология самостоятельности', 'Возрастные особенности', 'Роль родителей'],
    order: 1,
  },
  {
    id: 'webinar-2',
    title: 'Страхи и тревожность перед лагерем',
    description: 'Работа с детскими страхами и подготовка к первой поездке',
    duration: '50 мин',
    videoId: 'dQw4w9WgXcQ',
    topics: ['Типичные страхи детей', 'Методы работы со страхами', 'Когда обращаться к психологу'],
    order: 2,
  },
  {
    id: 'webinar-3',
    title: 'Социализация в детском коллективе',
    description: 'Как дети учатся дружить и решать конфликты в лагере',
    duration: '40 мин',
    videoId: 'dQw4w9WgXcQ',
    topics: ['Формирование дружеских связей', 'Конфликты и их решение', 'Роль вожатых'],
    order: 3,
  },
  {
    id: 'webinar-4',
    title: 'Как выбрать лагерь по темпераменту ребенка',
    description: 'Подбор программы лагеря с учетом особенностей характера ребенка',
    duration: '55 мин',
    videoId: 'dQw4w9WgXcQ',
    topics: ['Типы темперамента', 'Профильные лагеря', 'Индивидуальный подход'],
    order: 4,
  },
]

export default async function WebinarsPage() {
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
    .eq('course_type', 'webinar')

  const completedWebinars = progressData?.filter(p => p.completed) || []
  const progress = calculateProgress(completedWebinars.length, webinars.length)

  const isWebinarCompleted = (webinarId: string) => {
    return completedWebinars.some(p => p.lesson_id === webinarId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Заголовок */}
        <div className="mb-12">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4 transition-colors"
          >
            ← Вернуться в личный кабинет
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            Детская психология и самостоятельность
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl">
            Серия профессиональных вебинаров от психологов ООО Резорт-Юг. 
            Узнайте, как правильно подготовить ребенка к лагерю и поддержать его развитие.
          </p>
          
          <div className="flex items-center gap-4 text-gray-600 mb-6">
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>4 вебинара • ~3 часа</span>
            </div>
          </div>

          {/* Прогресс */}
          <Card className="p-6 bg-gradient-to-r from-pink-50 to-rose-50">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-900">Ваш прогресс</span>
              <span className="text-2xl font-bold text-pink-600">{progress}%</span>
            </div>
            <ProgressBar value={progress} showLabel={false} />
            <p className="text-sm text-gray-600 mt-2">
              {completedWebinars.length} из {webinars.length} вебинаров просмотрено
            </p>
          </Card>
        </div>

        {/* Список вебинаров */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {webinars.map((webinar) => {
            const isCompleted = isWebinarCompleted(webinar.id)
            
            return (
              <Card key={webinar.id} className="overflow-hidden" hover>
                {/* Превью видео */}
                <div className="relative aspect-video bg-gradient-to-br from-pink-100 to-purple-100">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl">
                      <Play className="w-10 h-10 text-pink-600 ml-1" />
                    </div>
                  </div>
                  {isCompleted && (
                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-green-500 text-white text-sm font-semibold rounded-full flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Просмотрено
                    </div>
                  )}
                  <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/70 text-white text-sm rounded">
                    {webinar.duration}
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="mb-3">
                    <span className="text-sm font-semibold text-pink-600">
                      Вебинар {webinar.order}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {webinar.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {webinar.description}
                  </p>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Темы вебинара:</p>
                    <div className="flex flex-wrap gap-2">
                      {webinar.topics.map((topic, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button 
                    variant={isCompleted ? 'outline' : 'secondary'} 
                    className="w-full"
                    asChild
                  >
                    <Link href={`/webinars/${webinar.id}`}>
                      <Play className="w-4 h-4 mr-2" />
                      {isCompleted ? 'Пересмотреть' : 'Смотреть вебинар'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Информационный блок */}
        <Card className="p-6 mt-8 bg-purple-50 border-2 border-purple-200">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center">
            <span className="text-2xl mr-2">👨‍🏫</span>
            О спикерах
          </h3>
          <p className="text-gray-700">
            Все вебинары ведут профессиональные детские психологи и педагоги с многолетним 
            опытом работы в ООО Резорт-Юг. Мы работаем с детьми с 2014 года и точно знаем, 
            что волнует родителей и как помочь ребенку адаптироваться к лагерной жизни.
          </p>
        </Card>
      </main>
    </div>
  )
}
