import { useEffect, useState } from "react";
import styles from "./Header.module.scss";
import loge from "@public/icons/icon32.png";
import useStore from "@/store/store.js";
import voice from "@/assets/svg/voice.svg";
import voiceChecked from "@/assets/svg/voiceChecked.svg";
import translate from "@/assets/svg/translate.svg";
import translateChecked from "@/assets/svg/translateChecked.svg";
import { getTranslation, playGoogleTTS, playWebTTS } from "@/utils/tool.js";

function Header() {
  const { aiVoiceChecked, aiTranslateChecked, inputText } = useStore();
  const {
    setAIVoiceChecked,
    setAITranslateChecked,
    setTranslation,
    setVoiceLoading,
  } = useStore.getState();

  async function updateTranslation() {
    setAITranslateChecked(!aiTranslateChecked);
    const model = aiTranslateChecked
      ? "google/gemma-3-4b-it:free"
      : "openai/gpt-4.1-nano"; // aiTranslateChecked更新不及时
    setTranslation("加载中...");
    const translation = await getTranslation(inputText, model);
    setTranslation(translation);
  }

  async function updateVoice() {
    setVoiceLoading(true);
    setAIVoiceChecked(!aiVoiceChecked);
    if (!aiVoiceChecked) {
      await playGoogleTTS(inputText);
    } else {
      await playWebTTS(inputText);
    }
    setVoiceLoading(false);
  }

  return (
    <div className={styles.header}>
      <div className={styles.iconBox}>
        <img src={loge} alt="Logo" />
      </div>
      <div className={styles.voiceToggle} onClick={updateVoice}>
        <img
          style={{ display: aiVoiceChecked ? "none" : "block" }}
          src={voice}
          title="机器发音"
        ></img>
        <img
          style={{ display: aiVoiceChecked ? "block" : "none" }}
          src={voiceChecked}
          title="google发音"
        ></img>
      </div>
      <div className={styles.translateToggle} onClick={updateTranslation}>
        <img
          style={{ display: aiTranslateChecked ? "none" : "block" }}
          src={translate}
          title="gemma翻译"
        ></img>
        <img
          style={{ display: aiTranslateChecked ? "block" : "none" }}
          src={translateChecked}
          title="openai翻译"
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
