'use client'
import fileIcon from '@/assets/file-icon.png'
import Image from 'next/image'
import s from './file-uploader.module.css'
import { CSSProperties, ChangeEvent, FormEvent, useRef, useState } from 'react'
import { generateVideoThumbnail } from '@/app/lib/utils'

export const FileUploader = () => {
	const [percents, setPercents] = useState(0)
	const [video, setVideo] = useState<Blob>()
	const [poster, setPoster] = useState<string | undefined>()
	const uploadRef = useRef<HTMLInputElement>(null)
	const videoRef = useRef<HTMLVideoElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)

	const handleInputClick = () => {
		if (uploadRef.current) {
			uploadRef.current.click()
		}
	}

	const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return
		const video = e.target.files[0]

		const reader = new FileReader()
		setVideo(video)
		reader.onprogress = (e) => {
			if (e.loaded && e.total) {
				const percent = (e.loaded / e.total) * 100
				setPercents(+percent.toFixed(0))
			}
		}

		reader.onload = async (e: ProgressEvent<FileReader>) => {
			if (e.target?.result && videoRef.current) {
				setPercents(100)

				const thumbNailUrl = await generateVideoThumbnail(
					video,
					videoRef,
					canvasRef
				)

				if (typeof thumbNailUrl === 'string') {
					setPoster(thumbNailUrl)
				}
			}
		}
		reader.readAsDataURL(video)
	}

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const formData = new FormData()
		if (video) formData.append('video', video)
		console.log(formData.get('video'))
	}

	return (
		<div className={s.wrapper}>
			<h1> Upload your video</h1>
			<section className={s.flex}>
				<form onSubmit={handleSubmit} className={s.uploadSection}>
					<h2>click/drag here to upload </h2>
					<Image
						onClick={handleInputClick}
						src={fileIcon}
						alt='file-icon'
						width={100}
						height={100}
					/>
					<input
						onChange={handleChange}
						ref={uploadRef}
						type='file'
						accept='video/*'
						hidden
					/>
					<input className={s.submit} type='submit' value='Send' />
				</form>
				<video
					muted
					poster={poster}
					ref={videoRef}
					controls
					loop
					className={s.preview}
				/>
			</section>
			<canvas ref={canvasRef} style={{ display: 'none' }} />
			<div className={s.progressBar}>
				<p>{`${percents}%`}</p>
				<span style={{ '--progress': `${percents}%` } as CSSProperties} />
			</div>
		</div>
	)
}
