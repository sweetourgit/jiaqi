
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
    weekNum: 0,
    weekDay: 0,
    day: day,
    date: null,
    after: false,
    dayInt: null,
    today: false,
    selected: false,
    savingState: 'normal'
  }
}

export const DAY_STATE= {
  UNDO: 0,  
  MULTIPLE: -1, 
  SHARE: 1,
  NOT_SHARE: 2
}