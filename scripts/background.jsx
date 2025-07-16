chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translate",
    title: "AI语义翻译",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "translate") {
    // 向 content.js 发送消息，显示气泡框
    chrome.tabs.sendMessage(tab.id, {
      type: "SHOW_POPOVER",
    });
  }
});
