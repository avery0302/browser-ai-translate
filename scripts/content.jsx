import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import useStore from "@/store/store";
import App from "@/App.jsx";

const { setInputText, setTranslation } = useStore.getState();

// 创建popover节点
window.popover = document.createElement("div");
popover.style.display = "none";
popover.style.position = "absolute";
popover.style.borderRadius = "8px";
popover.style.overflow = "hidden";
popover.style.zIndex = "10000";
popover.style.width = "350px";
popover.style.height = "150px";
popover.style.boxShadow = "5px 5px 15px rgba(0, 0, 0, 0.3)";
// 挂载popover节点
document.body.appendChild(popover);
// 挂载app节点
createRoot(popover).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 如果是 SHOW_POPOVER 消息
  if (message.type === "SHOW_POPOVER") {
    const selection = window.getSelection().toString();
    setInputText(selection);
    setTranslation("加载中...");
    // 获取选中区域的位置
    const area = getSelectionArea();

    popover.style.left = `${area.left + area.width / 2 - 175}px`;
    popover.style.top = `${area.top + area.height + 10}px`;
    popover.style.display = "block";

    // 可选：移除点击事件监听器，防止内存泄漏
    document.removeEventListener("click", handleOutsideClick);
    // 监听文档点击事件，点击非气泡框区域时隐藏气泡框
    document.addEventListener("click", handleOutsideClick);
  }

  // 如果是 SHOW_TRANSLATION 消息
  if (message.type === "SHOW_TRANSLATION" && popover) {
    setTranslation(message.text);
  }
});

// 获取选中区域的位置信息
function getSelectionArea() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return null;

  // 获取选中的文本范围
  const range = selection.getRangeAt(0);

  // 获取范围的边界
  const rect = range.getBoundingClientRect();

  // 考虑滚动条的偏移
  const scrollX = document.documentElement.scrollLeft;
  const scrollY = document.documentElement.scrollTop;

  // 返回选中文本的左上角坐标（加上滚动偏移）
  return {
    left: rect.left + scrollX,
    top: rect.top + scrollY,
    width: rect.width,
    height: rect.height,
  };
}

// 监听点击事件，隐藏气泡框
function handleOutsideClick(event) {
  // 如果点击的目标不是气泡框本身，隐藏气泡框
  if (!popover.contains(event.target)) {
    // 隐藏气泡框
    popover.style.display = "none";
    // 可选：移除点击事件监听器，防止内存泄漏
    document.removeEventListener("click", handleOutsideClick);
  }
}
