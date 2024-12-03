import jsQR from "jsqr"

export async function scanQRCodeFromImage(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    
    img.onload = () => {
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")
      
      if (!context) {
        reject(new Error("Failed to get canvas context"))
        return
      }
      
      canvas.width = img.width
      canvas.height = img.height
      context.drawImage(img, 0, 0)
      
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)
      
      if (code) {
        resolve(code.data)
      } else {
        reject(new Error("No QR code found in image"))
      }
    }
    
    img.onerror = () => {
      reject(new Error("Failed to load image"))
    }
    
    img.src = imageUrl
  })
}