var locationRule = null;

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
        }
      }, 3000);
    }
  } else {
    console.log('not match');
  }
}

// connect & refresh
ConscriptInit();

// popup/background -> content-script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // logger
  switch(request.type) {
    case 'info':
      console.log('info', request.info);
      break;
    case 'success':
      console.log('popup.success: ', request.success);
      break;
    case 'error':
      console.log('popup.error: ', request.error);
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