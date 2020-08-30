


/**
 * 全局变量
 */
let globalCurrentRule = null;




/**
 * untils 工具函数
 */
function sendMessage(message, callback) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  },function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, {}, function(response) {
      if (callback) {
        callback(response);
      }
    });
  });
}

function logger(type, log) {
  if(log){
    sendMessage({
      type: type,
      info: log
    })
  }
}

function matchKey(target, id) {
  for (const key in target) {
    // 递归匹配
    if (target[key] && typeof target[key] === "object") {
      matchKey(target[key], id);
    }
    // 开关控制
    if (target[key] == `${id}`) {
      target.on = !target.on;
    }
  }
}


function refreshRules() {
  const bgPage = chrome.extension.getBackgroundPage();
  bgPage.setNewRule(globalCurrentRule).then(response => {
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



/**
 * popup 页
 * 负责 popup 渲染展示
 */
function addEventListeners(parentNode) {
  // 开关切换事件
  const radioInputList = parentNode.querySelectorAll("label");
  radioInputList && radioInputList.forEach(cv => {
    cv.addEventListener("click", event => {
      const targetId = event.target.getAttribute("for").replace(/label/, "");
      matchKey(globalCurrentRule, targetId);
      render(globalCurrentRule);
    });
  });

  // 规则刷新事件
  const refreshBtn = parentNode.querySelector('.refreshBtn');
  refreshBtn && refreshBtn.addEventListener('click', () => {
    refreshRules();
  });

  // 规则增加事件
  const addRuleBtn = parentNode.querySelector('.addRuleBtn');
  addRuleBtn && addRuleBtn.addEventListener('click', () => {
    addRules();
  });
}

function render(currentRule) {
  const list = document.querySelector("#app");
  logger('info', currentRule);

  if (currentRule) {
    let styleRuleItem = "", styleItemValue = "", scriptRuleItem = "";
    let styleRules = '', scriptRules = '', title = '', help = '';
    // 样式规则
    currentRule.styleRules.forEach(cv => {
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
    currentRule.scriptRules.forEach(cv => {
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
  
    styleRules = styleRuleItem
      ? `
  <ul class="ruleList">
    <p>样式规则:</p>
    ${styleRuleItem}
  </ul>
  `
      : "";
  
    scriptRules = scriptRuleItem
      ? `
  <ul class="ruleList">
    <p>脚本规则:</p>
    ${scriptRuleItem}
  </ul>
  `
      : "";
  
    title = `
  <h3 class="ruleTitle">
    <span>当前域名: ${currentRule.hostname}</span>
    <div class="statusSwitch">
      <input class="switch" type="radio" name="label${currentRule.id}" id="label${currentRule.id}" checked="${currentRule.on}">
      <label class="${currentRule.on ? 'switchLabel switchCheckedLabel' : 'switchLabel'}" for="label${currentRule.id}"></label>
    </div>
  </h3>`;
  
    help = `
  <p><button class="addRuleBtn">添加规则</button></p>
  <p><button class="refreshBtn">刷新页面</button></p>
  `;
  
    list.innerHTML = title + styleRules + scriptRules + help;
  } else {
    list.innerHTML = `<p><button class="addRuleBtn">添加规则</button></p>`;
  }
  setTimeout(() => {
    addEventListeners(list);
  }, 10);
}

function popupInit() {
  sendMessage({
    popup: 'init',
  }, function(rule) {
    if (chrome.runtime.lastError) {
      logger('error', chrome.runtime.lastError.message);
    } else {
      if (rule) {
        globalCurrentRule = rule;
      }
      render(rule);
    }
  });
}

popupInit();

