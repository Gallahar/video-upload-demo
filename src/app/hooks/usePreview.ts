// import { useEffect, useState } from 'react'

// export const usePreview = (
// 	src: string | null,
// 	width: number,
// 	height: number
// ) => {
// 	const [posterUri, setPosterUri] = useState<string | null>(null)

// 	useEffect(() => {
// 		if (!src) return

// 		const video = document.createElement('video')
// 		video.src = src
// 		video.width = width
// 		video.height = height
// 		document.body.append(video)

// 		const onLoad = () => {
// 			if (!src) return
// 			const canvas = document.createElement('canvas')
// 			canvas.width = video.videoWidth
// 			canvas.height = video.videoHeight
// 			video.currentTime = 1
// 			const ctx = canvas.getContext('2d')
// 			console.log(ctx)
// 			if (!ctx) return
// 			ctx.drawImage(video, 0, 0)
// 			canvas.toBlob((blob) => {
// 				console.log(blob)
// 				if (blob) setPosterUri(URL.createObjectURL(blob))
// 			})
// 		}
// 		video.addEventListener('load', onLoad)
// 		return () => video.removeEventListener('load', onLoad)
// 	}, [src])

// 	return posterUri ?? ''
// }
