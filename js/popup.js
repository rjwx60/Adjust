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
function logger(log) {
  if(log && typeof log !== 'object'){
    sendMessage({
      info: log
    });
  } else {
    sendMessage(log);
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
<p>添加规则</p>
<p>刷新页面</p>
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
      // logger(element.className);
    }
  }
}

function addListener(parentNode) {
  const radioInputList = parentNode.querySelectorAll("label");
  setTimeout(() => {
    radioInputList && radioInputList.forEach(cv => {
        cv.addEventListener("click", event => {
          const targetId = event.target.getAttribute("for").replace(/label/, "");
          // matchKey(currentTarget, targetId, cv.parentNode.children[0]);
          matchKey(currentTarget, targetId);
          createHTML();
        });
      });
  }, 100)
}

function refreshStatus() {
  console.log("存储并刷新页面");
  // 存储实现
}

function addRules() {
  console.log("跳转 background 页");
}

// main logic
sendMessage({ cmd: "popup" }, function(response) {
  if (chrome.runtime.lastError) {
    logger({ error: chrome.runtime.lastError.message });
  } else {
    if (response) {
      currentTarget = response;
      createHTML();
    }
  }
});
