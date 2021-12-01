/* eslint-disable @next/next/no-img-element */
import styles from "./article.module.css";
import ReactMarkdown from "react-markdown";
import GitHubLogo from "../../svg/GitHubLogo";
import WebLogo from "../../svg/WebLogo";
import { useState } from "react";
import Image from "next/image";

export default function Article({setShowArticle, text, projectData}){
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
                {
                    projectData.youTubeURL ? (
                    <div className={styles.iframeContainer}>
                    <iframe
                    width="560" height="315"
                    src={projectData.youTubeURL} 
                    title="YouTube video player" frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen />
                    </div>
                    ) : (
                        <div className={styles.img}>
                        <Image
                        src={`/strapiImg/${projectData.thumbnail.hash}${projectData.thumbnail.ext}`}
                        width="700"
                        height="400"
                        alt="project preview image"
                         />
                         </div>
                    )
                }
                </div>
                <h1>{projectData.title}</h1>
                <ReactMarkdown className={styles.text}>{projectData.text}</ReactMarkdown>
                    <h3>{text[0]}</h3>
                    <div className={styles.logos}>
                    {
                            projectData.technologies.map((tech, i)=>(
                            <a href={tech.pageUrl} target="_blank" rel="noreferrer" key={i}>
                                    <img src={`/tech/${tech.name}.svg`}  alt={`${tech.name} logo`} />
                            </a>
                            ))
                        }
                    </div>
                    <div className={styles.links}>
                        <a href={projectData.gitHubUrl} target="_blank" rel="noreferrer">{text[1]} <GitHubLogo classN={styles.gitHubLogo}/></a>
                        <a href={projectData.demoUrl} target="_blank" rel="noreferrer">{text[2]} <WebLogo classN={styles.webLogo}/></a>
                    </div>

            </div>

        </article>
        </div>
    )
}

