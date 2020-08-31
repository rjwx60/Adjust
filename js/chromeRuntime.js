const CRuntime = {
  getPackageDirectoryEntry: chrome.runtime.getPackageDirectoryEntry,
  sendMessage: chrome.runtime.sendMessage,
  onMessage: chrome.runtime.onMessage,
  lastError: chrome.runtime.lastError,
  cruntime: chrome.runtime
};

export { CRuntime };