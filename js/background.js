const ruleArrayTest = [
  {
    hostname: 'mp.weixin.qq.com',
    urlparams: '',
    on: true,
    id: 12323,
    scriptRules: [],
    styleRules: [
      {
        only: true,
        target: '.qr_code_pc',
        excepetTarget: '',
        id: 123141555,
        valueArr: [
          {
            id: 1123,
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
        id: 123141553,
        valueArr: [
          {
            id: 2141,
            key: 'maxWidth',
            value: '1377px',
          }
        ],
        on: true
      }
    ]
  },
  {
    hostname: 'juejin.im',
    urlparams: '',
    on: true,
    id: 123232328,
    scriptRules: [],
    styleRules: [
      {
        only: true,
        target: 'main.container',
        excepetTarget: '',
        id: 1231415211,
        valueArr: [
          {
            id: 112153,
            key: 'maxWidth',
            value: '1260px',
          }
        ],
        on: true
      },
      {
        only: true,
        target: '.main-area',
        excepetTarget: '',
        id: 12314152119,
        valueArr: [
          {
            id: 221124,
            key: 'width',
            value: '1200px',
          }
        ],
        on: true
      },
      {
        only: true,
        target: '.article-suspended-panel',
        excepetTarget: '',
        id: 123141521993,
        valueArr: [
          {
            id: 323131,
            key: 'right',
            value: '30px',
          }
        ],
        on: true
      },
      {
        only: true,
        target: '.sidebar',
        excepetTarget: '',
        id: 12314152167233,
        valueArr: [
          {
            id: 4232,
            key: 'left',
            value: '10px',
          },
          {
            id: 54231,
            key: 'position',
            value: 'fixed'
          }
        ],
        on: true
      },
      {
        only: false,
        target: '.sidebar-block',
        excepetTarget: 'catalog-block.pure',
        id: 12314152143245,
        valueArr: [
          {
            id: 613123,
            key: 'display',
            value: 'none',
          }
        ],
        on: true
      },
      {
        only: false,
        target: 'p',
        excepetTarget: '',
        id: 1231415211013,
        valueArr: [
          {
            id: 721351,
            key: 'margin',
            value: '0px',
          }
        ],
        on: true
      },
      {
        only: false,
        target: 'h3',
        excepetTarget: '',
        id: 1231415211032,
        valueArr: [
          {
            id: 8123,
            key: 'margin',
            value: '0px',
          }
        ],
        on: true
      },
      {
        only: false,
        target: 'h4',
        excepetTarget: '',
        id: 123141521191231,
        valueArr: [
          {
            id: 9123,
            key: 'margin',
            value: '0px',
          }
        ],
        on: true
      },
      {
        only: false,
        target: 'ol',
        excepetTarget: '',
        id: 123141521211419,
        valueArr: [
          {
            id: 10123,
            key: 'margin',
            value: '0px',
          }
        ],
        on: true
      },
      {
        only: false,
        target: 'pre',
        excepetTarget: '',
        id: 1231231012,
        valueArr: [
          {
            id: 1124232,
            key: 'margin',
            value: '0px',
          }
        ],
        on: true
      }
    ]
  }
]

var ruleArray = null;

// 监听页面变化
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  getStorage().then(res => {
    // set ruleArray
    ruleArray = res;
    return new Promise((resolve, reject) => {
      const target = res && res.filter(cv => {
        return cv.hostname === request.location.hostname;
      })[0];
      target ? resolve(target) : reject('no match target');
    })
  }).then(target => {
    return new Promise((resolve, reject) => {
      sendResponse(target ? target : null);
    })
  }).catch(err => {
    console.log('error: ', err);
  });
  return true;
});

// 获取存储
function getStorage(target = 'rules'){
  // 读取数据，第一个参数是指定要读取的key以及设置默认值
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(target, function(items) {
      resolve(items.rules);
    });
  })
}

// 设置存储
function setStorage(target) {
  // 保存数据
  return new Promise((resolve, reject) => {
    if (target) {
      const index = ruleArray.findIndex(cv => cv.hostname == target.hostname);
      if (index !== -1) {
        ruleArray.splice(index, 1, target);
        // e.g. {color: 'blue'}
        chrome.storage.sync.set({rules: ruleArray}, function() {
          resolve({
            code: 200,
            error: 0,
            info: 'save success',
          });
        });
      }
    }
  })
}


window.onload = function() {
  Vue.component('todo-item', {
    props: ['todo'],
    template: '<li>{{ todo.text }}</li>'
  })
  
  var app = new Vue({
    el: '#app',
    data: {
      groceryList: [
        { id: 0, text: '蔬菜' },
        { id: 1, text: '奶酪' },
        { id: 2, text: '随便其它什么人吃的东西' }
      ]
    }
  })
}