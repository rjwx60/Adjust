chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('request: ', request);
  console.log('sender: ', sender);
  const Wx = "mp.weixin.qq.com" === request.location.hostname;
  const Juejin = "juejin.im" === request.location.hostname;
  const response = Wx ? 'wx' : Juejin ? 'juejin' : '';
  sendResponse(response);
});