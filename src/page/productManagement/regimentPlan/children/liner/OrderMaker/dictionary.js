import { dictionaryMaker } from '@/js/utils'

export const ENROLL_TYPE= dictionaryMaker({
  ADULT: { label: '成人', value: 1 }
})

export const CABIN_SPLIT_TYPE= dictionaryMaker({
  ALL: { label: '整间', value: 1 },
  PART: { label: '拼住', value: 2 }
})

export const REFUND_STATUS= dictionaryMaker({
  ING: { label: '退款中', value: 1 },
  REFUSE: { label: '拒绝退款', value: 2 },
  DONE: { label: '已退款', value: 3 },
  NONE: { label: '无退款', value: 4 },
  APPLY: { label: '申请退款', value: 5 },
  SUCCESS: { label: '完成退款', value: 6 },
})

export const getSkuPriceDTO= function(){

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

export const getCabinDTO= function(skuPrice, fillGuests){

  let cabin= {
    cabin_type: CABIN_SPLIT_TYPE.PART,
    adult_price: 0,
    adult_num: 0,
    // 房间数
    room_num: 0,
    full: 0,
    guests: []
  }

  for(let i=0; i< (fillGuests? skuPrice.min_stay: 0); i++) cabin.guests.push(getCabinGuestDTO(skuPrice));
  
  Object.defineProperty(cabin, 'sku_price', {
    value: skuPrice,
    enumerable: false,
    configurable: false
  })
  
  return cabin;
}

export const getCabinGuestDTO= function(skuPrice= {}){

  let guest= {
    sku_price_id: skuPrice.id,
    cabin_id: skuPrice.cabin_id,
    name: '',
    enroll_type: ENROLL_TYPE.ADULT,
    passport: '',
    tel: '',
    id_card: '',
    sex: '',
    refund_status: 0
  }

  Object.defineProperty(guest, 'isFilled', {
    value: function(){
      return this.name || this.passport || this.tel || this.id_card
    }.bind(guest),
    enumerable: false,
    configurable: false
  })

  return guest;
}