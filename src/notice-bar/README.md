---
title: NoticeBar 公告栏
description: 在导航栏下方，用于给用户显示提示消息。
spline: notice-bar
isComponent: true
---

## 引入

全局引入，在 miniprogram 根目录下的`app.json`中配置，局部引入，在需要引入的页面或组件的`index.json`中配置。

```json
"usingComponents": {
  "t-notice-bar": "tdesign-miniprogram/notice-bar/notice-bar"
}
```

## 代码演示

### 基础静态公告栏
```html
 <t-notice-bar visible="{{true}}" left-icon="{{false}}" content="基础静态公告栏"></t-notice-bar>
```

### 带图标静态公告栏
```html
<t-notice-bar visible="{{true}}" content="带图标静态公告栏"></t-notice-bar>
```

### 带操作公告栏
```html
<t-notice-bar visible="{{true}}" mode="link" content="带link操作公告栏"></t-notice-bar>
<t-notice-bar visible="{{true}}" mode="closeable" showDetail binddetail="clickDetail" content="带关闭操作公告栏"></t-notice-bar>
```

### 滚动公告栏

```html
<t-notice-bar visible="{{true}}" left-icon="{{false}}" marquee="{{marquee}}" content="不带图标滚动公告栏"></t-notice-bar>
<t-notice-bar visible="{{true}}" marquee="{{marquee2}}" content="带图标滚动公告栏"></t-notice-bar>
```

### 自定义样式
 <t-notice-bar visible="{{true}}" leftIcon="sound" content="通过外部样式`t-class`自定义公告栏样式" t-class="t-class"></t-notice-bar>

### 不同状态的公告栏
公告栏类型有普通（info）、警示（warning）、成功（success）、错误（error）

#### 默认状态公告栏
```html
<t-notice-bar visible="{{true}}" content="默认状态公告栏"></t-notice-bar>
```

#### 警示状态公告栏
```html
<t-notice-bar visible="{{true}}" theme="warning" content="警示状态公告栏"></t-notice-bar>
```

#### 成功状态公告栏
```html
 <t-notice-bar visible="{{true}}" theme="success" content="成功状态公告栏"></t-notice-bar>
```

#### 错误状态公告栏
```html
<t-notice-bar visible="{{true}}" theme="error" content="错误状态公告栏"></t-notice-bar>
```

### 多行文字消息栏
```html
<t-notice-bar visible="{{true}}" left-icon="{{false}}" wrapable content="不带图标多行文字消息栏"></t-notice-bar>
<t-notice-bar visible="{{true}}" align="top" wrapable content="带图标多行文字消息栏"></t-notice-bar>
<t-notice-bar visible="{{true}}" align="top" mode="link" wrapable content="带link操作多行文字消息栏"></t-notice-bar>
<t-notice-bar visible="{{true}}" align="top" mode="closeable" wrapable content="带关闭操作多行文字消息栏"></t-notice-bar>
```

## API

### Message Props

| 名称 | 类型 | 默认值 | 说明 | 必传|
| -- | -- | -- | -- | -- |
| align    | String        | middle    | 内容的对齐方式，默认居中对齐。可选项：top/middle/bottom | N   |
| content  | String / Slot | -         | 用于自定义消息弹出内容  | N  |
| external-classes | Array | -         | 样式类名，分别用于设置 组件外层、消息内容、左侧图标、右侧图标等元素类名。`['t-class', 't-class-content', 't-class-left-icon','t-alcas-right-icon']` | N |
| leftIcon | String / Boolean / Slot | true | 消息提醒前面的图标。值为 true 则根据 theme 显示对应的图标，值为 false 则不显示图标。组件内置图标可参考`t-icon`,也可以完全自定义图标节点。| N   |
| marquee  | Boolean / Object        | false| 跑马灯效果。speed 指速度控制；loop 指循环播放次数，值为 -1 表示循环播放，值为 0 表示不循环播放；delay 表示延迟多久开始播放。| N       |
| theme    | String  | info | 消息组件风格。可选项：info/success/warning/error。| N |
| visible  | Boolean | false| 是否显示，隐藏时默认销毁组 | N   |
| z-index  | Number  | -    | 元素层级，样式默认为 5000  | N |

### Message Events

| 名称           | 参数 | 描述                                |
| ------------- | ---- | ---------------------------------- |
| close  | -    | 当`mode='coloseable'`时,用户点击关闭按钮触发  |
| detail | -    | 点击`详情`触发                              |
