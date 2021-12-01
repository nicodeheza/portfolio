import styles from "./header.module.css";
import Image from "next/image";
import ndd from "../../public/ndd.svg";
import ndm from "../../public/ndm.svg";
import Arrows from "../../svg/Arrows";

export default function Header({subtitle, tip, showTip}) {
	return (
		<header className={styles.headerContainer}>
			<div className={styles.title}>
				<h1 className={styles.hd}>
					<Image src={ndd} width="1500" height="131" alt="nicolas" />
				</h1>
				<h1 className={styles.hm}>
					<Image src={ndm} width="537" height="189" alt="nicolas" />
				</h1>
				<div className={styles.subtitle}>
					<h2>{subtitle}</h2>
				</div>
			</div>

			<div className={showTip ? styles.tip : styles.hidden}>
				<span>{tip}</span>
				<Arrows classN={styles.arrows} />
			</div>
		</header>
	);
}
