import styles from "./loading.module.css";

export default function Loading({loading, setShowLoading}) {

  return (
    <div className={loading ? styles.main : styles.out}
    onAnimationEnd={()=>setShowLoading(false)}>
      <div className={styles.content}>
        <h1>Loading...</h1>
        <div className={styles.forms}>
          <div className={styles.circle} />
          <div className={styles.rect} />
          <div className={styles.triangle}>
            <div className={styles.innerTriangle} />
          </div>
        </div>
      </div>
    </div>
  );
}
