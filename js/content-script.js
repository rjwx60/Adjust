/**
 * content-script - 常驻脚本
 */

import { CRuntime } from './chromeAPI';

function ContentScript() {
  this.locationRule = null;
  this.messageInfoMap = {
    info: (...args) => {
      console.log("CRX-INFO: ", args);
    },
    success: (...args) => {
      console.log("CRX-SUCCESS: ", args);
    },
    error: (...args) => {
      console.log("CRX-ERROR: ", args);
      this.rePing();
    },
    refresh: (...args) => {
      console.log("CRX-REFRESH: ", args);
      this.reLoad();
    },
  };
}

// 初始化: 规则获取并应用
ContentScript.prototype.ConscriptInit = function () {
  this.sourcesGet().then((rule) => {
    this.locationRule = rule;
    this.changePageStructure(rule);
  });
};

// 应用核心: 样式处理逻辑
ContentScript.prototype.changePageStructure = function (rule) {
  if (rule) {
    window.onload = function () {
      setTimeout(() => {
        // 样式处理
        if (rule.styleRules.length) {
          const styleRules = rule.styleRules;
          rule.on &&
            styleRules.forEach((cv) => {
              // 是否单一节点
              if (cv.only) {
                const targetNode = document.querySelector(cv.target);
                targetNode &&
                  cv.on &&
                  cv.valueArr.forEach((cvv) => {
                    targetNode.style[cvv.key] = cvv.value;
                  });
              } else {
                const targetNodeArr = document.querySelectorAll(cv.target);
                targetNodeArr &&
                  cv.on &&
                  cv.valueArr.forEach((cvv) => {
                    targetNodeArr.forEach((target) => {
                      // 是否有排除项
                      if (!cv.excepetTarget) {
                        target.style[cvv.key] = cvv.value;
                      } else {
                        const regexp = new RegExp(cv.excepetTarget);
                        if (!regexp.test(target.className)) {
                          target.style[cvv.key] = cvv.value;
                        }
                      }
                    });
                  });
              }
            });
        }
        // // 脚本处理
        // if (rule.scriptRules.length) {
        //   const scriptRules = rule.scriptRules;
        //   rule.on && scriptRules.forEach(cv => {
        //     cv.on && cv.valueArr.forEach(cvv => {
        //       switch(cvv.type) {
        //         case 'file':
        //           break;
        //         case 'string':
        //           break;
        //         default:
        //           break;
        //       }
        //     })
        //   });
        // }
      }, 3000);
    };
  }
};

// 观察者: 观察来自 popup/background 的信息
ContentScript.prototype.addListener = function () {
  const _this = this;
  CRuntime.onMessage.addListener((request, sender, sendResponse) => {
    // 消息处理
    _this.messageInfoMap[request.type] && _this.messageInfoMap[request.type](request);

    // popup logic
    if (request.popup) {
      _this.rePing().then((response) => {
        sendResponse(response);
      });
    }
    // Error: The message port closed before a response was received
    // Add this can reduce it
    // https://stackoverflow.com/questions/54126343/how-to-fix-unchecked-runtime-lasterror-the-message-port-closed-before-a-respon
    return true;
  });
};

// 工具函数
ContentScript.prototype.rePing = function (cb) {
  const _this = this;
  const pollingTimes = [1, 2, 3, 4, 5];

  function polling() {
    return new Promise((resolve, reject) => {
      CRuntime.sendMessage(
        {
          location: document.location,
        },
        (rule) => {
          if (CRuntime.lastError && pollingTimes.length) {
            console.log('尝试第 ', x, ' 次');
            let x = pollingTimes.shift();
            setTimeout(polling, x * 1000);
          } else {
            resolve(rule);
          }
        }
      );
    })
  } 

  return new Promise((resolve, reject) => {
    polling().then(rule => {
      _this.locationRule = rule;
      resolve(rule);
    }).catch(err => {
      _this.messageInfoMap['error'] &&
      _this.messageInfoMap['error'](err);
    })
  });
};

// 工具函数
ContentScript.prototype.reLoad = function () {
  document.location.reload();
};

// 工具函数
ContentScript.prototype.sourcesGet = function () {
  return this.rePing();
};

const cScript = new ContentScript();
cScript.addListener();
cScript.ConscriptInit();
