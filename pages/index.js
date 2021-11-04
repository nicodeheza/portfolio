import Head from 'next/head'
import styles from '../styles/Home.module.css'
import ThreeBk from '../components/three/ThreeBk'

export default function Home() {
  return (
    <div className={styles.container} id="mainContainer">
      <Head>
        <title>Nicolas Deheza</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThreeBk />
      <div className={styles.home}/>
      <div className={styles.transition} id="t1"/> 
      <div className={styles.project}/> 
      <div className={styles.transition} id="t2"/> 
      <div className={styles.project}/> 
      <div className={styles.transition} id="t3"/> 
      <div className={styles.project}/>
      <div className={styles.transition} id="t4"/> 
      <div className={styles.project}/>
      <div className={styles.transition} id="t5"/> 
      <div className={styles.about}/>
      <div className={styles.transition} id="t6"/> 
      <div className={styles.contact}/>
      
    </div>
  )
}
