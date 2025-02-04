import { Howl } from 'howler'
import { useCallback } from 'react'

const ambient = new Howl({
  src: ['https://cdn.jsdelivr.net/gh/airtone/free-sound-effects@master/dark-ambient-2.mp3'],
  loop: true,
  volume: 0.3
})

export function useAudio() {
  const playAmbient = useCallback(() => {
    ambient.play()
  }, [])

  const stopAmbient = useCallback(() => {
    ambient.stop()
  }, [])

  return {
    playAmbient,
    stopAmbient
  }
}
