import Image from "next/image";
import styles from "./styles/page.module.css";


export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.container}>  
          <video className={styles.video} src="/videos/360.mp4" autoPlay loop muted />
        <div className={styles.content}>
        <p className={styles.title}>DG-tal 4ngel</p>
            <div className={styles.menu}>
              <a href="/start">Start Journey</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
