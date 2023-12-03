import { RefObject } from 'react'

export const generateVideoThumbnail = (
	file: File,
	videoRef: RefObject<HTMLVideoElement>,
	canvasRef: RefObject<HTMLCanvasElement>
) => {
	return new Promise((resolve) => {
		const canvas = canvasRef.current
		const video = videoRef.current

		if (!canvas || !video) return
		video.autoplay = true
		video.src = URL.createObjectURL(file)

		video.onloadeddata = () => {
			let ctx = canvas.getContext('2d')

			canvas.width = video.videoWidth
			canvas.height = video.videoHeight
            
			ctx?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
			video.pause()
			return resolve(canvas.toDataURL('image/png'))
		}
	})
}
