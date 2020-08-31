---
typora-root-url: ../01
---

## ChromeExtension-Adjust

可根据自己的想法，来更改网页呈现样式，一旦添加则自动应用



### 使用方法

将项目文件夹拖拽进 [chrome://extensions/](chrome://extensions/) 中即可



### 效果展示

<img src="/source/images/popup.png" style="zoom:40%;" align="left"/>

<img src="/source/images/background.png" style="zoom:30%;" align="left"/>



### 问题与解决

- chrome.extension.getBackgroundPage() undefined 或旗下方法获取 undefined；重加载或禁用 import 方式
- popup 日志输出问题；曲线救国，通过事件通知 content-script 实现输出；
- background import 形式 Error；配置 webpack 单独处理；

https://developer.chrome.com/extensions/extension

https://stackoverflow.com/questions/21146457/chrome-extension-getbackgroundpage-function-example

https://stackoverflow.com/questions/48104433/how-to-import-es6-modules-in-content-script-for-chrome-extension

https://stackoverflow.com/questions/58480046/cannot-use-import-statement-outside-a-module-when-importing-a-const-from-another?noredirect=1&lq=1



### 特别感谢

[小茗同学](https://www.cnblogs.com/liuxianan/p/chrome-plugin-develop.html)