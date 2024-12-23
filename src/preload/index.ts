import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      ...electronAPI,
      getClerkKey: () => ipcRenderer.invoke('get-clerk-key')
    })
    contextBridge.exposeInMainWorld('api', api)

    ipcRenderer.on('clerk-key', (_, key) => {
      contextBridge.exposeInMainWorld('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', key)
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = {
    ...electronAPI,
    getClerkKey: (): Promise<unknown> => ipcRenderer.invoke('get-clerk-key')
  }
  // @ts-ignore (define in dts)
  window.api = api

  ipcRenderer.on('clerk-key', (_, key) => {
    // @ts-ignore (define in dts)
    window.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = key
  })
}
