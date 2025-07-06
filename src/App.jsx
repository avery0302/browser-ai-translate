import React from "react";
import Header from "./components/Header/Header.jsx";
import InputText from "./components/InputText/InputText.jsx";
import Translation from "./components/Translation/Translation.jsx";
import styles from "./App.module.scss";

const App = () => {
  return (
    <div className={styles.app}>
      <div className={styles.header}>
        <Header />
      </div>
      <div className={styles.inputText}>
        <InputText />
      </div>
      <div className={styles.translation}>
        <Translation />
      </div>
    </div>
  );
};

export default App;
