// 默认交通方式
export const DEFALUT_TRAFFIC_MODE= 1

// 交通方式
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

export const GO_OR_BACK_SIGN= {
  GO: 1,
  BACK: 2,
  CENTER: 0
}

// TeamTrafficDTO
const TEAM_TRAFFIC_DTO= {
  // id
  // packageID
  trafficMode: DEFALUT_TRAFFIC_MODE,
  day: 1,
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