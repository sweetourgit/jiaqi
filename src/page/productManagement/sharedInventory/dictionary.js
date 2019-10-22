export const getDayDTO= function(){
  return {
    // 显示的天
    day: null,
    // 是否是过时的信息
    previous: false,
    // getDateInt
    dayInt: null,
    // 有多少共享库存
    count: 0,
    today: false,
    children: null
  }
}