import { useState } from "react";
import style from "./navD.module.css";
const PROJECTS= "projects";
const ABOUT= "about";
const CONTACT= "contact";

export default function NavD(){

    const[selected, setSelected]= useState(PROJECTS);

    return(
        <nav className={style.nav}>
            <ul>
                <li><a href="#" onClick={()=>setSelected(PROJECTS)}>Projects</a> / </li>
                <li><a href="#" onClick={()=>setSelected(ABOUT)}>About</a> / </li>
                <li><a href="#" onClick={()=>setSelected(CONTACT)}>Contact</a></li>
            </ul>
            <div className={selected === PROJECTS ? style.projects : selected === ABOUT ? style.about : style.contact} />
        </nav>
    )
}