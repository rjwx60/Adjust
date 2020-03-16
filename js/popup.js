// 与 concept-script 通信
sendMessageToContentScript({ cmd: 'popup' }, (response) => {
  if (response) {
    console.log('response: ', response);
    init(response.styleRules, response.scriptRules);
  }
})

function sendMessageToContentScript(message, callback) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    chrome.tabs.sendMessage(tabs[ 0 ].id, message, function (response) {
      if (callback) {
        callback(response);
      }
    })
  })
}

function init(styleRules, scriptRules) {
  new Vue({
    el: '#list',
    data: {
      styleRules: styleRules,
      scriptRules: scriptRules,
      visible: false,
      blogTitle: 'hi'
    },
    methods: {
      show: function () {
        this.visible = true;
      }
    },
    // render: function (createElement) {
    //   return createElement('h1', this.blogTitle)
    // }
  });
}



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