import styles from "./Header.module.scss";
import loge from "@public/icons/icon32.png";
import useStore from "@/store/store.js";
import translate from "@/assets/svg/translate.svg";
import translateChecked from "@/assets/svg/translateChecked.svg";
import close from "@/assets/svg/close.svg";
import { getTranslation } from "@/utils/tool.js";

function Header() {
  const { aiTranslateChecked, inputText } = useStore();
  const { setAITranslateChecked, setTranslation } = useStore.getState();

  async function updateTranslation() {
    setAITranslateChecked(!aiTranslateChecked);
    const model = aiTranslateChecked
      ? "google/gemma-3-4b-it:free"
      : "openai/gpt-4.1-nano"; // aiTranslateChecked更新不及时
    setTranslation("加载中...");
    const translation = await getTranslation(inputText, model);
    setTranslation(translation);
  }

  return (
    <div className={styles.header}>
      <div className={styles.iconBox}>
        <img src={loge} alt="Logo" />
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
        <img src={close}></img>
      </div>
    </div>
  );
}

export default Header;
