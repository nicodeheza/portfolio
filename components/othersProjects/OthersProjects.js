import styles from "./othersProjects.module.css";
import Article from "../projects/Article";
import {useState} from "react";

const projects=["Project Title 1", "Project Title 2", "Project Title 3", "Project Title 4", "Project Title 5",
"Project Title 1", "Project Title 2", "Project Title 3", "Project Title 4", "Project Title 5"];

const technologys = [
    {
      logo: "react.svg",
      web: "https://reactjs.org/",
    },
    {
      logo: "express.svg",
      web: "https://expressjs.com/",
    },
    {
      logo: "mongo.svg",
      web: "https://www.mongodb.com/",
    },
  ];

export default function OthersProjects({title, text}){

    const [showArticle, setShowArticle] = useState(false);

    return(
        <section className={styles.main}>
            <div className={styles.content}>
            <div className={styles.title}>
                <h1>{title}</h1>
            </div>
            <div className={styles.list}>
                <ul>
                    {
                        projects.map((p, i)=>(
                            <li key={i} onClick={()=>setShowArticle(true)}>{p}</li>
                        ))
                    }
                </ul>
            </div>
            </div>
            {
                showArticle ? 
            (<Article technologys={technologys} setShowArticle={setShowArticle} text={text} />) : (null)
            
            }

        </section>
    )
}