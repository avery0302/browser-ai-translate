import { create } from "zustand";

// 使用 Zustand 创建 store
const useStore = create((set) => ({
  inputText: "",
  setInputText: (newText) => set({ inputText: newText }),
  translation: "",
  setTranslation: (newText) => set({ translation: newText }),
  aiVoice: true,
  setAIVoice: (newVal) => set({ aiVoice: newVal }),
  aiTranslate: true,
  setAITranslate: (newVal) => set({ aiTranslate: newVal }),
}));

export default useStore;
