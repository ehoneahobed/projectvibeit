"use client"

import React from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Clock, BookOpen } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface VideoPlayerProps {
  src: string
  title?: string
  description?: string
  duration?: string
  className?: string
  type?: 'video' | 'youtube'
  height?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | string
}

export function VideoPlayer({
  src,
  title,
  description,
  duration: durationString,
  className,
  type = 'video',
  height = 'lg'
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [isMuted, setIsMuted] = React.useState(false)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [videoDuration, setVideoDuration] = React.useState(0)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)



  // Check if the src is a YouTube URL and extract video ID
  const isYouTubeUrl = type === 'youtube' || src.includes('youtube.com') || src.includes('youtu.be')
  const getYouTubeEmbedUrl = (url: string) => {
    if (url.includes('embed/')) return url
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }
    return url
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        containerRef.current.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
      setIsFullscreen(!isFullscreen)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration)
    }
  }



  React.useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate)
      video.addEventListener('loadedmetadata', handleLoadedMetadata)
      video.addEventListener('ended', () => setIsPlaying(false))

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate)
        video.removeEventListener('loadedmetadata', handleLoadedMetadata)
        video.removeEventListener('ended', () => setIsPlaying(false))
      }
    }
  }, [])

  return (
    <div className={cn('w-full', className)}>
      {/* Video Header with Brand Styling */}
      {(title || description) && (
        <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-xl border border-green-200 dark:border-green-800 shadow-sm">
          <span className="text-green-700 dark:text-green-300 text-sm mb-2">Video: </span> {title && (
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-green-700 dark:text-green-300 text-sm mb-2">
              {description}
            </p>
          )}
          {durationString && (
            <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
              <Clock className="w-3 h-3" />
              <span>{durationString}</span>
            </div>
          )}
        </div>
      )}

      {/* Video Container */}
      <div
        ref={containerRef}
        className="relative bg-slate-900 rounded-xl overflow-hidden shadow-xl"
        style={{ height: height === '2xl' ? '600px' : height === 'xl' ? '384px' : height === 'lg' ? '320px' : height === 'md' ? '256px' : height === 'sm' ? '192px' : height }}
      >
        {isYouTubeUrl ? (
          <iframe
            src={getYouTubeEmbedUrl(src)}
            className="w-full h-full border-4 border-green-400 rounded-lg"
            title={title || "Video player"}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            src={src}
            className="w-full h-full object-cover border-4 border-green-400 rounded-lg"
            playsInline
            preload="metadata"
          />
        )}

        {/* Video Controls Overlay - Only for non-YouTube videos */}
        {!isYouTubeUrl && (
          <>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              {/* Progress Bar */}
              <div className="mb-3">
                <div className="w-full bg-white/20 rounded-full h-2 cursor-pointer">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ width: `${videoDuration > 0 ? (currentTime / videoDuration) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </Button>

                  <div className="text-white text-xs ml-2">
                    {formatTime(currentTime)} / {formatTime(videoDuration)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFullscreen}
                    className="text-white hover:bg-white/20"
                  >
                    {isFullscreen ? (
                      <Minimize className="w-4 h-4" />
                    ) : (
                      <Maximize className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Play Button Overlay */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  onClick={togglePlay}
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/30"
                >
                  <Play className="w-8 h-8 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Learning Tips with Brand Styling */}
      <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 rounded-xl shadow-sm">
        <div className="flex items-start gap-2">
          <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-green-900 dark:text-green-100 mb-1">
              Learning Tip
            </p>
            <p className="text-green-700 dark:text-green-300">
              You can adjust playback speed in your browser settings for optimal learning. 
              Most browsers allow you to speed up or slow down video playback.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 