import Image from "next/image";
import styles from "./projects.module.css";
import Article from "./Article";
import { useEffect, useState } from "react";


export default function Projects({ id, projectData, imageSRC, text }) {
  const [showArticle, setShowArticle] = useState(false);

  useEffect(() => {
    const mainContainer = document.querySelector("body");

    if (showArticle) {
      mainContainer.style.overflowY = "hidden";
    } else {
      mainContainer.style.overflowY = "auto";
    }
  }, [showArticle]);

  return (
    <section id={id} className={styles.sectionContainer}>
      <div className={styles.eleContainer}>
        <div
          className={styles.titleContainer}
          onClick={() => setShowArticle(true)}
        >
          <h1>{projectData.title}</h1>
          <h2>{projectData.subtitle}</h2>
        </div>
        <div
          className={styles.imageContainer}
          onClick={() => setShowArticle(true)}
        >
          <Image
            src={`/strapiImg/${projectData.thumbnail.hash}${projectData.thumbnail.ext}`}
            width="700"
            height="400"
            alt="project preview image"
          />
        </div>
      </div>
      {showArticle ? (
        <Article setShowArticle={setShowArticle}
         text={text}
         projectData={projectData}
           />
      ) : null}
    </section>
  );
}
