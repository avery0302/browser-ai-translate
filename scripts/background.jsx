chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translate",
    title: "AI语义翻译",
    contexts: ["selection"],
  });
  
  chrome.contextMenus.create({
    id: "screenshot-translate",
    title: "截图翻译",
    contexts: ["page"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "translate") {
    // 向 content.js 发送消息，显示气泡框
    chrome.tabs.sendMessage(tab.id, {
      type: "SHOW_POPOVER",
    });
  } else if (info.menuItemId === "screenshot-translate") {
    // 先让content script准备选区信息
    chrome.tabs.sendMessage(tab.id, {
      type: "PREPARE_SCREENSHOT",
    });
  }
});

// 监听来自content script的消息
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === "CAPTURE_SCREENSHOT") {
    console.log('@@@333',)
    try {
      // 使用chrome.tabs.captureVisibleTab截图
      const dataUrl = await chrome.tabs.captureVisibleTab(sender.tab.windowId, {
        format: 'png'
      });
      
      // 将截图数据发送回content script
      chrome.tabs.sendMessage(sender.tab.id, {
        type: "PROCESS_SCREENSHOT",
        dataUrl: dataUrl,
        selectionRect: message.selectionRect
      });
    } catch (error) {
      console.error('Screenshot capture failed:', error);
    }
  }
});
