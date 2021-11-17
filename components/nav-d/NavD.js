import { useState } from "react";
import styles from "./navD.module.css";
const PROJECTS= "projects";
const ABOUT= "about";
const CONTACT= "contact";

const leng= "en"

export default function NavD(){

    const[selected, setSelected]= useState(PROJECTS);

    return(
        <div className={styles.mainContainer}>
            <nav className={styles.nav}>
                <ul>
                    <li><a href="#" onClick={()=>setSelected(PROJECTS)}>Projects</a> / </li>
                    <li><a href="#" onClick={()=>setSelected(ABOUT)}>About</a> / </li>
                    <li><a href="#" onClick={()=>setSelected(CONTACT)}>Contact</a></li>
                </ul>
                <div className={selected === PROJECTS ? styles.projects : selected === ABOUT ? styles.about : styles.contact} />
            </nav>
            <div className={styles.language}>
                <button className={leng === "en" ? styles.selected : ""}>EN</button>
                <button className={leng === "es" ? styles.selected : ""}>ES</button>
            </div>
        </div>
    )
}