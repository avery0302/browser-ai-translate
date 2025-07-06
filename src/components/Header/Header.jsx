import { useEffect, useState } from "react";
import styles from "./Header.module.scss";
import loge from "@public/icons/icon32.png";

function Header() {
  const [state, setState] = useState({});

  useEffect(() => {}, []);

  return (
    <div className={styles.header}>
      <div className={styles.iconBox}>
        <img src={loge} alt="Logo" />
      </div>
      <div
        className={styles.closeBox}
        onClick={() => {
          popover.style.display = "none";
        }}
      >
        ×
      </div>
    </div>
  );
}

export default Header;
