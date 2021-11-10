import styles from "./navM.module.css";
import { useEffect, useRef, useState } from "react";


const PROJECTS="projects";
const ABOUT= "about";
const CONTACT= "contact";

export default function Menu({open}){

    const [selected, setSelected]= useState(PROJECTS);
    const projectRef= useRef(null);
    const aboutRef= useRef(null);
    const contactRef= useRef(null);
    const selectorRef= useRef(null);

    useEffect(()=>{
        const rect= selected === PROJECTS ?
                    projectRef.current.getBoundingClientRect() :
                    selected === ABOUT ? 
                    aboutRef.current.getBoundingClientRect() :
                    contactRef.current.getBoundingClientRect();

        const center= ((rect.bottom - rect.top) / 2 ) + rect.top;
        selectorRef.current.style.clipPath= `circle(55px at center ${center}px)`;
       
    },[selected]);

    return(
        <nav className={open ? styles.open : styles.close}>
            <div ref={selectorRef} className={styles.selector}>
                <ul>
                    <li><a href="#">Projects</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
            </div>
            <ul>
                <li ref={projectRef} onClick={()=>setSelected(PROJECTS)}><a href="#">Projects</a></li>
                <li ref={aboutRef} onClick={()=>setSelected(ABOUT)}><a href="#">About</a></li>
                <li ref={contactRef} onClick={()=>setSelected(CONTACT)}><a href="#">Contact</a></li>
            </ul>
        </nav>
    )
}