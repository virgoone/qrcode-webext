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
      if (info.selectionText && tab?.id) {
        console.log('info.selectionText--->', info.selectionText)
        chrome.tabs.sendMessage(tab.id, {
          type: 'SHOW_QR_GEN_RESULT',
          data: info.selectionText
        })
      }
      break
    }

    case CONTEXT_MENU_ITEMS.GENERATE_QR_LINK: {
      console.log('info.linkUrl--->', info.linkUrl)
      if (info.linkUrl && tab?.id) {
        chrome.tabs.sendMessage(tab.id, {
          type: 'SHOW_QR_GEN_RESULT',
          data: info.linkUrl
        })
      }
      break
    }

    case CONTEXT_MENU_ITEMS.SCAN_QR: {
      if (info.srcUrl && tab?.id) {
        scanQRCodeFromImage(info.srcUrl)
          .then((result) => {
            console.log('扫码成功--->', result, tab.id)
            if (result) {
              // 发送消息给 content script 显示 Modal
              chrome.tabs.sendMessage(tab.id, {
                type: 'SHOW_QR_RESULT',
                data: result
              })
            }
          })
          .catch((error) => {
            console.error('扫码失败--->', error)
            // 可以选择显示错误 Modal
            chrome.tabs.sendMessage(tab.id, {
              type: 'SHOW_QR_RESULT_ERROR',
              data: `扫描失败: ${error.message}`
            })
          })
      }
      break
    }
  }
}
