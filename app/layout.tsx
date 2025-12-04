// Корневой layout со шрифтами и метаданными
import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Гид по детским лагерям | ООО Резорт-Юг',
  description: 'Полный гид для родителей по выбору детского лагеря в России. Бесплатные курсы, вебинары и подробная информация от экспертов ООО Резорт-Юг из Краснодара.',
  keywords: 'детские лагеря, лагерь для детей, летний отдых, Резорт-Юг, Краснодар, выбор лагеря',
  authors: [{ name: 'ООО Резорт-Юг' }],
  openGraph: {
    title: 'Гид по детским лагерям | ООО Резорт-Юг',
    description: 'Бесплатные материалы для родителей о детских лагерях',
    type: 'website',
    locale: 'ru_RU',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
