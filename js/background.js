const ruleArray = [
  {
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
  },
  {
    hostname: 'juejin.im',
    urlparams: '',
    on: true,
    scriptRules: [],
    styleRules: [
      {
        only: true,
        target: 'main.container',
        excepetTarget: '',
        valueArr: [
          {
            id: 1,
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
        valueArr: [
          {
            id: 2,
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
        valueArr: [
          {
            id: 3,
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
        valueArr: [
          {
            id: 4,
            key: 'left',
            value: '10px',
          },
          {
            id: 5,
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
        valueArr: [
          {
            id: 6,
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
        valueArr: [
          {
            id: 7,
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
        valueArr: [
          {
            id: 8,
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
        valueArr: [
          {
            id: 9,
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
        valueArr: [
          {
            id: 10,
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
        valueArr: [
          {
            id: 11,
            key: 'margin',
            value: '0px',
          }
        ],
        on: true
      }
    ]
  }
]

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const target = ruleArray.filter(cv => {
    return cv.hostname === request.location.hostname
  })[0];
  sendResponse(target ? target : null);
});


chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(msg => {
    console.log('msg: ', msg);
  })
});
