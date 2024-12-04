import { useState } from 'react'

export function useQRModal() {
  const [qrResult, setQRResult] = useState<string>("")
  const [showType, setShowType] = useState<"scan" | "gen">("scan")

  const showQRModal = (result: string, type: "scan" | "gen") => {
    setQRResult(result)
    setShowType(type)
  }

  const hideQRModal = () => {
    setQRResult("")
  }

  return {
    qrResult,
    showQRModal,
    hideQRModal,
    showType,
  }
}