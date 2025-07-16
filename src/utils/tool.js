import { globalVar } from "@/store/globalVar.js";

export async function getTTS(text) {
  if (!text.trim()) return;

  const response = await fetch("https://translate.ruskcode.top/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const arrayBuffer = await response.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
  const url = URL.createObjectURL(blob);
  return url;
}

export async function getTranslation(text, model) {
  if (!text.trim()) return;

  const response = await fetch("https://translate.ruskcode.top/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, model }),
  });

  const data = await response.json();
  return data.translation;
}

export function playWebTTS(inputText) {
  return new Promise((resolve, reject) => {
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(inputText);
    utterance.lang = "en-US";
    utterance.rate = 1.2;
    utterance.volume = 0.4;

    const voices = speechSynthesis.getVoices();
    const selectedVoice = voices.find((v) => v.name === "Google US English");
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
  if (!globalVar.audioUrl) {
    globalVar.audioUrl = await getTTS(inputText);
  }
  const audio = new Audio(globalVar.audioUrl); // 一个实例只能播放一次
  audio.volume = 0.5;
  await audio.play();
}
