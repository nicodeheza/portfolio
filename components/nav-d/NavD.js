import { useState } from "react";
import styles from "./navD.module.css";
import {useRouter} from "next/router";
const PROJECTS= "projects";
const ABOUT= "about";
const CONTACT= "contact";

const leng= "en"

export default function NavD({projects, about, contact}){
    const[selected, setSelected]= useState(PROJECTS);
    const router= useRouter();

    function changeLeng(){
        if(router.locale === "es"){
            router.push("/", "/", {locale: "en"});
        }else{
            router.push("/", "/", {locale: "es"});
        }
    }

    return(
        <div className={styles.mainContainer}>
            <nav className={styles.nav}>
                <ul>
                    <li><a href="#" onClick={()=>setSelected(PROJECTS)}>{projects}</a> / </li>
                    <li><a href="#" onClick={()=>setSelected(ABOUT)}>{about}</a> / </li>
                    <li><a href="#" onClick={()=>setSelected(CONTACT)}>{contact}</a></li>
                </ul>
                <div className={selected === PROJECTS ? styles.projects : selected === ABOUT ? styles.about : styles.contact} />
            </nav>
            <div className={styles.language}>
                <button className={router.locale === "en" ? styles.selected : ""}
                onClick={()=> changeLeng()}>
                EN
                </button>
                <button className={router.locale === "es" ? styles.selected : ""}
                 onClick={()=> changeLeng()}>
                 ES
                </button>
            </div>
        </div>
    )
}