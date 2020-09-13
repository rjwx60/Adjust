# ChromeExtension-Adjust

可根据自己的想法，来更改网页呈现样式，一旦添加成功则自动应用，适用于常用但样式布局不宜阅读的页面，比如：

- 电脑微信公众号文章用浏览器打开时的页面(段落间距、文章宽度修改)；
- 掘金文章页面(代码块宽度，广告栏，导航块样式修改)；
- .....







## 使用方法

将项目文件夹拖拽进 [chrome://extensions/](chrome://extensions/) 中即可







## 效果展示

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200911203121.png" style="zoom:40%;"/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200911203412.png" style="zoom:30%;"/>







## 问题与解决

- chrome.extension.getBackgroundPage 获取 undefined &下属方法获取 error：重加载插件或禁用 import 方式(background页)；

- popup 日志输出问题：曲线救国，通过事件通知 content-script 实现输出；

- background 内容页 import 形式 Error；在 webpack 配置中单独处理；

- 代码杂乱、通讯机制不明确，调试困难：使用原型模式、观察者模式、适配器模式等设计理念整合；

  





## 特别感谢

[小茗同学](https://www.cnblogs.com/liuxianan/p/chrome-plugin-develop.html)