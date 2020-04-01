const ruleArrayTest = [
  {
    hostname: "mp.weixin.qq.com",
    urlparams: "",
    on: true,
    id: 12323,
    scriptRules: [],
    styleRules: [
      {
        on: true,
        only: true,
        target: ".qr_code_pc",
        excepetTarget: "",
        id: 123141555,
        valueArr: [
          {
            id: 1123,
            key: "display",
            value: "none",
            combine: "display:none;"
          }
        ]
      },
      {
        on: true,
        only: true,
        target: ".rich_media_area_primary_inner",
        excepetTarget: "",
        id: 123141553,
        valueArr: [
          {
            id: 2141,
            key: "maxWidth",
            value: "1377px",
            combine: "maxWidth:1377px;"
          }
        ]
      }
    ],
    selected: false
  },
  {
    hostname: "juejin.im",
    urlparams: "",
    on: true,
    id: 12323232899,
    scriptRules: [],
    styleRules: [
      {
        on: true,
        only: true,
        target: "main.container",
        excepetTarget: "",
        id: 1231415211,
        valueArr: [
          {
            id: 112153,
            key: "maxWidth",
            value: "1260px",
            combine: "maxWidth:1260px;"
          }
        ]
      },
      {
        on: true,
        only: true,
        target: ".main-area",
        excepetTarget: "",
        id: 12314152119,
        valueArr: [
          {
            id: 221124,
            key: "width",
            value: "1200px",
            combine: "width:1200px;"
          }
        ]
      },
      {
        on: true,
        only: true,
        target: ".article-suspended-panel",
        excepetTarget: "",
        id: 123141521993,
        valueArr: [
          {
            id: 323131,
            key: "right",
            value: "30px",
            combine: "right:30px;"
          }
        ]
      },
      {
        on: true,
        only: true,
        target: ".sidebar",
        excepetTarget: "",
        id: 12314152167233,
        valueArr: [
          {
            id: 4232,
            key: "left",
            value: "10px",
            combine: "left:10px;"
          },
          {
            id: 54231,
            key: "position",
            value: "fixed",
            combine: "position:fixed;"
          }
        ]
      },
      {
        on: true,
        only: false,
        target: ".sidebar-block",
        excepetTarget: "catalog-block.pure",
        id: 12314152143245,
        valueArr: [
          {
            id: 613123,
            key: "display",
            value: "none",
            combine: "display:none"
          }
        ]
      },
      {
        on: true,
        only: false,
        target: "p",
        excepetTarget: "",
        id: 1231415211013,
        valueArr: [
          {
            id: 721351,
            key: "margin",
            value: "0px",
            combine: "margin:0px;"
          }
        ]
      },
      {
        on: true,
        only: false,
        target: "h3",
        excepetTarget: "",
        id: 1231415211032,
        valueArr: [
          {
            id: 8123,
            key: "margin",
            value: "0px",
            combine: "margin:0px;"
          }
        ]
      },
      {
        on: true,
        only: false,
        target: "h4",
        excepetTarget: "",
        id: 123141521191231,
        valueArr: [
          {
            id: 9123,
            key: "margin",
            value: "0px",
            combine: "margin:0px;"
          }
        ]
      },
      {
        on: true,
        only: false,
        target: "ol",
        excepetTarget: "",
        id: 123141521211419,
        valueArr: [
          {
            id: 10123,
            key: "margin",
            value: "0px",
            combine: "margin:0px;"
          }
        ]
      },
      {
        on: true,
        only: false,
        target: "pre",
        excepetTarget: "",
        id: 1231231012,
        valueArr: [
          {
            id: 1124232,
            key: "margin",
            value: "0px",
            combine: "margin:0px;"
          }
        ]
      }
    ],
    selected: false
  },
  {
    hostname: "github.com",
    urlparams: "",
    on: true,
    id: 12323232812399,
    scriptRules: [],
    styleRules: [
      {
        on: true,
        only: true,
        target: ".col-md-9",
        excepetTarget: "",
        id: 123141521114991,
        valueArr: [
          {
            id: 1121598993,
            key: "width",
            value: "100%",
            combine: "width:100%;"
          }
        ]
      }
    ],
    selected: false
  }
];

var globalRuleCache = null;

// 监听页面变化
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  getStorage()
    .then(res => {
      // set ruleArray
      ruleArray = res;
      return new Promise((resolve, reject) => {
        const target =
          res &&
          res.filter(cv => {
            return cv.hostname === request.location.hostname;
          })[0];
        target ? resolve(target) : reject("no match target");
      });
    })
    .then(target => {
      return new Promise((resolve, reject) => {
        sendResponse(target);
      });
    })
    .catch(err => {
      console.log("error: ", err);
    });
  return true;
});

// 主逻辑
function init() {
  getStorage().then(result => {
    globalRuleCache = result;
    ruleListRender(ruleArrayTest);
  });
}

// 获取存储
function getStorage(target = "rules") {
  // 读取数据，第一个参数是指定要读取的key以及设置默认值
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(target, function(items) {
      resolve(ruleArrayTest);
      console.log("ruleArrayTest: ", ruleArrayTest);
      // resolve(items.rules);
    });
  });
}

// 设置存储
function setStorage(target) {
  // 保存数据
  return new Promise((resolve, reject) => {
    if (target) {
      const index = globalRuleCache.findIndex(
        cv => cv.hostname == target.hostname
      );
      if (index !== -1) {
        globalRuleCache.splice(index, 1, target);
        // e.g. {color: 'blue'}
        chrome.storage.sync.set({ rules: globalRuleCache }, function() {
          resolve({
            code: 200,
            error: 0,
            info: "save success"
          });
        });
      }
    }
  });
}

// 生成随机数
function randomCode(len = 16, isMix = false) {
  // 去掉了字符 0
  const cahrs = isMix ? "123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" : '123456789'
  const maxPos = cahrs.length;
  let randomString = "";
  for (i = 0; i < len; i++) {
    randomString += cahrs.charAt(Math.floor(Math.random() * maxPos));
  }
  return randomString;
}


// 列表渲染
function ruleListRender(rulesList) {
  if (rulesList && rulesList.length) {
    new Vue({
      el: "#app",
      data: {
        rulesList,
        newRule: null,
        timer: null
      },
      methods: {
        changeStyle(rule, valueItem) {
          if (!this.timer) {
            this.timer = setTimeout(() => {
              if(valueItem.combine) {
                const resultArr = valueItem.combine.split(":");
                // 格式限制
                if (resultArr.length === 1) {
                  this.info('请输入正确格式的 style');
                  this.timer = null;
                  return;
                }
                // 横线转驼峰处理
                if(/^([a-z]+[-][a-z]+)*$/.test(resultArr[0])) {
                  valueItem.key = resultArr[0].replace(/-([a-z])/, (all, letter) => letter.toUpperCase());
                } 
                // 信息录入
                valueItem.key = resultArr[0];
                valueItem.value = resultArr[1];
                valueItem.value = /;$/.test(valueItem.value) ? valueItem.value : `${valueItem.value};`;
                // 主体录入
                this.newRule = rule;
                this.timer = null;
              }
            }, 5000)
          }

        },
        toggleRule(rule, styleRules) {
          styleRules.on = !styleRules.on;
          this.newRule = rule;
        },
        toggleHide(rule){
          this.rulesList.forEach(cv => {
            if(cv.selected){
              cv.selected = false;
            }
          })
          this.newRule = null;
          rule.selected = true;
        },
        deleteOne(rule, styleRules, valueItem) {
          const targetIndex = styleRules.valueArr.findIndex(cv => cv.id === valueItem.id);
          if (~targetIndex) {
            styleRules.valueArr.splice(targetIndex, 1);
          };
          rule.styleRules = rule.styleRules.filter(cv => cv.target && cv.valueArr.length);
          this.newRule = rule;
        },
        addStyle(rule) {
          const styleRule = {
            on: true,
            only: true,
            target: "",
            excepetTarget: "",
            id: randomCode(),
            valueArr: [
              {
                id: randomCode(),
                key: "",
                value: "",
                combine: ""
              }
            ]
          };
          rule.styleRules.push(styleRule);
        },
        addRule(){
          this.newRule = {
            hostname: "",
            urlparams: "",
            on: true,
            id: randomCode(),
            scriptRules: [],
            styleRules: [],
            selected: false
          };
          this.rulesList.push(this.newRule)
          this.addStyle(this.newRule);
        },
        refreshRule(){
          if (this.newRule && this.newRule.hostname ) {
            this.newRule.styleRules = this.newRule.styleRules.filter(cv => cv.target != '' );
            this.rulesList.forEach((cv, index, arr) => {
              if (cv.hostname === this.newRule.hostname) {
                cv = this.newRule;
              }
            })
          }
          // TODO: 存储操作
          console.log(this.rulesList);
        },
        info(message) {
          alert(message);
        }
      }
    });
  }
}

init();
