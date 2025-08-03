import { globalVar } from "@/store/globalVar.js";

export async function getTTS(text, langCode, langName) {
  if (!text.trim()) return;

  const response = await fetch("https://translate.ruskcode.top/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, langCode, langName }),
  });

  const arrayBuffer = await response.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
  const url = URL.createObjectURL(blob);
  return url;
}

export async function getTranslation(text, model) {
  if (!text.trim() || text === "当前网站禁止ocr" || text === "加载中...")
    return;

  const response = await fetch("https://translate.ruskcode.top/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, model }),
  });

  const data = await response.json();
  return data.translation;
}

// 检测文本的语言类型
function detectLanguage(text) {
  const chineseRegex = /[\u4e00-\u9fff]/g;
  const englishRegex = /[a-zA-Z]/g;

  const chineseMatches = text.match(chineseRegex) || [];
  const englishMatches = text.match(englishRegex) || [];

  const chineseCount = chineseMatches.length;
  const englishCount = englishMatches.length;

  // 如果中文字符占比超过30%，认为是中文为主
  const totalChars = chineseCount + englishCount;
  if (totalChars === 0) return "en-US"; // 默认英文

  const chineseRatio = chineseCount / totalChars;
  return chineseRatio > 0.3 ? "zh-CN" : "en-US";
}

export function playWebTTS(inputText) {
  return new Promise((resolve, reject) => {
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(inputText);

    // 根据文本内容自动选择语言
    const detectedLang = detectLanguage(inputText);
    utterance.lang = detectedLang;
    utterance.rate = 1.2;
    utterance.volume = 0.6;

    const voices = speechSynthesis.getVoices();
    let selectedVoice;

    if (detectedLang === "zh-CN") {
      // 优先选择中文音色
      selectedVoice =
        voices.find((v) => v.name === "婷婷") ||
        voices.find((v) => v.lang.includes("zh-CN"));
    } else {
      // 优先选择英文音色
      selectedVoice =
        voices.find((v) => v.name === "Samantha") ||
        voices.find((v) => v.lang.includes("en-US"));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      resolve();
    };

    utterance.onerror = (e) => {
      console.error("TTS 播放错误：", e.error);
      reject(e.error);
    };

    speechSynthesis.speak(utterance);
  });
}

export async function playGoogleTTS(inputText) {
  if (inputText === "当前网站禁止ocr" || inputText === "加载中...") {
    return;
  }

  // 根据文本内容自动选择语言
  const detectedLang = detectLanguage(inputText);
  let langCode, langName;

  if (detectedLang === "zh-CN") {
    // 中文语音参数
    langCode = "zh-CN";
    langName = "cmn-TW-Standard-B"; // 或其他中文音色
  } else {
    // 英文语音参数
    langCode = "en-US";
    langName = "en-US-News-N"; // 或其他英文音色
  }

  if (!globalVar.audioUrl) {
    globalVar.audioUrl = await getTTS(inputText, langCode, langName);
  }
  const audio = new Audio(globalVar.audioUrl); // 一个实例只能播放一次
  audio.volume = 0.5;
  try {
    await audio.play();
  } catch (err) {
    console.warn("音频播放失败，尝试降级方案");
    // 调用你的备用 TTS
    await playWebTTS(inputText);
  }
}
