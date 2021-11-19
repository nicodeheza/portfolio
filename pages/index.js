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
import { useState } from "react";
import Loading from "../components/loading/Loading";
import {useTranslations} from "next-intl";

export async function getStaticProps({locale}){
  const messages= await import(`../messages/${locale}.json`);
  //console.log(locale);
  return{
    props:{
      messages: messages.default
    }
  }
}

export default function Home() {
  const t= useTranslations('Home');
  const [loading, setLoading]= useState(true);
  const [showLoading, setShowLoading]= useState(true);

  return (
    <div className={styles.container} id="mainContainer">
      <Head>
        <title>Nicolas Deheza</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThreeBk setLoading={setLoading}/>
      <Header subtitle={t("subtitle")} />
      <div className={styles.transition} id="t1" />
      <Projects
        title={"Project Title"}
        subtitle={"Project Subtitle"}
        imageSRC={"/lorem.jpg"}
        text={[t("Article.technologys"), t("Article.code"), t("Article.demo")]}
      />
      <div className={styles.transition} id="t2" />
      <Projects
        title={"Project Title"}
        subtitle={"Project Subtitle"}
        imageSRC={"/lorem.jpg"}
        text={[t("Article.technologys"), t("Article.code"), t("Article.demo")]}
      />
      <div className={styles.transition} id="t3" />
      <Projects
        title={"Project Title"}
        subtitle={"Project Subtitle"}
        imageSRC={"/lorem.jpg"}
        text={[t("Article.technologys"), t("Article.code"), t("Article.demo")]}
      />
      <div className={styles.transition} id="t4" />
      <OthersProjects title={t("OthersProjects.title")} 
      text={[t("Article.technologys"), t("Article.code"), t("Article.demo")]}/>
      <div className={styles.transition} id="t5" />
      <About  title={t("About.title")}/>
      <div className={styles.transition} id="t6" />
      <Contact text={[t("Contact.name"), t("Contact.email"), t("Contact.phone"), t("Contact.message"),
       t("Contact.send"), t("Contact.required"), t("Contact.title")]} />

      <NavM 
      projects={t("Nav.projects")}
      about={t("Nav.about")}
      contact={t("Nav.contact")}
      />
      <NavD 
      projects={t("Nav.projects")}
      about={t("Nav.about")}
      contact={t("Nav.contact")}/>
      {
        showLoading ? (<Loading loading={loading} setShowLoading={setShowLoading} />) : (null)
      }
    </div>
  );
}
