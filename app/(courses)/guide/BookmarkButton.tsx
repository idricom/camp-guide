// Кнопка добавления в закладки
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bookmark } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function BookmarkButton({ 
  sectionId, 
  isBookmarked 
}: { 
  sectionId: string
  isBookmarked: boolean 
}) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const toggleBookmark = async () => {
    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      if (isBookmarked) {
        // Удаляем закладку
        await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('guide_section', sectionId)

        toast.success('Удалено из закладок')
      } else {
        // Добавляем закладку
        await supabase
          .from('bookmarks')
          .insert([
            {
              user_id: user.id,
              guide_section: sectionId,
            },
          ])

        toast.success('Добавлено в закладки')
      }

      router.refresh()
    } catch (error) {
      toast.error('Ошибка сохранения')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={toggleBookmark}
      disabled={isLoading}
      className={cn(
        'p-2 rounded-lg transition-colors',
        isBookmarked
          ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      )}
      title={isBookmarked ? 'Удалить из закладок' : 'Добавить в закладки'}
    >
      <Bookmark
        className={cn('w-5 h-5', isBookmarked && 'fill-current')}
      />
    </button>
  )
}
