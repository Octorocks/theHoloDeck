import { Howl } from 'howler'
import { useCallback } from 'react'
import chimpoTrance from '../assets/eddBSiteLoop.mp3'

const ambient = new Howl({
  src: [chimpoTrance],
  loop: true,
  volume: 0.05
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
