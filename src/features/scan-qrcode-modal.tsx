'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { ExternalLink, Copy, Check } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog"
import { Button } from "./button"
import { Textarea } from "./textarea"

interface Props {
  result: string
  onClose: () => void
}

export function QRCodeModal({ result: qrContent, onClose }: Props) {
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setIsOpen(true)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    onClose()
  }

  const handleCopy = () => {
    if (textareaRef.current) {
      textareaRef.current.select()
      document.execCommand('copy')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleOpenLink = () => {
    if (qrContent.startsWith('http://') || qrContent.startsWith('https://')) {
      window.open(qrContent, '_blank')
    } else {
      alert('内容不是有效的URL')
    }
  }

  const isScanError = useMemo(() => {
    return qrContent.includes('扫描失败')
  }, [qrContent])

  const isLink = useMemo(() => {
    return qrContent.startsWith('http://') || qrContent.startsWith('https://')
  }, [qrContent])

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleClose}
      modal={true}
    >
      <DialogContent
        className="sm:max-w-[425px]"
        style={{
          zIndex: 9999
        }}
      >
        <DialogHeader>
          <DialogTitle>识别到的二维码内容</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Textarea
            ref={textareaRef}
            value={qrContent}
            readOnly
            className="min-h-[100px] resize-none box-border max-w-full"
          />
          {!isScanError &&
            <div className="flex justify-between gap-4">
              {isLink &&
                <Button variant="outline" onClick={handleOpenLink} className="flex-1 !cursor-pointer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  打开链接
                </Button>
              }
              <Button onClick={handleCopy} className="flex-1 !cursor-pointer">
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    复制{isLink ? `链接` : '内容'}
                  </>
                )}
              </Button>
            </div>
          }
        </div>
      </DialogContent>
    </Dialog>
  )
}

