// Страница регистрации с созданием профиля
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { UserPlus, ArrowLeft, Check } from 'lucide-react'

// Схема валидации для регистрации
const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(50, 'Имя слишком длинное'),
  email: z
    .string()
    .min(1, 'Email обязателен')
    .email('Некорректный email'),
  password: z
    .string()
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .regex(/[A-Za-z]/, 'Пароль должен содержать латинские буквы')
    .regex(/[0-9]/, 'Пароль должен содержать цифры'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch('password', '')

  // Проверки силы пароля
  const passwordChecks = {
    length: password.length >= 6,
    hasLetter: /[A-Za-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  }

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)

    try {
      // Регистрация пользователя
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      })

      if (authError) {
        toast.error('Ошибка регистрации', {
          description: authError.message === 'User already registered'
            ? 'Пользователь с таким email уже существует'
            : authError.message,
        })
        return
      }

      if (authData.user) {
        // Создаем профиль в таблице profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              full_name: data.fullName,
            },
          ])

        if (profileError) {
          console.error('Profile creation error:', profileError)
        }
      }

      toast.success('Регистрация успешна!', {
        description: 'Перенаправляем в личный кабинет...',
      })

      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      toast.error('Произошла ошибка', {
        description: 'Попробуйте еще раз',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 p-4">
      <div className="w-full max-w-md">
        {/* Кнопка назад */}
        <Link 
          href="/" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          На главную
        </Link>

        <Card className="p-8 fade-in">
          <CardHeader className="p-0 mb-6 text-center">
            <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Создать аккаунт
            </h1>
            <p className="text-gray-600">
              Получите бесплатный доступ ко всем материалам
            </p>
          </CardHeader>

          <CardContent className="p-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                {...register('fullName')}
                id="fullName"
                type="text"
                label="Полное имя"
                placeholder="Иван Иванов"
                error={errors.fullName?.message}
                disabled={isLoading}
                autoComplete="name"
              />

              <Input
                {...register('email')}
                id="email"
                type="email"
                label="Email"
                placeholder="example@mail.com"
                error={errors.email?.message}
                disabled={isLoading}
                autoComplete="email"
              />

              <div>
                <Input
                  {...register('password')}
                  id="password"
                  type="password"
                  label="Пароль"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                
                {/* Индикатор силы пароля */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center text-xs">
                      <Check className={`w-3 h-3 mr-1 ${passwordChecks.length ? 'text-green-500' : 'text-gray-300'}`} />
                      <span className={passwordChecks.length ? 'text-green-600' : 'text-gray-500'}>
                        Минимум 6 символов
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      <Check className={`w-3 h-3 mr-1 ${passwordChecks.hasLetter ? 'text-green-500' : 'text-gray-300'}`} />
                      <span className={passwordChecks.hasLetter ? 'text-green-600' : 'text-gray-500'}>
                        Содержит буквы
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      <Check className={`w-3 h-3 mr-1 ${passwordChecks.hasNumber ? 'text-green-500' : 'text-gray-300'}`} />
                      <span className={passwordChecks.hasNumber ? 'text-green-600' : 'text-gray-500'}>
                        Содержит цифры
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <Input
                {...register('confirmPassword')}
                id="confirmPassword"
                type="password"
                label="Подтверждение пароля"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                disabled={isLoading}
                autoComplete="new-password"
              />

              <Button
                type="submit"
                className="w-full"
                size="lg"
                variant="secondary"
                isLoading={isLoading}
              >
                Зарегистрироваться
              </Button>
            </form>

            {/* Разделитель */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">или</span>
              </div>
            </div>

            {/* Дополнительные опции */}
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">
                Уже есть аккаунт?{' '}
                <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Войти
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Преимущества регистрации */}
        <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">Что вы получите:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Доступ к мини-курсу по подготовке ребенка</span>
            </li>
            <li className="flex items-start">
              <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>4 профессиональных вебинара по детской психологии</span>
            </li>
            <li className="flex items-start">
              <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Полный гид по выбору лагеря с интерактивной картой</span>
            </li>
            <li className="flex items-start">
              <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Скачиваемые чек-листы и материалы в PDF</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
