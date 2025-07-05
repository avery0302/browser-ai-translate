let popover = null; // 在全局作用域声明 popover

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("@监听结果");

  // 如果是 SHOW_POPOVER 消息
  if (message.type === "SHOW_POPOVER") {
    if (!popover) {
      console.log("@首次");
      popover = document.createElement("div");
      popover.style.position = "absolute";
      popover.style.backgroundColor = "rgba(255,255,255,1)";
      popover.style.color = "#333333";
      popover.style.fontSize = "18px";
      popover.style.padding = "20px";
      popover.style.borderRadius = "8px";
      popover.style.zIndex = "10000";
      popover.style.width = "200px";
      popover.style.height = "100px";
      popover.style.boxShadow = "5px 5px 15px rgba(0, 0, 0, 0.3)";
      document.body.appendChild(popover);
    }
    console.log("@非首次");
    // 获取选中区域的位置
    const area = getSelectionArea();
    console.log("@area", area);

    popover.innerText = "...";
    popover.style.left = `${area.left + area.width / 2 - 100}px`;
    popover.style.top = `${area.top + area.height + 10}px`;
    popover.style.display = "block";

    // 可选：移除点击事件监听器，防止内存泄漏
    document.removeEventListener("click", handleOutsideClick);
    // 监听文档点击事件，点击非气泡框区域时隐藏气泡框
    document.addEventListener("click", handleOutsideClick);
  }

  // 如果是 SHOW_TRANSLATION 消息
  if (message.type === "SHOW_TRANSLATION" && popover) {
    popover.innerText = message.text; // 更新气泡框的内容
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
