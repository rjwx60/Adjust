/**
 * background - 背景页
 */
// background 不能使用 import 格式且无法被 webpack 处理
// 因处理后代码函数无法被 popup 通过 chrome.extension.getBackgroundPage.functionName 获取并通信
// 但想使用 scss 格式，故在此处引入，随 webpack 处理后再在 html 中引入
import '../css/background.scss'

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


function Background() {
  this.currentRule = null;
}

Background.prototype.getStorage = function(target = 'rules') {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(target, function(items) {
      resolve(items.rules ? items.rules : ruleArrayTest);
      // resolve(ruleArrayTest)
    });
  });
}

Background.prototype.setStorage = function (keys = 'rules', value = null) {
  return new Promise((resolve, reject) => {
    if (value) {
      // 存储操作
      const obj = {};
      obj[keys] = value;
      chrome.storage.sync.set(obj, function() {
        resolve();
      });
    } else {
      reject('value is null');
    }
  })
}

Background.prototype.setNewRule = function(rule) {
  // 保存数据
  return new Promise((resolve, reject) => {
    if (rule) {
      const index = this.currentRule.findIndex(
        cv => cv.hostname == rule.hostname
      );
      if (index !== -1) {
        this.currentRule.splice(index, 1, rule);
        chrome.storage.sync.set({ rules: this.currentRule }, function() {
          resolve({
            code: 200,
            error: 0,
            info: "save success"
          });
        });
      }
    } else {
      reject();
    }
  });
}

Background.prototype.randomCode = function(len = 16, isMix = false) {
  const cahrs = isMix ? "123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" : '123456789'
  const maxPos = cahrs.length;
  let randomString = "";
  for (i = 0; i < len; i++) {
    randomString += cahrs.charAt(Math.floor(Math.random() * maxPos));
  }
  return randomString;
}

Background.prototype.logger = function (info, content, type = 1) {
  const logTypeMap = {
    1: (...args) => { console.log(args) },
    2: (...args) => { console.error(args) },
    3: (...args) => { console.dir(args) }
  }
  logTypeMap[type](info, content);
}

// 负责监听页面变化 -> 向 popup 返回请求的 targetRule
Background.prototype.addListener = function() {
  const _this = this;
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    _this.getStorage()
      .then(targetRule => {
        return new Promise((resolve, reject) => {
          const target = 
            targetRule &&
            targetRule.filter(cv => {
              return cv.hostname === request.location.hostname;
            })[0];
          target ? resolve(target) : resolve(null);
        });
      })
      .then(target => {
        return new Promise((resolve, reject) => {
          sendResponse(target);
        });
      })
      .catch(err => {
        _this.logger('err', err);
      });
    return true;
  });  
}

Background.prototype.init = function() {
  this.getStorage().then(rulesList => {
    this.currentRule = rulesList;
    this.rulesListRender(rulesList);
    this.logger('rulesList: ', rulesList)
  });
}

Background.prototype.rulesListRender = function(rulesList) {
  const _this = this;
  if (rulesList && rulesList.length) {
    new Vue({
      el: "#app",
      data: {
        rulesList,
        newRule: null,
      },
      mounted() {
        this.allHide();
      },
      methods: {
        changeStyle(rule, valueItem) {
          _this.logger('valueItem: ', valueItem)
          if(valueItem.combine) {
            const resultArr = valueItem.combine.split(":");
            // 格式限制
            if (resultArr.length === 2) {
              // 横线转驼峰处理
              if(/^([a-z]+[-][a-z]+)*$/.test(resultArr[0])) {
                valueItem.key = resultArr[0].replace(/-([a-z])/, (all, letter) => letter.toUpperCase());
              } 
              // 信息录入
              valueItem.key = resultArr[0].trim();
              valueItem.value = resultArr[1].trim();
              // fix: 此段需注释掉
              valueItem.value = /;$/.test(valueItem.value) ? valueItem.value : `${valueItem.value}`;
              // 主体录入
              this.newRule = rule;
            }
          }
        },
        toggleRule(rule, styleRules) {
          styleRules.on = !styleRules.on;
          this.newRule = rule;
        },
        toggleHide(rule){
          this.newRule = null;
          rule.selected = !rule.selected;
        },
        allHide() {
          this.rulesList.forEach(cv => {
            if(cv.selected){
              cv.selected = false;
            }
          })
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
            id: _this.randomCode(),
            valueArr: [
              {
                id: _this.randomCode(),
                key: "",
                value: "",
                combine: ""
              }
            ]
          };
          rule.styleRules.push(styleRule);
        },
        addScript(rule) {
          // TODO: 展示 + Markdown 更改增加规则按钮位置
          const scriptRule = {
            on: true,
            id: _this.randomCode(),
            valueArr: [{
              type: 'string',
              script: "console.log('script test')"
            }]
          };
          rule.scriptRules.push(scriptRule);
        },
        addRule(){
          this.newRule = {
            hostname: "",
            urlparams: "",
            on: true,
            id: _this.randomCode(),
            scriptRules: [],
            styleRules: [],
            selected: false
          };
          this.rulesList.push(this.newRule)
          this.addStyle(this.newRule);
          this.addScript(this.newRule);
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
          console.log('this.rulesList: ', this.rulesList);
          _this.setStorage('rules', this.rulesList).then(() => {
            alert('save success');
          }).catch((err) => {
            alert(err);
          })
        },
        info(message) {
          alert(message);
        }
      }
    });
  }
}

const background = new Background();
background.addListener();
background.init();

function GetBgInstance() {
  return background;
}

