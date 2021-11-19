import styles from "./header.module.css";
import Image from "next/image";
import ndd from "../../public/ndd.svg";
import ndm from "../../public/ndm.svg";

export default function Header({subtitle}){

    return(
        <header className={styles.headerContainer}>

            <div className={styles.title}>
                <h1 className={styles.hd}>
                    <Image src={ndd} width="1500" height="131" alt="nicolas"/>
                </h1>
                <h1 className={styles.hm}>
                    <Image src={ndm} width="537" height="189" alt="nicolas"/>
                </h1>
                <div className={styles.subtitle}>
                <h2>{subtitle}</h2>
                </div>
            </div>

        </header>
    )
}