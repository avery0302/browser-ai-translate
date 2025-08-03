import { useEffect, useRef } from "react";
import useStore from "@/store/store.js";
import styles from "./InputText.module.scss";
import voice from "@/assets/svg/voice.svg";
import loading from "@/assets/svg/loading.svg";
import { getTranslation, playGoogleTTS } from "@/utils/tool.js";
import { globalVar } from "@/store/globalVar.js";

function InputText() {
  const { inputText, aiTranslateChecked, voiceLoading } = useStore();
  const { setTranslation, setVoiceLoading } = useStore.getState();
  const inputTextRef = useRef(null);

  async function playTTS() {
    setVoiceLoading(true);
    await playGoogleTTS(inputText);
    setVoiceLoading(false);
  }

  async function updateTranslation() {
    const model = !aiTranslateChecked
      ? "google/gemma-3-4b-it:free"
      : "openai/gpt-4.1-nano";
    setTranslation("加载中...");
    const translation = await getTranslation(inputText, model);
    setTranslation(translation);
  }

  useEffect(() => {
    if (inputTextRef.current && window.popover && inputText) {
      globalVar.audioUrl = undefined;
      playTTS();
      updateTranslation();
      const inputTextHeight = inputTextRef.current.offsetHeight;
      window.popover.style.height = `${inputTextHeight + 25 + 72}px`;
    }
  }, [inputText]);

  return (
    <div className={styles.inputText}>
      <div className={styles.voiceBox}>
        {voiceLoading ? (
          <div className={styles.imgBackground}>
            <img className={styles.loading} src={loading}></img>
          </div>
        ) : (
          <div className={styles.imgBackground}>
            <img className={styles.speaker} onClick={playTTS} src={voice}></img>
          </div>
        )}
      </div>
      <div className={styles.inputText} ref={inputTextRef}>
        {inputText}
      </div>
    </div>
  );
}

export default InputText;
