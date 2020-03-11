chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('request: ', request);
  console.log('sender: ', sender);
  sendResponse("mp.weixin.qq.com" === request.location.hostname);
});