var locationRule = null;

function ping() {
  chrome.runtime.sendMessage({
    location: document.location
  }, rule => {
    if(chrome.runtime.lastError) {
      setTimeout(ping, 1000);
    } else {
      change(rule);
    }
  });
}

function change(rule) {
  if (rule) {
    window.onload = function() {
      locationRule = rule;
      setTimeout(() => {
        // styles
        if (rule.styleRules.length) {
          const styleRules = rule.styleRules;
          styleRules.forEach(cv => {
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
        }
      }, 3000);
    }
  } else {
    console.log('not match');
  }
}

ping();


// 与 popup 通信
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.cmd === 'popup') {
    sendResponse(locationRule);
  }
});


