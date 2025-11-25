// components/SearchBar/SearchBar.js
import styles from "./SearchBar.module.css";

export default function SearchBar() {
  return (
    <div className={styles.searchContainer}>
      <input placeholder="Search..." />
      <button className={styles.searchBtn}>🔍</button>
    </div>
  );
}
