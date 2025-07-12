import { useEffect, useRef, useState } from "react";
import useStore from "@/store/store.js";
import styles from "./InputText.module.scss";
import voice from "@/assets/svg/voice.svg";
import { getTTS } from "@/utils/tool.js";

let audioUrl;

function InputText() {
  const { inputText, aiVoice } = useStore();
  const inputTextRef = useRef(null);
  const [state, setState] = useState({});

  const playWebTTS = () => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(inputText);
    utterance.lang = "en-US";
    utterance.rate = 1.2;
    utterance.volume = 0.4;
    utterance.voice = speechSynthesis
      .getVoices()
      .find((v) => v.name === "Google US English");
    speechSynthesis.speak(utterance);
  };

  async function playGoogleTTS() {
    if (!audioUrl) {
      audioUrl = await getTTS(inputText);
    }
    const audio = new Audio(audioUrl); // 一个实例只能播放一次
    audio.volume = 0.5;
    audio.play();
  }

  function playTTS() {
    if (aiVoice) {
      playGoogleTTS();
    } else {
      playWebTTS();
    }
  }

  useEffect(() => {
    if (inputTextRef.current && window.popover && inputText) {
      audioUrl = undefined;
      playTTS();
      const inputTextHeight = inputTextRef.current.offsetHeight;
      window.popover.style.height = `${inputTextHeight + 25 + 72}px`;
    }
  }, [inputText]);

  return (
    <div className={styles.inputText}>
      <div className={styles.voiceBox}>
        <img onClick={playTTS} src={voice}></img>
      </div>
      <div className={styles.inputText} ref={inputTextRef}>
        {inputText}
      </div>
    </div>
  );
}

export default InputText;
