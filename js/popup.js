function connect(message) {
  chrome.tabs.query({ 
    active: true, 
    currentWindow: true 
  }, (tabs) => {
    const port = chrome.tabs.connect(tabs[0].id);
    console.log('port: ', port);
    port.postMessage(message);
    port.onMessage.addListener((response) => {
      console.log('response: ', response);
    });
  });
}

// connect({cmd: 'popup'})

window.addEventListener('load', (event) => {
  // chrome.tabs.executeScript(null, {
  //   file: 'content.bundle.js'
  // }, () => {
  //   connect({cmd: 'popup'})
  // });
  connect({cmd: 'popup'})
});




// // 与 concept-script 通信
// sendMessageToContentScript({ cmd: 'popup' }, (response) => {
//   if (response) {
//     init(response.styleRules, response.scriptRules);
//   }
// })


// function sendMessageToContentScript(message, callback) {
//   chrome.tabs.query({
//     active: true,
//     currentWindow: true
//   }, function (tabs) {
//     const port = chrome.tabs.connect(tabs[0].id);
//     port.postMessage(message);
//     port.onMessage.addListener((response) => {
//       console.log('response: ', response);
//     });
//   })
// }

// function init(styleRules, scriptRules) {
//   // new Vue({
//   //   el: '#list',
//   //   data: {
//   //     styleRules: styleRules,
//   //     scriptRules: scriptRules,
//   //     visible: false,
//   //     blogTitle: 'hi'
//   //   },
//   //   data() {
//   //     return {
//   //       list:[{
//   //         hostname: 'mp.weixin.qq.com',
//   //         urlparams: '',
//   //         on: true,
//   //         scriptRules: [],
//   //         styleRules: [
//   //           {
//   //             only: true,
//   //             target: '.qr_code_pc',
//   //             excepetTarget: '',
//   //             valueArr: [
//   //               {
//   //                 id: 1,
//   //                 key: 'display',
//   //                 value: 'none',
//   //               }
//   //             ],
//   //             on: true
//   //           },
//   //           {
//   //             only: true,
//   //             target: '.rich_media_area_primary_inner',
//   //             excepetTarget: '',
//   //             valueArr: [
//   //               {
//   //                 id: 2,
//   //                 key: 'maxWidth',
//   //                 value: '1377px',
//   //               }
//   //             ],
//   //             on: true
//   //           }
//   //         ]
//   //       }]
//   //     }
//   //   }, 
//   //   methods: {
//   //     show: function () {
//   //       this.visible = true;
//   //     }
//   //   },
//   //   // render: function (createElement) {
//   //   //   return createElement('h1', this.blogTitle)
//   //   // }
//   // });
// }



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