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

function rePing() {
  chrome.runtime.sendMessage({
    location: document.location
  }, rule => {
    if(chrome.runtime.lastError) {
      setTimeout(ping, 1000);
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


// popup/background -> content-script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // logger
  if (request.error) {
    console.log('popup.error: ', request.error);
    rePing();
  } else if(request.success) {
    console.log('popup.success: ', request.success);
  } else if(request.info) {
    console.log('info', request);
  }
  // main 
  if (request.cmd === 'popup') {
    sendResponse(locationRule);
  }
  // Error: The message port closed before a response was received
  // Add this can reduce it
  return true;
});