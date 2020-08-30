/**
 * content-script - 常驻脚本
 */

var locationRule = null;

// popup/background -> content-script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // loggers
  switch(request.type) {
    case 'info':
      // loggers(request.type, request.info);
      console.log('request.type, request.info: ', request.type, request.info);
      break;
    case 'success':
      // loggers(request.type, request.success);
      console.log('request.type, request.success: ', request.type, request.success);
      break;
    case 'error':
      // loggers(request.type, request.error);
      console.log('request.type, request.error: ', request.type, request.error);
      rePing();
      break;
    case 'refresh':
      document.location.reload();
      break;
    default:
      break;
  }

  // popup logic
  if (request.popup) {
    rePing().then(response  => {
      sendResponse(response);
    })
  }

  // Error: The message port closed before a response was received
  // Add this can reduce it
  return true;
});

// function loggers (type, content = '', type = 1) {
//   switch(type) {
//     case 1: 
//       console.log(type, content)
//       break;
//     default:
//       break;
//   }
// }

function rePing() {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      location: document.location
    }, rule => {
      if(chrome.runtime.lastError) {
        setTimeout(ConscriptInit, 1000);
        reject()
      } else {
        locationRule = rule;
        resolve(rule);
      }
    });
  })
}

// 更改页面样式主逻辑
function changePageStructure(rule) {
  if (rule) {
    window.onload = function() {
      setTimeout(() => {
        // styles
        if (rule.styleRules.length) {
          const styleRules = rule.styleRules;
          rule.on && styleRules.forEach(cv => {
            // 是否单一节点
            if (cv.only) {
              const targetNode = document.querySelector(cv.target);
              targetNode && cv.on && cv.valueArr.forEach(cvv => {
                targetNode.style[cvv.key] = cvv.value;
              });
            } else {
              const targetNodeArr = document.querySelectorAll(cv.target);
              targetNodeArr && cv.on && cv.valueArr.forEach(cvv => {
                targetNodeArr.forEach(target => {
                  // 是否有排除项
                  if (!cv.excepetTarget) {
                    target.style[cvv.key] = cvv.value;
                  } else {
                    const regexp = new RegExp(cv.excepetTarget);
                    if(!(regexp.test(target.className))) {
                      target.style[cvv.key] = cvv.value;
                    }
                  }
                });
              });
            }
          });
        }
        // scripts
        if (rule.scriptRules.length) {
          const scriptRules = rule.scriptRules;
          rule.on && scriptRules.forEach(cv => {
            cv.on && cv.valueArr.forEach(cvv => {
              switch(cvv.type) {
                case 'file':
                  // loggers('script type is file');
                  break;
                case 'string':
                  eval(cvv.script);
                  break;
                default:
                  // loggers('script type is other type');
                  break;
              }
            })
          });
        }
      }, 3000);
    }
  } else {
    console.log('error', 'not match');
  }
}


function ConscriptInit() {
  chrome.runtime.sendMessage({
    location: document.location
  }, rule => {
    if(chrome.runtime.lastError) {
      setTimeout(ConscriptInit, 1000);
    } else {
      locationRule = rule;
      changePageStructure(locationRule);
    }
  });
}

// connect & refresh
ConscriptInit();

