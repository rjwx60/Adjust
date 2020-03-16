function sendMessage(message) {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true
    },
    function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, message, {}, function(response) {
        if (chrome.runtime.lastError) {
          console.log("error:" + chrome.runtime.lastError);
        } else {
          // console.log("response: ", response);
          // console.log("message successfully sent");
          init(response.styleRules, response.scriptRules);
        }
      });
    }
  );
}

sendMessage({ cmd: "popup" });


function init(styleRules, scriptRules) {
  new Vue({
    el: '#list',
    data: {
      styleRules: styleRules,
      scriptRules: scriptRules,
      visible: false,
      blogTitle: 'hi'
    },
    data() {
      return {
        list:[{
          hostname: 'mp.weixin.qq.com',
          urlparams: '',
          on: true,
          scriptRules: [],
          styleRules: [
            {
              only: true,
              target: '.qr_code_pc',
              excepetTarget: '',
              valueArr: [
                {
                  id: 1,
                  key: 'display',
                  value: 'none',
                }
              ],
              on: true
            },
            {
              only: true,
              target: '.rich_media_area_primary_inner',
              excepetTarget: '',
              valueArr: [
                {
                  id: 2,
                  key: 'maxWidth',
                  value: '1377px',
                }
              ],
              on: true
            }
          ]
        }]
      }
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


