import { useEffect, useRef, useState } from "react";
import MenuBars from "../../svg/MenuBars";
import styles from "./navM.module.css";

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

    useEffect(()=>{
        function setPosition(){
            const rect= selected === PROJECTS ?
                        projectRef.current.getBoundingClientRect() :
                        selected === ABOUT ? 
                        aboutRef.current.getBoundingClientRect() :
                        contactRef.current.getBoundingClientRect();
                        
            const center= ((rect.bottom - rect.top) / 2 )+ rect.top;
            selectorRef.current.style.clipPath= `circle(55px at center ${center}px)`;
        }

        if(open){
            setPosition();
        } 

        addEventListener("resize", setPosition, false);

        return()=> removeEventListener("resize", setPosition, false);

    },[selected, open]);

    function click(section){
        setSelected(section);
        setTimeout(()=>{
            setOpen(false);
        }, 1000);
    }
    return(
        <div className={styles.mainContainer}>
        <div className={open ? styles.open : styles.close}>
        <nav className={styles.nav}>
            <div ref={selectorRef} className={ styles.selector }>
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
        </nav>
        </div>
        <button onClick={()=>setOpen((pass)=> !pass)}>
            <MenuBars classN={styles.bars}/>
        </button>
        </div>
    )
}