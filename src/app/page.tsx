import { FileUploader } from './components/file-uploader'
import styles from './page.module.css'

export default function Home() {
	return (
		<main className={styles.main}>
			<FileUploader />
		</main>
	)
}
