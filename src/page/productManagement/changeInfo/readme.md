# 重写changeInfo，为了不修改router里的公用文件，故讲就代码转存changeInf

# 业务结构
跟团游包含基本信息、行程信息、费用说明、其他信息四块  
行程信息包含多个套餐  
套餐又包括交通信息、酒店信息、日程(schedule)信息 `注：接口文档中修改日程信息的接口标注的是修改行程日期 /team/api/teamschedulesave`

# 套餐
1. 添加了一个`provide`: PROVIDE_DAY，用来透传行程天数
2. 添加了一个`provide`: ERROR_QUEUE，用来汇总报错信息

## 默认信息（名称等）
1. 套餐名称与tab页有互动，注意套餐名重复的现象

## 交通信息
### 详细说明组件
1. trafficMode区分四种形态
2. 是否在创建时默认就给了两条traffic
3. 交通信息动态渲染组件需要绑定特殊key，否则会导致组件混淆，特殊key为`item.goOrBack+ '.'+ i`
4. 通过computed.goOrBackSign判断是去程1，回程2，还是中转0

## 酒店信息

## 日程信息