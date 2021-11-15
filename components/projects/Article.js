/* eslint-disable @next/next/no-img-element */
import styles from "./article.module.css";
import Image from "next/image";
import GitHubLogo from "../../svg/GitHubLogo";
import WebLogo from "../../svg/WebLogo";
import { useState } from "react";

export default function Article({setShowArticle, technologys}){
     const [eleMount, setEleMount]=useState( true );

    return(
        <div className={styles.mainContainer}>
        <article className={ `${styles.articleContainer} ${eleMount ? styles.open : styles.close}` }
        onAnimationEnd={()=> !eleMount ? setShowArticle(false) : null}>
            
            <div className={styles.btnContainer}>
                <button onClick={()=>setEleMount(false)}/>
            </div>

            <div className={styles.contentContainer}>
             <div className={styles.videoContainer}>
                <div className={styles.iframeContainer}>
                <iframe
                 width="560" height="315"
                src="https://www.youtube.com/embed/CT3kP62Febg" 
                title="YouTube video player" frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen />
                </div>
                </div>
                <h1>Project Title</h1>
                <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
                    sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna 
                    aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation 
                    ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor 
                    in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at 
                    vero eros et accumsan et iusto </p>
                    <h3>Technologys:</h3>
                    <div className={styles.logos}>
                    {
                            technologys.map((tech, i)=>(
                            <a href={tech.web} target="_blank" rel="noreferrer" key={i}>
                                    <img src={`/lorem/${tech.logo}`}  alt="logo" />
                            </a>
                            ))
                        }
                    </div>
                    <div className={styles.links}>
                        <a href="#">Source Code <GitHubLogo classN={styles.gitHubLogo}/></a>
                        <a href="#">Live Demo <WebLogo classN={styles.webLogo}/></a>
                    </div>

            </div>

        </article>
        </div>
    )
}

