import { scanQRCodeFromImage } from "~contents/qr-scanner"

const CONTEXT_MENU_ITEMS = {
  GENERATE_QR_SELECTION: "generate-qr-selection",
  GENERATE_QR_LINK: "generate-qr-link",
  SCAN_QR: "scan-qr"
} as const

export function setupContextMenus() {
  // Create menu item for text selection
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ITEMS.GENERATE_QR_SELECTION,
    title: "将选中文字生成二维码",
    contexts: ["selection"]
  })

  // Create menu item for links
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ITEMS.GENERATE_QR_LINK,
    title: "将链接生成二维码",
    contexts: ["link"]
  })

  // Create menu item for images
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ITEMS.SCAN_QR,
    title: "解析二维码",
    contexts: ["image"]
  })
}

export function handleContextMenuClick(
  info: chrome.contextMenus.OnClickData,
  tab?: chrome.tabs.Tab
) {
  switch (info.menuItemId) {
    case CONTEXT_MENU_ITEMS.GENERATE_QR_SELECTION: {
      if (info.selectionText) {
        chrome.windows.create({
          url: chrome.runtime.getURL("popup.html") + `?text=${encodeURIComponent(info.selectionText)}`,
          type: "popup",
          width: 400,
          height: 500
        })
      }
      break
    }

    case CONTEXT_MENU_ITEMS.GENERATE_QR_LINK: {
      if (info.linkUrl) {
        chrome.windows.create({
          url: chrome.runtime.getURL("popup.html") + `?text=${encodeURIComponent(info.linkUrl)}`,
          type: "popup",
          width: 400,
          height: 500
        })
      }
      break
    }

    case CONTEXT_MENU_ITEMS.SCAN_QR: {
      if (info.srcUrl) {
        scanQRCodeFromImage(info.srcUrl)
          .then((result) => {
            if (result) {
              chrome.notifications.create({
                type: "basic",
                iconUrl: chrome.runtime.getURL("assets/icon.png"),
                title: "二维码扫描结果",
                message: result,
                buttons: [
                  {
                    title: "复制内容"
                  },
                  {
                    title: "在新标签页打开"
                  }
                ]
              })
            }
          })
          .catch((error) => {
            chrome.notifications.create({
              type: "basic",
              iconUrl: chrome.runtime.getURL("assets/icon.png"),
              title: "扫描失败",
              message: error.message
            })
          })
      }
      break
    }
  }
}
