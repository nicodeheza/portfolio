import ReactMarkdown from "react-markdown";
import styles from "./about.module.css";

export default function About({id, title, text}) {
	return (
		<section id={id} className={styles.section}>
			<article className={styles.article}>
				<div className={styles.title}>
					<h1>
						<span>{title}</span> Nicolás Deheza
					</h1>
				</div>
				<div className={styles.text}>
					<ReactMarkdown>{text}</ReactMarkdown>
				</div>
			</article>
		</section>
	);
}
