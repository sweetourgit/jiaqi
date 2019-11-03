// 成本类型
export const SUPPLIER_TYPE_OPTIONS= [
  { value: 0, label: '船票' },
  { value: 1, label: '地接社' },
  { value: 2, label: '机票' },
  { value: 3, label: '拼票' },
  { value: 4, label: '酒店' },
  { value: 5, label: '签证' },
  { value: 6, label: '合作拼团社' },
  { value: 7, label: '邮轮' },
  { value: 8, label: '火车票' },
  { value: 9, label: '汽车票' },
]

export const getDayDTO= function(day){
  return {
    // 第几周
    weekNum: 0,
    // 周几
    weekDay: 0,
    // 显示的天
    day: day,
    // 是否是过时的信息
    after: false,
    // getDateInt
    dayInt: null,
    today: false,
    selected: false,
  }
}

// 库存状态
export const DAY_STATE= {
  UNDO: 0,  //无选
  MULTIPLE: -1, //多选
  SHARE: 1,
  NOT_SHARE: 2
}