// Главная страница с Hero секцией и карточками материалов
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card'
import { Navbar } from '@/components/layout/Navbar'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { BookOpen, Video, MapPin, Users, Award, Shield } from 'lucide-react'
import dynamic from 'next/dynamic'

// Динамический импорт 3D компонента (загружается только на клиенте)
const HeroScene = dynamic(() => import('@/components/3d/HeroScene').then(mod => mod.HeroScene), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-accent-50" />
})

export default async function HomePage() {
  const supabase = await createServerSupabaseClient()
  
  // Получаем данные пользователя
  const { data: { user } } = await supabase.auth.getUser()
  
  // Получаем количество зарегистрированных пользователей
  const { count: userCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const materials = [
    {
      title: 'Мини-курс для родителей',
      description: 'Пошаговая инструкция как подготовить ребенка к первому лагерю за 5 уроков',
      icon: BookOpen,
      color: 'from-purple-500 to-indigo-600',
      href: user ? '/mini-course' : '/register',
      features: ['5 подробных уроков', 'Скачиваемые чек-листы', 'Практические советы'],
    },
    {
      title: 'Серия вебинаров',
      description: 'Детская психология и самостоятельность: экспертные видео от профессионалов',
      icon: Video,
      color: 'from-pink-500 to-rose-600',
      href: user ? '/webinars' : '/register',
      features: ['4 вебинара', 'Конспекты и таймкоды', 'Ответы на вопросы'],
    },
    {
      title: 'Полный гид по лагерям',
      description: 'Исчерпывающее руководство по выбору детского лагеря в России',
      icon: MapPin,
      color: 'from-cyan-500 to-blue-600',
      href: user ? '/guide' : '/register',
      features: ['12 подробных разделов', 'Интерактивная карта', 'Экспорт в PDF'],
    },
  ]

  const stats = [
    { label: 'Зарегистрировано родителей', value: userCount || 0, icon: Users },
    { label: 'Лет опыта', value: '11+', icon: Award },
    { label: 'Довольных семей', value: '5000+', icon: Shield },
  ]

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <HeroScene />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg mb-6">
              <span className="text-sm font-medium text-primary-600">От ООО Резорт-Юг, Краснодар</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold text-gray-900 mb-6">
              Выберите лучший лагерь
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                для вашего ребенка
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Бесплатные курсы, вебинары и подробный гид помогут сделать правильный выбор. 
              Все материалы от экспертов с 11-летним опытом организации детского отдыха.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!user ? (
                <>
                  <Button size="lg" asChild>
                    <Link href="/register">
                      Начать бесплатно
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="#materials">
                      Посмотреть материалы
                    </Link>
                  </Button>
                </>
              ) : (
                <Button size="lg" asChild>
                  <Link href="/dashboard">
                    Перейти в личный кабинет
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Волновой разделитель */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="#fafbfc"
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Materials Section */}
      <section id="materials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              Бесплатные материалы для родителей
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Все, что нужно знать о детских лагерях — от психологической подготовки до выбора программы
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {materials.map((material, index) => (
              <Card key={index} className="p-6" gradient>
                <div className={`w-14 h-14 bg-gradient-to-br ${material.color} rounded-xl flex items-center justify-center mb-4`}>
                  <material.icon className="w-7 h-7 text-white" />
                </div>
                
                <CardHeader className="p-0 mb-3">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {material.title}
                  </h3>
                  <p className="text-gray-600">
                    {material.description}
                  </p>
                </CardHeader>

                <CardContent className="p-0 mb-4">
                  <ul className="space-y-2">
                    {material.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="p-0">
                  <Button className="w-full" variant="primary" asChild>
                    <Link href={material.href}>
                      {user ? 'Перейти к материалу' : 'Получить доступ'}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold text-gray-900 mb-6">
                О ООО Резорт-Юг
              </h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p>
                  Мы работаем в сфере организации детского отдыха с 2014 года. За это время через наши 
                  лагеря прошли тысячи детей, и мы накопили огромный опыт в создании безопасных и 
                  развивающих программ.
                </p>
                <p>
                  Базируясь в Краснодаре, мы понимаем все особенности организации детского отдыха 
                  на юге России и готовы поделиться этими знаниями с родителями совершенно бесплатно.
                </p>
                <p>
                  Наша миссия — помочь каждому ребенку получить незабываемый опыт летнего отдыха, 
                  а родителям — спокойствие и уверенность в правильном выборе.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="px-4 py-2 bg-primary-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">2014</div>
                  <div className="text-sm text-gray-600">Год основания</div>
                </div>
                <div className="px-4 py-2 bg-primary-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">5000+</div>
                  <div className="text-sm text-gray-600">Довольных семей</div>
                </div>
                <div className="px-4 py-2 bg-primary-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">100%</div>
                  <div className="text-sm text-gray-600">Лицензировано</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl">
                  <MapPin className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Краснодар</h3>
                  <p className="text-gray-600">Работаем по всему югу России</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 bg-gradient-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Готовы начать?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Зарегистрируйтесь бесплатно и получите доступ ко всем материалам прямо сейчас
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register">
                Создать аккаунт бесплатно
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-display font-bold text-xl mb-4">ООО Резорт-Юг</h3>
              <p className="text-gray-400">
                Организация детского отдыха и туристических услуг с 2014 года
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Материалы</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/mini-course" className="hover:text-white transition">Мини-курс</Link></li>
                <li><Link href="/webinars" className="hover:text-white transition">Вебинары</Link></li>
                <li><Link href="/guide" className="hover:text-white transition">Гид по лагерям</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <p className="text-gray-400">
                г. Краснодар, Краснодарский край<br />
                ИНН: 3460019133
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} ООО Резорт-Юг. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
