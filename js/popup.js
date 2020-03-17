function sendMessage(message) {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true
    },
    function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, message, {}, function(response) {
        if (chrome.runtime.lastError) {
          console.log("error:" + chrome.runtime.lastError);
        } else {
          if (response) {
            init(response.styleRules, response.scriptRules);
          }
        }
      });
    }
  );
}


function init(styleRules, scriptRules) {
  new Vue({
    el: '#list',
    template: `
    <ul class="rules" v-for="(item, listIndex) in list" :key="listIndex">
    <h3 class="ruleTitle">
      <span>当前域名：{{item.hostname}}</span>
      <div class="statusSwitch" v-if="item.on">
        <input class="switch" type="radio" :name="'label' + item.id" :id="'label' + item.id" v-model="item.on"  @click="changeStatus(item)">
        <label :for="'label' + item.id"></label>
      </div>
    </h3>
    <ul class="ruleList" v-if="item.styleRules.length">
      <p>Style规则：</p>
      <li class="ruleItem" v-for="(styleRules, index) in item.styleRules" :key="index"> 
        <ul class="valueList">
          <li class="vltitle">{{styleRules.target}}</li>
          <div class="vlvalue">
            <li v-for="valueItem in styleRules.valueArr">{{valueItem.key}}:{{valueItem.value}}</li>
          </div>
        </ul>
        <div class="valueSwitch">
          <input class="switch" type="radio" :name="'label' + index" :id="'label' + index" v-model="styleRules.on" @click="changeStatus(styleRules)">
          <label :for="'label' + index"></label>
        </div>
      </li>
    </ul>
    <ul class="ruleList" v-if="item.scriptRules.length">
      <p>Script规则：</p>
      <li class="ruleItem" v-for="(scriptRules, index) in item.scriptRules" :key="index"> 
        <ul class="valueList">
          <li class="vltitle">{{scriptRules.target}}</li>
          <div class="vlvalue">
            <li v-for="valueItem in scriptRules.valueArr">{{valueItem.key}}:{{valueItem.value}}</li>
          </div>
        </ul>
        <div class="valueSwitch">
          <input class="switch" type="radio" :name="'label' + index" :id="'label' + index" v-model="scriptRules.on" @click="changeStatus(scriptRules)">
          <label :for="'label' + index"></label>
        </div>
      </li>
    </ul>`,
    data: {
      styleRules: styleRules,
      scriptRules: scriptRules,
    },
    data() {
      return {
        hasChange: false,
        list:[{
          id: 123,
          hostname: 'mp.weixin.qq.com',
          urlparams: '',
          on: true,
          scriptRules: [],
          styleRules: [
            {
              only: true,
              target: '.qr_code_pc',
              excepetTarget: '',
              valueArr: [
                {
                  id: 1,
                  key: 'display',
                  value: 'none',
                }
              ],
              on: true
            },
            {
              only: true,
              target: '.rich_media_area_primary_inner',
              excepetTarget: '',
              valueArr: [
                {
                  id: 2,
                  key: 'maxWidth',
                  value: '1377px',
                }
              ],
              on: true
            }
          ]
        }]
      }
    },
    methods: {
      changeStatus(rule){
        this.hasChange = true;
        rule.on = rule.on ? false : true;
      },
      refreshStatus(){
        console.log('存储并刷新页面')
      },
      addRules(){
        console.log('跳转 background 页')
      }
    }
  });
}


sendMessage({ cmd: "popup" });
