import { init } from "@plasmohq/selector/background"
import { handleContextMenuClick, setupContextMenus } from "~background/context-menu"

// Initialize context menus
chrome.runtime.onInstalled.addListener(() => {
  setupContextMenus()
})

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(handleContextMenuClick)

init({
  monitorId: process.env.PLASMO_PUBLIC_ITERO_SELECTOR_MONITOR_ID
})
