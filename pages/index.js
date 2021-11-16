import Head from "next/head";
import styles from "../styles/Home.module.css";
import ThreeBk from "../components/three/ThreeBk";
import Header from "../components/header/Header";
import NavD from "../components/nav-d/NavD";
import NavM from "../components/nav-m/NavM";
import Projects from "../components/projects/Projects";
import OthersProjects from "../components/othersProjects/OthersProjects";
import About from "../components/about/About";
import Contact from "../components/contact/Contact";

export default function Home() {
  return (
    <div className={styles.container} id="mainContainer">
      <Head>
        <title>Nicolas Deheza</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThreeBk />
      <Header />
      <div className={styles.transition} id="t1" />
      <Projects
        title={"Project Title"}
        subtitle={"Project Subtitle"}
        imageSRC={"/lorem.jpg"}
      />
      <div className={styles.transition} id="t2" />
      <Projects
        title={"Project Title"}
        subtitle={"Project Subtitle"}
        imageSRC={"/lorem.jpg"}
      />
      <div className={styles.transition} id="t3" />
      <Projects
        title={"Project Title"}
        subtitle={"Project Subtitle"}
        imageSRC={"/lorem.jpg"}
      />
      <div className={styles.transition} id="t4" />
      <OthersProjects />
      <div className={styles.transition} id="t5" />
      <About />
      <div className={styles.transition} id="t6" />
      <Contact />

      <NavM />
      <NavD />
    </div>
  );
}
