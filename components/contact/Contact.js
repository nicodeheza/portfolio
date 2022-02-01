import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import styles from "./contact.module.css";

export default function Contact({id, text}) {
	const [path, setPath] = useState("");
	const router = useRouter();

	useEffect(() => {
		setPath(
			`${window.location.protocol}//${window.location.host}${window.location.pathname}`
		);
	}, [router.locale]);

	return (
		<section id={id} className={styles.section}>
			<div className={styles.content}>
				<div className={styles.title}>
					<h1>{text[6]}</h1>
				</div>
				<div className={styles.formContainer}>
					<form
						action="https://formsubmit.co/b54a6a7067652d08bf542eb863f7b635"
						method="POST"
					>
						<div className={styles.name + " " + styles.input}>
							<label htmlFor="name">{text[0]}</label>
							<input type="text" id="name" name="name" required />
						</div>
						<div className={styles.email + " " + styles.input}>
							<label htmlFor="email">{text[1]}</label>
							<input type="email" id="email" name="email" required />
						</div>
						<div className={styles.phone + " " + styles.input}>
							<label htmlFor="phone">{text[2]}</label>
							<input type="tel" id="phone" name="phone" />
						</div>
						<div className={styles.message + " " + styles.input}>
							<label htmlFor="message">{text[3]}</label>
							<textarea id="message" name="message" required />
						</div>
						<input type="hidden" name="_next" value={path} />
						<p>{text[5]}</p>
						<button type="submit">{text[4]}</button>
					</form>
				</div>
			</div>
		</section>
	);
}
