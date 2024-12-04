import "~base.css"
import "~style.css"

import QRCodeStyling, {
  type CornerDotType,
  type CornerSquareType,
  type DotType,
  type DrawType,
  type ErrorCorrectionLevel,
  type Mode,
  type Options,
  type TypeNumber
} from "qr-code-styling"
import { useEffect, useRef, useState, type ChangeEvent } from "react"

import { Button } from "~features/button"
import { Card, CardContent, CardFooter } from "~features/card"
import { Input } from "~features/input"
import { copyImageToClipboard } from "~utils/copy-image"

function IndexPopup() {
  const [options, setOptions] = useState<Options>({
    width: 300,
    height: 300,
    type: "svg" as DrawType,
    data: "https://douni.one",
    margin: 5,
    qrOptions: {
      typeNumber: 0 as TypeNumber,
      mode: "Byte" as Mode,
      errorCorrectionLevel: "Q" as ErrorCorrectionLevel
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 20,
      crossOrigin: "anonymous"
    },
    dotsOptions: {
      color: "#222222",
      type: "rounded" as DotType
    },
    backgroundOptions: {
      color: "#fff"
    },
    cornersSquareOptions: {
      color: "#222222",
      type: "extra-rounded" as CornerSquareType
    },
    cornersDotOptions: {
      color: "#222222",
      type: "dot" as CornerDotType
    }
  })
  const [qrCode] = useState<QRCodeStyling>(new QRCodeStyling(options))
  const ref = useRef<HTMLDivElement>(null)
  const [copyStatus, setCopyStatus] = useState<"idle" | "copying" | "success" | "error">("idle")

  useEffect(() => {
    if (!qrCode) return
    qrCode.update(options)
  }, [qrCode, options])

  useEffect(() => {
    if (ref.current) {
      qrCode.append(ref.current)
    }
  }, [qrCode, ref])

  useEffect(() => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const text = urlParams.get("text")

    if (text) {
      setOptions((options) => ({
        ...options,
        data: decodeURIComponent(text)
      }))
    } else {
      // If no text parameter, get current tab URL
      chrome.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
        if (tabs[0]?.url) {
          setOptions((options) => ({
            ...options,
            data: tabs[0].url
          }))
        }
      })
    }
  }, [])

  const onDataChange = (event: ChangeEvent<HTMLInputElement>) => {
    setOptions((options) => ({
      ...options,
      data: event.target.value
    }))
  }

  const onDownloadClick = () => {
    if (!qrCode) return
    qrCode.download({
      extension: "svg"
    })
  }

  const onCopyClick = async () => {
    if (!ref.current) return

    const svgElement = ref.current.querySelector('svg')
    if (!svgElement) return

    setCopyStatus("copying")
    try {
      await copyImageToClipboard(svgElement)
      setCopyStatus("success")
      setTimeout(() => setCopyStatus("idle"), 2000)
    } catch (error) {
      setCopyStatus("error")
      setTimeout(() => setCopyStatus("idle"), 2000)
    }
  }

  return (
    <Card className="w-[360px] flex flex-col p-2">
      <CardContent className="p-0 space-y-2">
        <div ref={ref} className="w-[340px] flex justify-center"></div>
        <div className="w-full pl-6 pr-6">
          {options.data && (
            <Input
              id="url"
              value={options.data}
              onChange={onDataChange}
              placeholder="输入文字或链接生成二维码"
            />
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-6 flex gap-2">
        <Button
          className="flex-1 flex-row items-center px-4 py-2 text-sm rounded-lg transition-all border-none
          shadow-gray-1 shadow-xs hover:shadow-md
          text-gray-12 bg-gray-2
          hover:bg-gray-3 
          active:bg-gray-4
          disabled:bg-gray-1 disabled:text-gray-11
          active:scale-105"
          onClick={onCopyClick}>
          {copyStatus === "copying" ? "复制中..." :
            copyStatus === "success" ? "已复制" :
              copyStatus === "error" ? "复制失败" : "复制图片"}
        </Button>
        <Button
          className="flex-1 flex-row items-center px-4 py-2 text-sm rounded-lg transition-all border-none
          shadow-gray-1 shadow-xs hover:shadow-md
          text-gray-12 bg-gray-2
          hover:bg-gray-3 
          active:bg-gray-4
          disabled:bg-gray-1 disabled:text-gray-11
          active:scale-105"
          onClick={onDownloadClick}>
          保存图片
        </Button>
      </CardFooter>
    </Card>
  )
}

export default IndexPopup