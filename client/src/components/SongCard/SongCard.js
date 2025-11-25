// components/SongCard/SongCard.js
import styles from "./SongCard.module.css";

export default function SongCard() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <div className={styles.songTitle}>Attention</div>
          <div className={styles.artist}>NewJeans</div>
        </div>
        <div className={styles.date}>2025.11.25</div>
      </div>

      <div className={styles.albumImg}></div>

      <p className={styles.description}>
        내용 내용 내용 내용 내용 내용 내용 내용 내용 내용 내용 내용 내용 내용 ...
      </p>

      <div className={styles.footer}>
        <button>👍</button>
        <button className={styles.playBtn}></button>
        <button>💬</button>
      </div>
    </div>
  );
}
