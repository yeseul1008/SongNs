// components/Sidebar/Sidebar.js
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <button>🎵</button>
      <button>👍</button>
      <button>🎧</button>
      <button>🏠</button>
      <button>💻</button>
    </aside>
  );
}
