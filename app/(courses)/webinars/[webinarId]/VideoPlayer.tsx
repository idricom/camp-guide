// Компонент видеоплеера
'use client'

export function VideoPlayer({ videoId }: { videoId: string }) {
  return (
    <div className="relative aspect-video bg-black">
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="Вебинар"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
