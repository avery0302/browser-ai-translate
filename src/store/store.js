import { create } from "zustand";

// 使用 Zustand 创建 store
const useStore = create((set) => ({
  inputText: "",
  setInputText: (newText) => set({ inputText: newText }),
  translation: "",
  setTranslation: (newText) => set({ translation: newText }),
  aiVoiceChecked: true,
  setAIVoiceChecked: (newVal) => set({ aiVoiceChecked: newVal }),
  aiTranslateChecked: true,
  setAITranslateChecked: (newVal) => set({ aiTranslateChecked: newVal }),
  voiceLoading: false,
  setVoiceLoading: (newVal) => set({ voiceLoading: newVal }),
}));

export default useStore;
