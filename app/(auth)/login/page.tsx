// Страница входа с валидацией и красивыми анимациями
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
import { LogIn, ArrowLeft } from 'lucide-react'

// Схема валидации для формы входа
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email обязателен')
    .email('Некорректный email'),
  password: z
    .string()
    .min(6, 'Пароль должен содержать минимум 6 символов'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        toast.error('Ошибка входа', {
          description: error.message === 'Invalid login credentials' 
            ? 'Неверный email или пароль' 
            : error.message,
        })
        return
      }

      toast.success('Успешный вход!', {
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
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Вход в систему
            </h1>
            <p className="text-gray-600">
              Введите свои данные для доступа к материалам
            </p>
          </CardHeader>

          <CardContent className="p-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

              <Input
                {...register('password')}
                id="password"
                type="password"
                label="Пароль"
                placeholder="••••••••"
                error={errors.password?.message}
                disabled={isLoading}
                autoComplete="current-password"
              />

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isLoading}
              >
                Войти
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
                Нет аккаунта?{' '}
                <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                  Зарегистрируйтесь
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Информационный блок */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Все материалы абсолютно бесплатны.<br />
            Регистрация занимает меньше минуты.
          </p>
        </div>
      </div>
    </div>
  )
}
