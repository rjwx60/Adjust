const ruleArray = [
  {
    hostname: 'mp.weixin.qq.com',
    urlparams: '',
    scriptRules: [],
    styleRules: [
      {
        only: true,
        target: '.qr_code_pc',
        excepetTarget: '',
        valueArr: [
          {
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
    scriptRules: [],
    styleRules: [
      {
        only: true,
        target: 'main.container',
        excepetTarget: '',
        valueArr: [
          {
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
            key: 'left',
            value: '10px',
          },
          {
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
  console.log('request: ', request);
  console.log('sender: ', sender);
  const target = ruleArray.filter(cv => {
    return cv.hostname === request.location.hostname
  })[0];
  sendResponse(target ? target : null);
});


