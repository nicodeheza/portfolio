import { useEffect, useRef, useState } from "react";
import MenuBars from "../../svg/MenuBars";
import styles from "./navM.module.css";
import {useRouter} from "next/router";

const PROJECTS="projects";
const ABOUT= "about";
const CONTACT= "contact";

export default function NavM({projects, about, contact}){
    const [open, setOpen]= useState(false);
    const [selected, setSelected]= useState(PROJECTS);
    const projectRef= useRef(null);
    const aboutRef= useRef(null);
    const contactRef= useRef(null);
    const selectorRef= useRef(null);
    const navRef= useRef(null);
    const router= useRouter();

    useEffect(()=>{
        function setPosition(){
            const rect= selected === PROJECTS ?
                        projectRef.current.getBoundingClientRect() :
                        selected === ABOUT ? 
                        aboutRef.current.getBoundingClientRect() :
                        contactRef.current.getBoundingClientRect();
                        
            const center= ((rect.bottom - rect.top) / 2 ) + rect.top;
            selectorRef.current.style.clipPath= `circle(55px at center ${center}px)`;
        }
        const nav= navRef.current;
        if(open){
            setPosition();
            nav.addEventListener("transitionend", setPosition, false);
        } 
        addEventListener("resize", setPosition, false);
        return()=>{
            removeEventListener("resize", setPosition, false);
            nav.removeEventListener("transitionend", setPosition, false);
        } 
     
    },[selected, open]);

    function click(section){
        setSelected(section);
        setTimeout(()=>{
            setOpen(false);
        }, 1000);
    }

    function changeLeng(){
        if(router.locale === "es"){
            router.push("/", "/", {locale: "en"});
            setOpen(false);
        }else{
            router.push("/", "/", {locale: "es"});
            setOpen(false);
        }
    }
    return(
        <div className={styles.mainContainer}>
        <div className={open ? styles.open : styles.close} ref={navRef}>
            <nav className={styles.nav}>
                <div className={ styles.selector } ref={selectorRef}>
                    <ul>
                        <li><a href="#">{projects}</a></li>
                        <li><a href="#">{about}</a></li>
                        <li><a href="#">{contact}</a></li>
                    </ul>
                </div>
                <ul>
                    <li ref={projectRef} onClick={()=>click(PROJECTS)}><a href="#">{projects}</a></li>
                    <li ref={aboutRef} onClick={()=>click(ABOUT)}><a href="#">{about}</a></li>
                    <li ref={contactRef} onClick={()=>click(CONTACT)}><a href="#">{contact}</a></li>
                </ul>
            <div className={styles.language}>
                <button className={router.locale === "en" ? styles.selected : ""}
                onClick={()=>changeLeng()}>
                EN
                </button>
                <button className={router.locale === "es" ? styles.selected : ""}
                onClick={()=>changeLeng()}>
                ES
                </button>
            </div>
            </nav>
        </div>
        <button onClick={()=>setOpen((pass)=> !pass)}>
            <MenuBars classN={styles.bars}/>
        </button>
        </div>
    )
}