import { create } from "zustand";

// 使用 Zustand 创建 store
const useStore = create((set) => ({
  inputText: "",
  setInputText: (newText) => set({ inputText: newText }),
  translation: "",
  setTranslation: (newText) => set({ translation: newText }),
}));

export default useStore;
