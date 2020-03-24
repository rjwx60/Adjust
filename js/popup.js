let currentTarget = null;

// 传递消息
function sendMessage(message, callback) {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true
    },
    function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, message, {}, function(response) {
        if (callback) {
          callback(response);
        }
      });
    }
  );
}

// 日志服务
function logger(type, log) {
  if(log){
    sendMessage({
      type: type,
      info: log
    })
  }
}

function createHTML() {
  let list = document.querySelector("#app");

  let styleRuleItem = "", styleItemValue = "", scriptRuleItem = "";

  // 样式规则
  currentTarget.styleRules.forEach(cv => {
    styleItemValue = "";
    cv.valueArr.forEach(cvv => {
      styleItemValue += `<li>${cvv.key}:${cvv.value}</li>`;
    });
    styleRuleItem += `
  <li class="ruleItem">
    <ul class="valueList">
      <li class="vltitle">${cv.target}</li>
      <div class="vlvalue">
        ${styleItemValue}
      </div>
    </ul>
    <div class="valueSwitch">
      <input class="switch" type="radio" name="label${cv.id}" id="label${cv.id}" checked="${cv.on}">
      <label class="${cv.on ? 'switchLabel switchCheckedLabel' : 'switchLabel'}" for="label${cv.id}"></label>
    </div>
  </li>
`;
  });

  // 脚本规则
  currentTarget.scriptRules.forEach(cv => {
    scriptRuleItem += `
  <li class="ruleItem">
    <ul class="valueList">
      <li class="vltitle">${cv.target}</li>
      <div class="vlvalue">
        ${scriptItemValue}
      </div>
    </ul>
    <div class="valueSwitch">
      <input class="switch" type="radio" name="label${cv.id}" id="label${cv.id}" checked="${cv.on}">
      <label class="${cv.on ? 'switchLabel switchCheckedLabel' : 'switchLabel'}" for="label${cv.id}"></label>
    </div>
  </li>
`;
  });

  let styleRules = styleRuleItem
    ? `
<ul class="ruleList">
  <p>样式规则:</p>
  ${styleRuleItem}
</ul>
`
    : "";

  let scriptRules = scriptRuleItem
    ? `
<ul class="ruleList">
  <p>脚本规则:</p>
  ${scriptRuleItem}
</ul>
`
    : "";

  let title = `
<h3 class="ruleTitle">
  <span>当前域名: ${currentTarget.hostname}</span>
  <div class="statusSwitch">
    <input class="switch" type="radio" name="label${currentTarget.id}" id="label${currentTarget.id}" checked="${currentTarget.on}">
    <label class="${currentTarget.on ? 'switchLabel switchCheckedLabel' : 'switchLabel'}" for="label${currentTarget.id}"></label>
  </div>
</h3>`;

  let help = `
<p><button class="addRuleBtn">添加规则</button></p>
<p><button class="refreshBtn">刷新页面</button></p>
`;

  list.innerHTML = title + styleRules + scriptRules + help;
  setTimeout(() => {
    addListener(list);
  }, 50);
}

function matchKey(target, id) {
  for (const key in target) {
    if (target[key] && typeof target[key] === "object") {
      matchKey(target[key], id);
    }
    if (target[key] == `${id}`) {
      target.on = !target.on;
      // target.on ? element.className = 'switchlabel switchlabelChecked' : element.className = 'switchlabel';
    }
  }
}

function addListener(parentNode) {
  // label events
  const radioInputList = parentNode.querySelectorAll("label");
  radioInputList && radioInputList.forEach(cv => {
    cv.addEventListener("click", event => {
      const targetId = event.target.getAttribute("for").replace(/label/, "");
      matchKey(currentTarget, targetId);
      createHTML();
    });
  });

  // refresh 
  const refreshBtn = parentNode.querySelector('.refreshBtn');
  refreshBtn && refreshBtn.addEventListener('click', () => {
    refreshStatus();
  });

  // addrule
  const addRuleBtn = parentNode.querySelector('.addRuleBtn');
  addRuleBtn && addRuleBtn.addEventListener('click', () => {
    addRules();
  });
}

function refreshStatus() {
  setCRXStorage().then(response => {
    if (!response.error) {
      logger('refresh', 'refresh current page')
    } else {
      logger('info', response);
    }
  })
}

function addRules() {
  window.open(chrome.extension.getURL('background.html'));
}

function setCRXStorage() {
  const bgPage = chrome.extension.getBackgroundPage();
  return bgPage.setStorage(currentTarget);
}

function popupInit() {
  sendMessage({
    popup: 'init',
  }, function(response) {
    if (chrome.runtime.lastError) {
      logger('error', chrome.runtime.lastError.message);
    } else {
      if (response) {
        currentTarget = response;
        createHTML();
      }
    }
  });
}

// main logic
popupInit();

