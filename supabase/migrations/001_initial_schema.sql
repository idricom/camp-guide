-- Создание таблиц для приложения "Гид по детским лагерям"

-- Включаем расширения
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Таблица профилей пользователей
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Включаем RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Политики доступа для profiles
CREATE POLICY "Пользователи могут просматривать свой профиль"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Пользователи могут обновлять свой профиль"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Пользователи могут создавать свой профиль"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Таблица прогресса по курсам
CREATE TABLE IF NOT EXISTS public.course_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_type TEXT NOT NULL CHECK (course_type IN ('mini_course', 'webinar', 'guide')),
  lesson_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(user_id, course_type, lesson_id)
);

-- Включаем RLS
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;

-- Политики для course_progress
CREATE POLICY "Пользователи могут просматривать свой прогресс"
  ON public.course_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Пользователи могут создавать свой прогресс"
  ON public.course_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Пользователи могут обновлять свой прогресс"
  ON public.course_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Пользователи могут удалять свой прогресс"
  ON public.course_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Таблица закладок в гиде
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  guide_section TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(user_id, guide_section)
);

-- Включаем RLS
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Политики для bookmarks
CREATE POLICY "Пользователи могут просматривать свои закладки"
  ON public.bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Пользователи могут создавать свои закладки"
  ON public.bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Пользователи могут удалять свои закладки"
  ON public.bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Индексы для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_course_progress_user_id ON public.course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_course_type ON public.course_progress(course_type);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггеры для автоматического обновления updated_at
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_course_progress
  BEFORE UPDATE ON public.course_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Комментарии к таблицам
COMMENT ON TABLE public.profiles IS 'Профили пользователей';
COMMENT ON TABLE public.course_progress IS 'Прогресс пользователей по курсам, вебинарам и гиду';
COMMENT ON TABLE public.bookmarks IS 'Закладки пользователей в гиде по лагерям';
