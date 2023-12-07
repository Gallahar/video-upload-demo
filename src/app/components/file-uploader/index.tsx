'use client'
import fileIcon from '@/assets/file-icon.png'
import Image from 'next/image'
import s from './file-uploader.module.css'
import { CSSProperties, ChangeEvent, FormEvent, useRef, useState } from 'react'
import { generateVideoThumbnail } from '@/app/lib/utils'

export const FileUploader = () => {
	const [genSnap, setGenSnap] = useState<string | undefined>()
	const [percents, setPercents] = useState(0)
	const [video, setVideo] = useState<File>()
	const [videoUrl, setVideoUrl] = useState<string | undefined>()
	const [poster, setPoster] = useState<string | undefined>()
	const uploadRef = useRef<HTMLInputElement>(null)

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
			if (e.target?.result) {
				setPercents(100)

				const thumbNailUrl = await generateVideoThumbnail(video)
				setVideoUrl(URL.createObjectURL(video))
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

	const handleGenerate = async () => {
		if (!video) return alert('you should upload video first')
		const url = await generateVideoThumbnail(video, true)
		setGenSnap(url as string)
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
					src={videoUrl}
					controls
					loop
					preload='none'
					className={s.preview}
				/>
				{genSnap && <img src={genSnap} width={300} height={300} />}
			</section>
			<button
				style={{ backgroundColor: 'white', color: 'black', marginTop: '40px' }}
				onClick={handleGenerate}
				className={s.submit}
			>
				Generate snapshot
			</button>
			<div className={s.progressBar}>
				<p>{`${percents}%`}</p>
				<span style={{ '--progress': `${percents}%` } as CSSProperties} />
			</div>
		</div>
	)
}
