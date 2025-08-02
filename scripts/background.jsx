chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "text-translate",
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
  if (info.menuItemId === "text-translate") {
    // 向 content.js 发送消息，显示气泡框
    chrome.tabs.sendMessage(tab.id, {
      type: "TEXT_TRANSLATE",
    });
  } else if (info.menuItemId === "screenshot-translate") {
    // 先截取整个屏幕
    const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, {
      format: "png",
    });

    // 发送截图数据给content script准备选区
    chrome.tabs.sendMessage(tab.id, {
      type: "SCREEN_TRANSLATE",
      screenshotData: dataUrl,
    });
  }
});
