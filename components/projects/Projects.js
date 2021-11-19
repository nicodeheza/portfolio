import Image from "next/image";
import styles from "./projects.module.css";
import Article from "./Article";
import { useEffect, useState } from "react";

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

export default function Projects({ title, subtitle, imageSRC, text }) {
  const [showArticle, setShowArticle] = useState(false);

  useEffect(() => {
    // const mainContainer= document.getElementById("mainContainer");
    const mainContainer = document.querySelector("body");

    if (showArticle) {
      mainContainer.style.overflowY = "hidden";
    } else {
      mainContainer.style.overflowY = "auto";
    }
  }, [showArticle]);

  return (
    <section className={styles.sectionContainer}>
      <div className={styles.eleContainer}>
        <div
          className={styles.titleContainer}
          onClick={() => setShowArticle(true)}
        >
          <h1>{title}</h1>
          <h2>{subtitle}</h2>
        </div>
        <div
          className={styles.imageContainer}
          onClick={() => setShowArticle(true)}
        >
          <Image
            src={imageSRC}
            width="700"
            height="400"
            alt="project preview image"
          />
        </div>
      </div>
      {showArticle ? (
        <Article setShowArticle={setShowArticle} technologys={technologys} text={text} />
      ) : null}
    </section>
  );
}
