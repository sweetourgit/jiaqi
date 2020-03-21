import { dictionaryMaker } from '@/js/utils'

// SKU编辑进度
export const SKU_PROCESS_STATUS = dictionaryMaker({
  UN_INITED: { label: '修改', value: 1 },
  CAN_PRICE: { label: '价格', value: 2 },
  CAN_LINE: { label: '上线', value: 3 }
})

export const SKU_LINI_STATUS = dictionaryMaker({
  UP_LINE: { label: '上线', value: 1 },
  DOWN_LINE: { label: '下线', value: 2 }
})

// SKU清位时间
export const CLEARANCE_TIME_OPTIONS= [{label: '出发前一天', value: 1}, {label: '出发当天', value: 2}, {label: '出发第二天', value: 3}]

// 库存状态
export const SKU_PLAN_STATUS= dictionaryMaker({
  UNDO: { label: '无选', value: 0},
  MULTIPLE: { label: '多选', value: -1},
  SHARE: { label: '共享', value: 1},
  NOT_SHARE: { label: '非共享', value: 2},
})

export const getSkuPlanDTO= function(payload){
  let { product_id, sku_id }= payload;
  return {
    set_out_year: '',
    set_out_month: '',
    set_out_day: '',
    reserved_time: 24,
    sku_plan_deliver: [],
    sku_plan_insure: [],
    sku_price: []
  }
}

export const getSkuPriceDTO= function(payload){
  return {
    cabin_id: null,
    title: '',
    min_stay: null,
    max_stay: null,
    stock: null,
    adult_same_price: null,
    adult_straight_price: null,
    line_status: 1
  }
}