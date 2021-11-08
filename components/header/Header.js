import style from "./header.module.css";
import Image from "next/image";
import ndd from "../../public/ndd.svg";
import ndm from "../../public/ndm.svg";

export default function Header(){

    return(
        <header className={style.headerContainer}>

            <div className={style.title}>
                <h1 className={style.hd}>
                    <Image src={ndd} width="1500" height="131" alt="nicolas"/>
                </h1>
                <h1 className={style.hm}>
                    <Image src={ndm} width="537" height="189" alt="nicolas"/>
                </h1>
                <div className={style.subtitle}>
                <h2>Web Developer</h2>
                </div>
            </div>

        </header>
    )
}