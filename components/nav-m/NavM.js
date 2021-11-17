import { useEffect, useRef, useState } from "react";
import MenuBars from "../../svg/MenuBars";
import styles from "./navM.module.css";

const leng= "en";

const PROJECTS="projects";
const ABOUT= "about";
const CONTACT= "contact";

export default function NavM(){

    const [open, setOpen]= useState(false);
    const [selected, setSelected]= useState(PROJECTS);
    const projectRef= useRef(null);
    const aboutRef= useRef(null);
    const contactRef= useRef(null);
    const selectorRef= useRef(null);
    const navRef= useRef(null);

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
    return(
        <div className={styles.mainContainer}>
        <div className={open ? styles.open : styles.close} ref={navRef}>
            <nav className={styles.nav}>
                <div className={ styles.selector } ref={selectorRef}>
                    <ul>
                        <li><a href="#">Projects</a></li>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </div>
                <ul>
                    <li ref={projectRef} onClick={()=>click(PROJECTS)}><a href="#">Projects</a></li>
                    <li ref={aboutRef} onClick={()=>click(ABOUT)}><a href="#">About</a></li>
                    <li ref={contactRef} onClick={()=>click(CONTACT)}><a href="#">Contact</a></li>
                </ul>
            <div className={styles.language}>
                <button className={leng === "en" ? styles.selected : ""}>EN</button>
                <button className={leng === "es" ? styles.selected : ""}>ES</button>
            </div>
            </nav>
        </div>
        <button onClick={()=>setOpen((pass)=> !pass)}>
            <MenuBars classN={styles.bars}/>
        </button>
        </div>
    )
}