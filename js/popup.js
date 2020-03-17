function sendMessage(message, callback) {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true
    },
    function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, message, {}, function(response){
        if (callback) {
          callback(response);
        }
      });
    }
  );
}

function logger(log){
  sendMessage(log);
}

function init(styleRules, scriptRules) {
  console.log('styleRules: ', styleRules);
}

sendMessage({ cmd: "popup" }, function(response) {
  if (chrome.runtime.lastError) {
    logger({ error: chrome.runtime.lastError.message })
  } else {
    logger({ success: response })
    if (response) {
      init(response.styleRules, response.scriptRules);
    }
  }
});


