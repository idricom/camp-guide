// Поиск по гиду
'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface Section {
  id: string
  title: string
  content: {
    intro: string
    subsections: Array<{
      title: string
      content: string
    }>
  }
}

export function GuideSearch({ sections }: { sections: Section[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')

  const searchResults = query.length > 2
    ? sections.flatMap(section => {
        const matches: Array<{ sectionId: string; sectionTitle: string; subsectionTitle: string }> = []
        
        if (section.title.toLowerCase().includes(query.toLowerCase())) {
          matches.push({
            sectionId: section.id,
            sectionTitle: section.title,
            subsectionTitle: 'Весь раздел'
          })
        }

        section.content.subsections.forEach(sub => {
          if (
            sub.title.toLowerCase().includes(query.toLowerCase()) ||
            sub.content.toLowerCase().includes(query.toLowerCase())
          ) {
            matches.push({
              sectionId: section.id,
              sectionTitle: section.title,
              subsectionTitle: sub.title
            })
          }
        })

        return matches
      })
    : []

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="whitespace-nowrap"
      >
        <Search className="w-4 h-4 mr-2" />
        Поиск по гиду
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 pt-20">
          <Card className="w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Поиск по гиду</h3>
              <button
                onClick={() => {
                  setIsOpen(false)
                  setQuery('')
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Введите ключевое слово..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />

            <div className="max-h-96 overflow-y-auto scrollbar-thin">
              {query.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  Начните вводить для поиска...
                </p>
              )}

              {query.length > 0 && query.length < 3 && (
                <p className="text-gray-500 text-center py-8">
                  Введите минимум 3 символа
                </p>
              )}

              {searchResults.length === 0 && query.length >= 3 && (
                <p className="text-gray-500 text-center py-8">
                  Ничего не найдено
                </p>
              )}

              {searchResults.length > 0 && (
                <div className="space-y-2">
                  {searchResults.map((result, index) => (
                    <a
                      key={index}
                      href={`#${result.sectionId}`}
                      onClick={() => {
                        setIsOpen(false)
                        setQuery('')
                      }}
                      className="block p-4 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="font-semibold text-gray-900 mb-1">
                        {result.sectionTitle}
                      </div>
                      <div className="text-sm text-gray-600">
                        {result.subsectionTitle}
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
