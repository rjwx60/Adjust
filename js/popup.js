// 与 concept-script 通信
function sendMessageToContentScript(message, callback){
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
      if (callback) {
        callback(response);
      }
    })
  })
}

sendMessageToContentScript({cmd: 'popup'}, (response) => {
  const list = document.querySelector('#list');
  const UlNode = document.createElement('ul');
  const styleRules = response.styleRules;
  list.innerHTML = `<h3>${response.hostname}</h3>`;
  styleRules.forEach(cv => {
    let listValue = '';
    cv.valueArr.forEach(cvv => {
      listValue += `<dl class="valueItem">${cvv.key}:${cvv.value};</dl>`
    });

    UlNode.innerHTML += `
    <li>
      <dl class="valueList">
        <dt class="valueTitle">${cv.target}</dt>
        ${listValue}
      </dl>
      <input type="radio" name="" id="" checked="${cv.on}">
    </li>
    `;
  });
  list.appendChild(UlNode);
})


// {
//   hostname: 'mp.weixin.qq.com',
//   urlparams: '',
//   scriptRules: [],
//   styleRules: [
//     {
//       only: true,
//       target: '.qr_code_pc',
//       excepetTarget: '',
//       valueArr: [
//         {
//           key: 'display',
//           value: 'none',
//         }
//       ],
//       on: true
//     },
//     {
//       only: true,
//       target: '.rich_media_area_primary_inner',
//       excepetTarget: '',
//       valueArr: [
//         {
//           key: 'maxWidth',
//           value: '1377px',
//         }
//       ],
//       on: true
//     }
//   ]
// }