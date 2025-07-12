import { useEffect, useState } from "react";
import styles from "./Header.module.scss";
import loge from "@public/icons/icon32.png";
import useStore from "@/store/store.js";
import voice from "@/assets/svg/voice.svg";
import voiceChecked from "@/assets/svg/voiceChecked.svg";
import translate from "@/assets/svg/translate.svg";
import translateChecked from "@/assets/svg/translateChecked.svg";

function Header() {
  const { aiVoice, aiTranslate } = useStore();
  const { setAIVoice, setAITranslate } = useStore.getState();

  useEffect(() => {}, []);

  return (
    <div className={styles.header}>
      <div className={styles.iconBox}>
        <img src={loge} alt="Logo" />
      </div>
      <div
        className={styles.voiceToggle}
        onClick={() => {
          setAIVoice(!aiVoice);
        }}
      >
        <img
          style={{ display: aiVoice ? "none" : "block" }}
          src={voice}
          title="普通发音"
        ></img>
        <img
          style={{ display: aiVoice ? "block" : "none" }}
          src={voiceChecked}
          title="ai发音"
        ></img>
      </div>
      <div
        className={styles.translateToggle}
        onClick={() => {
          setAITranslate(!aiTranslate);
        }}
      >
        <img
          style={{ display: aiTranslate ? "none" : "block" }}
          src={translate}
          title="普通翻译"
        ></img>
        <img
          style={{ display: aiTranslate ? "block" : "none" }}
          src={translateChecked}
          title="ai翻译"
        ></img>
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
