import styles from "./othersProjects.module.css";
import Article from "../projects/Article";
import {useState, useEffect} from "react";


export default function OthersProjects({title, text, projectsData}){

    const [showArticle, setShowArticle] = useState(false);
    const [ArticleIndex, setArticleIndex]= useState(0);

    useEffect(() => {
        const mainContainer = document.querySelector("body");
    
        if (showArticle) {
          mainContainer.style.overflowY = "hidden";
        } else {
          mainContainer.style.overflowY = "auto";
        }
      }, [showArticle]);

    function article(index){
        setArticleIndex(index);
        setShowArticle(true);
    }

    return(
        <section className={styles.main}>
            <div className={styles.content}>
            <div className={styles.title}>
                <h1>{title}</h1>
            </div>
            <div className={styles.list}>
                <ul>
                    {
                        projectsData.map((p, i)=>(
                            <li key={i} onClick={()=>article(i)}>{p.title}</li>
                        ))
                    }
                </ul>
            </div>
            </div>
            {
                showArticle ? 
            (
            <Article
            setShowArticle={setShowArticle} 
            text={text} 
            projectData={projectsData[ArticleIndex]}
            />
            ) : (null)
            
            }

        </section>
    )
}