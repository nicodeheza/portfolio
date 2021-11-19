import { useEffect, useRef, useState } from "react";
import styles from "./navD.module.css";
import {useRouter} from "next/router";
import {PROJECTS, ABOUT, CONTACT} from "../../constant/constant"

export default function NavD({projects, about, contact, selected, pos}){
    const projectRef= useRef(null);
    const aboutRef= useRef(null);
    const contactRef= useRef(null);
    const selectorRef= useRef(null);
    const router= useRouter();

    //selector transform
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


    function goToId(id){
        const h= window.innerHeight;
        const offset= 3 * h / 100;
        if(selected !== id){
            //setSelected(id);
            if(id === PROJECTS){
                window.scrollTo({
                    top: pos.projects,
                    //behavior: "smooth"
                });
            }else if( id === ABOUT){
                window.scrollTo({
                    top: pos.about - offset,
                   // behavior: "smooth"
                });
            }else if( id === CONTACT){
                window.scroll({
                    top: pos.contact - offset,
                    //behavior: "smooth"
                });
            }
        }
    }

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
                    <li ref={projectRef}><a onClick={()=>goToId(PROJECTS)}>{projects}</a> / </li>
                    <li ref={aboutRef}><a onClick={()=>goToId(ABOUT)}>{about}</a> / </li>
                    <li ref={contactRef}><a onClick={()=>goToId(CONTACT)}>{contact}</a></li>
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