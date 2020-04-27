export const CODE_PREFIX= "LKCO";
export const CODE_SUFFIX= "US621";

export const PRODUCT_LIST_ROUTE= '/productList/packageTour';

export const DEFALUT_TRAFFIC_MODE= 1

export const TRAFFIC_MODE_OPTIONS= [{
  value: 1,
  label: '飞机'
}, {
  value: 2,
  label: '火车',
}, {
  value: 3,
  label: '汽车',
}, {
  value: 4,
  label: '轮船',
}]

export const ARRIVE_DAY_OPTIONS= [{
  value: -2,
  label: '前天'
},{
  value: -1,
  label: '昨天',
}, {
  value: 0,
  label: '当日',
},{
  value: 1,
  label: '明天',
}, {
  value: 2,
  label: '后天',
}, {
  value: 3,
  label: '第三天',
}, {
  value: 4,
  label: '第四天',
}, {
  value: 5,
  label: '第五天',
}, {
  value: 6,
  label: '第六天',
}, ]


export const GO_OR_BACK_SIGN= {
  GO: 1,
  BACK: 2,
  CENTER: 0
}

const TEAM_TRAFFIC_DTO= {

  trafficMode: DEFALUT_TRAFFIC_MODE,
  day: 1,
  arriveDay: 0,
  arriveCity: "",
  arrivePlace: "",
  arriveTime: "",
  company: "",
  ext_Stopover: "[]",
  pod: "",
  podCity: "",
  podPlace: "",
  podTime: "",
  theNumber: "",
}
export const TEAM_TRAFFIC_DTO_GO= Object.assign({
  goOrBack: GO_OR_BACK_SIGN.GO
}, TEAM_TRAFFIC_DTO)
export const TEAM_TRAFFIC_DTO_BACK= Object.assign({
  goOrBack: GO_OR_BACK_SIGN.BACK
}, TEAM_TRAFFIC_DTO)

export const getActivityDTO= function(scheduleID){
  return {
    scheduleID,
    activityType: 0,
    time: 0,
    name: '',
    details: '',
    typeExt: '',
    picture: '[]',
    memo: '',
    code: '',
    createTime: new Date().toISOString()
  }
}

export const getTeamScheduleDTOList= function(days){
  let result= [];
  for(let i= 1; i<= days; i++){
    result.push(getTeamScheduleDTO(i))
  }
  return result;
}

export const getTeamScheduleDTO= function(day){
  return {
    day,
    subject: '',
    info: '',
    ext_Hotel: '{"IsHotel":0,"Details":""}',
    ext_Meals: '[{"Myself":0,"Detail":""},{"Myself":0,"Detail":""},{"Myself":0,"Detail":""}]',
    activitys: [],
    createTime: new Date().toISOString(),
    code: "" 
  }
}
