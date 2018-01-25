# 摩斯密码

## 交付内容
一个可通过测试的`index.js`文件

## 时间规定
60分钟

## 语言规定
使用JavaScript实现

## 需求描述
创建一个以灯泡的亮灭来表示摩斯密码的发送器

### 摩斯密码基本规则
* 字符对应的代码在`codes.json`文件中
* 一个"·"的时间长度等价于1个基本的时间单位
* 一个"-"的时间长度等于3个时间单位
* 一个字母的每一个"·"和"-"之间有1个时间单位的间隔
* 同一单词的字母之间有3个时间单位的间隔
* 单词之间有7个时间单位的间隔

### 实例：以摩斯密码表示"so so"
```
字符:       's'       'o'     <space> 's'        'o'
填充:      vvvvv   vvvvvvvvvvv       vvvvv   vvvvvvvvvvv
灯泡状态:  101010001110111011100000001010100011101110111
```

### 发送器函数

发送器以一个函数表示，该函数接受一个options以及一个回调函数作为参数。该函数的基本使用方式如下：

```
const transmitter = require('./') // <- 你需要编写的内容

const codes = {s: '...', o: '---'};
const message = 'sos';
const timeouter = function(fn, ms) { setTimeout(fn, ms * 50); }; // 延时函数（50ms为一个基本时间单位）
const toggle = function() {
  lightbulb.toggle();
} // 灯泡开关

const options = {
  codes: codes,
  message: message,
  timeouter: timeouter,
  toggle: toggle
}

transmitter(options, function(err) {
  console.log('message sent!');
});
```

延时直接通过调用封装好的`timeouter`函数实现。例如可以，调用`timeouter(toggle, 1)`来表示"·"。


灯泡的开关记录在一个数组中，以字母"s"为例，发送器所产生的开关记录应为: `[0, 50, 100, 150, 200, 250]`




