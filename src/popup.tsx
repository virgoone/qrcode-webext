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
      // gradient: {
      //   type: 'linear', // 'radial'
      //   rotation: 0,
      //   colorStops: [{ offset: 0, color: '#8688B2' }, { offset: 1, color: '#77779C' }]
      // },
      type: "rounded" as DotType
    },
    backgroundOptions: {
      color: "#fff"
      // gradient: {
      //   type: 'linear', // 'radial'
      //   rotation: 0,
      //   colorStops: [{ offset: 0, color: '#ededff' }, { offset: 1, color: '#e6e7ff' }]
      // },
    },
    cornersSquareOptions: {
      color: "#222222",
      type: "extra-rounded" as CornerSquareType
      // gradient: {
      //   type: 'linear', // 'radial'
      //   rotation: 180,
      //   colorStops: [{ offset: 0, color: '#25456e' }, { offset: 1, color: '#4267b2' }]
      // },
    },
    cornersDotOptions: {
      color: "#222222",
      type: "dot" as CornerDotType
      // gradient: {
      //   type: 'linear', // 'radial'
      //   rotation: 180,
      //   colorStops: [{ offset: 0, color: '#00266e' }, { offset: 1, color: '#4060b3' }]
      // },
    }
  })
  const [qrCode] = useState<QRCodeStyling>(new QRCodeStyling(options))
  const ref = useRef<HTMLDivElement>(null)

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
    chrome.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
      setOptions((options) => ({
        ...options,
        data: tabs?.[0]?.url
      }))
    })
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
      extension: 'svg'
    })
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
              defaultValue="输入地址生成二维码"
            />
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-6">
        <Button
          className="flex flex-row items-center px-4 py-2 text-sm rounded-lg transition-all border-none
      shadow-gray-1 shadow-xs hover:shadow-md
      text-gray-12 bg-gray-2
      hover:bg-gray-3 
      active:bg-gray-4
      disabled:bg-gray-1 disabled:text-gray-11
      active:scale-105 w-full" onClick={onDownloadClick}>
          保存图片
        </Button>
      </CardFooter>
    </Card>
  )
}

export default IndexPopup
