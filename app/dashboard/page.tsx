// Личный кабинет с прогрессом по курсам
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { calculateProgress } from '@/lib/utils'
import { BookOpen, Video, MapPin, Award, TrendingUp } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Получаем профиль пользователя
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Получаем прогресс по мини-курсу (5 уроков)
  const { data: miniCourseProgress } = await supabase
    .from('course_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('course_type', 'mini_course')

  // Получаем прогресс по вебинарам (4 вебинара)
  const { data: webinarsProgress } = await supabase
    .from('course_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('course_type', 'webinar')

  // Получаем количество закладок в гиде
  const { count: bookmarksCount } = await supabase
    .from('bookmarks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const miniCourseCompleted = miniCourseProgress?.filter(p => p.completed).length || 0
  const webinarsCompleted = webinarsProgress?.filter(p => p.completed).length || 0

  const stats = [
    {
      title: 'Мини-курс',
      progress: calculateProgress(miniCourseCompleted, 5),
      completed: miniCourseCompleted,
      total: 5,
      icon: BookOpen,
      color: 'from-purple-500 to-indigo-600',
      href: '/mini-course',
    },
    {
      title: 'Вебинары',
      progress: calculateProgress(webinarsCompleted, 4),
      completed: webinarsCompleted,
      total: 4,
      icon: Video,
      color: 'from-pink-500 to-rose-600',
      href: '/webinars',
    },
    {
      title: 'Гид по лагерям',
      progress: bookmarksCount ? 100 : 0,
      completed: bookmarksCount || 0,
      total: 12,
      icon: MapPin,
      color: 'from-cyan-500 to-blue-600',
      href: '/guide',
      label: 'разделов',
    },
  ]

  const overallProgress = Math.round(
    ((miniCourseCompleted / 5) * 40 + (webinarsCompleted / 4) * 40 + (bookmarksCount ? 20 : 0))
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Приветствие */}
        <div className="mb-12">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
            Добро пожаловать, {profile?.full_name || 'Пользователь'}! 👋
          </h1>
          <p className="text-xl text-gray-600">
            Продолжайте изучать материалы и готовиться к выбору лагеря
          </p>
        </div>

        {/* Общий прогресс */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-primary-50 to-accent-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mr-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Общий прогресс</h2>
                <p className="text-gray-600">Ваше обучение</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary-600">{overallProgress}%</div>
              <div className="text-sm text-gray-600">завершено</div>
            </div>
          </div>
          <ProgressBar value={overallProgress} showLabel={false} size="lg" />
        </Card>

        {/* Карточки курсов */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6" hover>
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">{stat.title}</h3>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">
                    {stat.completed} из {stat.total} {stat.label || 'завершено'}
                  </span>
                  <span className="text-sm font-bold text-primary-600">
                    {stat.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 bg-gradient-to-r ${stat.color} rounded-full transition-all duration-500`}
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={stat.href}>
                  {stat.progress === 100 ? 'Повторить' : 'Продолжить'}
                </Link>
              </Button>
            </Card>
          ))}
        </div>

        {/* Достижения */}
        {overallProgress >= 25 && (
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Award className="w-6 h-6 text-yellow-500 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Достижения</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-lg text-center ${overallProgress >= 25 ? 'bg-yellow-50 border-2 border-yellow-300' : 'bg-gray-100 opacity-50'}`}>
                <div className="text-3xl mb-2">🌟</div>
                <div className="text-sm font-semibold">Начало пути</div>
                <div className="text-xs text-gray-600">25% прогресса</div>
              </div>
              <div className={`p-4 rounded-lg text-center ${overallProgress >= 50 ? 'bg-blue-50 border-2 border-blue-300' : 'bg-gray-100 opacity-50'}`}>
                <div className="text-3xl mb-2">🚀</div>
                <div className="text-sm font-semibold">На полпути</div>
                <div className="text-xs text-gray-600">50% прогресса</div>
              </div>
              <div className={`p-4 rounded-lg text-center ${overallProgress >= 75 ? 'bg-purple-50 border-2 border-purple-300' : 'bg-gray-100 opacity-50'}`}>
                <div className="text-3xl mb-2">💪</div>
                <div className="text-sm font-semibold">Почти готово</div>
                <div className="text-xs text-gray-600">75% прогресса</div>
              </div>
              <div className={`p-4 rounded-lg text-center ${overallProgress === 100 ? 'bg-green-50 border-2 border-green-300' : 'bg-gray-100 opacity-50'}`}>
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-sm font-semibold">Эксперт</div>
                <div className="text-xs text-gray-600">100% прогресса</div>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}
