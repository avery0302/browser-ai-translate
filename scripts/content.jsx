import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import useStore from "@/store/store";
import App from "@/App.jsx";
import Tesseract from "tesseract.js";

const { setInputText } = useStore.getState();

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

// 框选相关变量
let isSelecting = false;
let selectionOverlay = null;
let selectionBox = null;
let startX = 0;
let startY = 0;
let screenshotData = null;

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "TEXT_TRANSLATE") {
    const selection = window.getSelection().toString();
    const area = getSelectionArea();
    showPopover(selection, area);
  } else if (message.type === "SCREEN_TRANSLATE") {
    // 创建截图框选模式
    screenshotData = message.screenshotData;
    startScreenshotSelection();
  }
});

function showPopover(selection, area) {
  setInputText(selection);

  popover.style.left = `${area.left + area.width / 2 - 175}px`;
  popover.style.top = `${area.top + area.height + 10}px`;
  popover.style.display = "block";

  // 可选：移除点击事件监听器，防止内存泄漏
  document.removeEventListener("click", handleOutsideClick);
  // 监听文档点击事件，点击非气泡框区域时隐藏气泡框
  document.addEventListener("click", handleOutsideClick);
}

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

// 开始截图框选模式
function startScreenshotSelection() {
  // 创建遮罩层
  selectionOverlay = document.createElement("div");
  selectionOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.3);
    cursor: crosshair;
    z-index: 999999;
    user-select: none;
  `;

  // 创建选择框
  selectionBox = document.createElement("div");
  selectionBox.style.cssText = `
    position: fixed;
    border: 2px solid #00aaff;
    background: rgba(0, 170, 255, 0.1);
    display: none;
    z-index: 1000000;
    pointer-events: none;
  `;

  // 添加到页面
  document.body.appendChild(selectionOverlay);
  document.body.appendChild(selectionBox);

  // 绑定鼠标事件
  selectionOverlay.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
}

// 鼠标按下开始选择
function handleMouseDown(e) {
  isSelecting = true;
  startX = e.clientX;
  startY = e.clientY;

  selectionBox.style.left = startX + "px";
  selectionBox.style.top = startY + "px";
  selectionBox.style.width = "0px";
  selectionBox.style.height = "0px";
  selectionBox.style.display = "block";
}

// 鼠标移动更新选择框
function handleMouseMove(e) {
  if (!isSelecting) return;

  const currentX = e.clientX;
  const currentY = e.clientY;

  const left = Math.min(startX, currentX);
  const top = Math.min(startY, currentY);
  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);

  selectionBox.style.left = left + "px";
  selectionBox.style.top = top + "px";
  selectionBox.style.width = width + "px";
  selectionBox.style.height = height + "px";
}

// 鼠标松开完成选择
function handleMouseUp(e) {
  if (!isSelecting) return;

  isSelecting = false;

  const currentX = e.clientX;
  const currentY = e.clientY;

  const left = Math.min(startX, currentX);
  const top = Math.min(startY, currentY);
  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);

  // 获取选择区域（包含滚动偏移）
  const selectionRect = {
    left: left + window.scrollX,
    top: top + window.scrollY,
    width: width,
    height: height,
  };

  console.log("选择区域:", selectionRect);

  // 清理界面
  document.body.removeChild(selectionOverlay);
  document.body.removeChild(selectionBox);
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);

  // 处理截图裁剪和OCR识别
  processScreenshotWithOCR(selectionRect);

  // 重置变量
  selectionOverlay = null;
  selectionBox = null;
  screenshotData = null;
}

// 处理截图并进行OCR识别
async function processScreenshotWithOCR(selectionRect) {
  // 创建Canvas进行图片裁剪
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();

  img.onload = async function () {
    // 获取设备像素比，处理高分辨率屏幕
    const devicePixelRatio = window.devicePixelRatio || 1;

    // 设置canvas尺寸为选中区域大小
    canvas.width = selectionRect.width * devicePixelRatio;
    canvas.height = selectionRect.height * devicePixelRatio;

    // 裁剪选中区域
    ctx.drawImage(
      img,
      selectionRect.left * devicePixelRatio,
      selectionRect.top * devicePixelRatio,
      selectionRect.width * devicePixelRatio,
      selectionRect.height * devicePixelRatio,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    // 将裁剪后的图片转换为blob
    canvas.toBlob(async (blob) => {
      try {
        const result = await Tesseract.recognize(blob, "eng+chi_sim");
        console.log("OCR识别结果:", result.data.text);
        showPopover(result.data.text, selectionRect);
      } catch (e) {
        console.error("OCR出错:", e);
        showPopover("当前网站禁止ocr", selectionRect);
      }
    }, "image/png");
  };

  img.src = screenshotData;
}
