import { useEffect, useRef, useState } from "react";
import styles from "./navD.module.css";
import {useRouter} from "next/router";
const PROJECTS= "projects";
const ABOUT= "about";
const CONTACT= "contact";


export default function NavD({projects, about, contact}){
    const[selected, setSelected]= useState(PROJECTS);
    const projectRef= useRef(null);
    const aboutRef= useRef(null);
    const contactRef= useRef(null);
    const selectorRef= useRef(null);
    const router= useRouter();

    useEffect(()=>{
        const projectWidth= projectRef.current.getBoundingClientRect().width;
        const aboutWidth= aboutRef.current.getBoundingClientRect().width;
        const contactWidth= contactRef.current.getBoundingClientRect().width;

        if(selected === PROJECTS){
           selectorRef.current.style.width= `${projectWidth + 12}px`;
           selectorRef.current.style.marginLeft= `0px`;
        }else if(selected === ABOUT){
           selectorRef.current.style.width= `${aboutWidth + 15}px`;
           selectorRef.current.style.marginLeft= `${projectWidth}px`;
        }else if(selected === CONTACT){
           selectorRef.current.style.width= `${contactWidth + 25}px`;
           selectorRef.current.style.marginLeft= `${projectWidth + aboutWidth + 5}px`;
        }
    },[selected, router.locale]);

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
                    <li ref={projectRef}><a href="#" onClick={()=>setSelected(PROJECTS)}>{projects}</a> / </li>
                    <li ref={aboutRef}><a href="#" onClick={()=>setSelected(ABOUT)}>{about}</a> / </li>
                    <li ref={contactRef}><a href="#" onClick={()=>setSelected(CONTACT)}>{contact}</a></li>
                </ul>
                <div ref={selectorRef} className={selected === PROJECTS ? styles.projects : selected === ABOUT ? styles.about : styles.contact} />
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