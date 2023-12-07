const settings = {
	squireInCanvasWH: 5, // how much of our preview we wanna check from center.
	bellowRgbIsBlack: 5, // which rgba is black, i decide to put here below 5 , since we sure if we got 0-5 its considered as black pixel.
	percentsOfBlackPixels: 10, // for example we got 100 black pixels of 400 (400/100 = 4 so 25% ) at all inside 10/10 square on center of our preview, its more then 10% of the black pixels -  then we decide to skip video to half of his duration and get snapshot from it.
}

export const generateVideoThumbnail = (file: File, isRandom?: boolean) => {
	return new Promise((resolve, reject) => {
		const canvas = document.createElement('canvas')
		const video = document.createElement('video')

		video.autoplay = true
		video.muted = true
		video.src = URL.createObjectURL(file)

		video.onloadeddata = () => {
			const ctx = canvas.getContext('2d')
			if (!ctx) {
				return reject('no context provided')
			}
			canvas.width = video.videoWidth
			canvas.height = video.videoHeight
			ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
			const imgData = ctx.getImageData(
				canvas.width / 2,
				canvas.height / 2,
				settings.squireInCanvasWH,
				settings.squireInCanvasWH
			)
			const isBlackScreen = checkForFirstBlackFrame(imgData)
			if (isBlackScreen && !isRandom) {
				video.currentTime = Math.floor(video.duration / 2)
				video.onseeked = () => {
					ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
					video.pause()
					return resolve(canvas.toDataURL('image/png'))
				}
			} else {
				const seekTo = isRandom
					? Math.floor(Math.random() * video.duration + 1)
					: 0
				video.currentTime = seekTo
				video.onseeked = () => {
					ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
					video.pause()
					return resolve(canvas.toDataURL('image/png'))
				}
			}
		}
	})
}

const checkForFirstBlackFrame = (imgData: ImageData) => {
	let approximatelyBlackPixels = 0
	const length = imgData.data.length
	for (let i = 0; i < length; i++) {
		if (imgData.data[i] < settings.bellowRgbIsBlack) {
			approximatelyBlackPixels += 1
		}
	}
	console.log(approximatelyBlackPixels, length)
	return length / approximatelyBlackPixels < settings.percentsOfBlackPixels
}
