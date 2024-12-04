import type { PlasmoCSConfig, PlasmoGetShadowHostId, PlasmoCreateShadowRoot } from "plasmo"
import { useState, useEffect } from "react"
import { QRCodeModal } from '~features/scan-qrcode-modal'
import cssText from "data-text:~base.css"
import { useQRModal } from "~/hooks/useQRModal"
import { GenQRCodeModal } from '~features/gen-qrcode-modal'

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true,
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

// 设置 shadow host 的 ID
export const getShadowHostId: PlasmoGetShadowHostId = () => "plasmo-qr-modal"

// 创建 shadow root
export const createShadowRoot: PlasmoCreateShadowRoot = (shadowHost) =>
  shadowHost.attachShadow({ mode: "open" })

// 创建主组件
function ContentUI() {
  const { qrResult, showType, showQRModal, hideQRModal } = useQRModal()
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const messageListener = (message, sender, sendResponse) => {
      console.log('message--->', message)
      if (message.type === 'SHOW_QR_RESULT') {
        showQRModal(message.data, 'scan')
        setVisible(true)
      }
      if (message.type === 'SHOW_QR_RESULT_ERROR') {
        showQRModal(message.data, 'scan')
        setVisible(true)
      }

      if (message.type === 'SHOW_QR_GEN_RESULT') {
        showQRModal(message.data, 'gen')
        setVisible(true)
      }
      sendResponse({ success: true })

      return true
    }
    // 监听消息
    chrome.runtime.onMessage?.addListener(messageListener)

    return () => {
      chrome.runtime.onMessage?.removeListener(messageListener)
    }
  }, [])

  if (!visible) {
    return null
  }

  if (qrResult && showType === 'scan') {
    return (
      <QRCodeModal
        result={qrResult}
        key="scan"
        onClose={() => {
          hideQRModal()
          console.log('onClose--->')
        }}
      />
    )
  }
  if (qrResult && showType === 'gen') {
    return (
      <GenQRCodeModal
        key="gen"
        result={qrResult}
        onClose={() => {
          hideQRModal()
          console.log('onClose--->')
        }}
      />
    )
  }

  return null
}

export default ContentUI