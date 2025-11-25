// components/Header/Header.js
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.title}>SongNs</div>
      <div className={styles.profileIcon}>👤</div>
    </header>
  );
}
