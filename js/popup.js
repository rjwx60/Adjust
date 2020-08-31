/**
 * popup 弹出页
 */

import '../css/popup.scss'
import { CRuntime } from './chromeAPI';

function Popup() {
  this.currentRule = null;
}

Popup.prototype.popupInit = function() {
  const _this = this;
  this.popupSendMes({
    popup: 'init',
  }, function(rule) {
    if (CRuntime.lastError) {
      _this.utils().logger('error', CRuntime.lastError.message);
    } else {
      _this.currentRule = rule ? rule : null;
      _this.render(rule);
    }
  });
}

Popup.prototype.popupSendMes = function(mes, currentPopupCb = () => {}) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, mes, {}, function(response) {
      currentPopupCb(response);
    });
  });
}

Popup.prototype.addEventListeners = function (parentNode) {
  // 1、开关切换事件
  const radioInputList = parentNode.querySelectorAll("label");
  radioInputList && radioInputList.forEach(cv => {
    cv.addEventListener("click", event => {
      const targetId = event.target.getAttribute("for").replace(/label/, "");
      this.utils().matchKey(this.currentRule, targetId);
      this.render(this.currentRule);
    });
  });

  // 2、规则增加事件
  const addRuleBtn = parentNode.querySelector('.addRuleBtn');
  addRuleBtn && addRuleBtn.addEventListener('click', () => {
    this.addRules();
  });

  // 3、规则刷新事件
  const refreshBtn = parentNode.querySelector('.refreshBtn');
  refreshBtn && refreshBtn.addEventListener('click', () => {
    this.refreshRules();
  });
}

Popup.prototype.refreshRules = function () {
  const bgPage = chrome.extension.getBackgroundPage();
  const bgInstance = bgPage.GetBgInstance();
  // 异步操作需要等待否则获取不到
  setTimeout(() => {
    // 通知 background 存储后刷新页面
    bgInstance && bgInstance.setNewRule(this.currentRule).then(response => {
      if (!response.error) {
        this.utils().logger('refresh', 'refresh current page');
      } else {
        this.utils().logger('info', response);
      }
    }).finally(() => {
      // 通知 contentScript 刷新 tab 页
      this.utils().logger('refresh', 'refresh current page', () => {
        // 刷新 popup 页面
        document.location.reload();
      });
    })
  }, 500)
  
}

Popup.prototype.addRules = function () {
  window.open(chrome.extension.getURL('background.html'));
}

Popup.prototype.render = function(currentRule) {
  const list = document.querySelector("#app");

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
    <ul class="helpText">
      <li><button class="addRuleBtn">添加规则</button></li>
      <li><button class="refreshBtn">刷新页面</button></li>
    </ul>
  `;
  
    // 最终组装
    list.innerHTML = title + styleRules + scriptRules + help;
    
  } else {
    list.innerHTML = `<ul class="helpText">
    <li><button class="addRuleBtn">添加规则</button></li>
  </ul>`;
  }

  setTimeout(() => {
    this.addEventListeners(list);
  }, 1000);
}

Popup.prototype.utils = function() {
  return {
    logger: (type, log, currentPopupCb) => log && this.popupSendMes({ type, log}, currentPopupCb),
    matchKey: (target, id) => {
      for (const key in target) {
        // 递归匹配
        if (target[key] && typeof target[key] === "object") {
          this.utils().matchKey(target[key], id);
        }
        // 开关控制
        if (target[key] == `${id}`) {
          target.on = !target.on;
        }
      }
    }
  }
}

const popup = new Popup();
popup.popupInit();



