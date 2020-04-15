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

export const getCabinDTO= function(skuPrice){

  let cabin= {
    cabin_type: CABIN_SPLIT_TYPE.PART,
    adult_price: 0,
    adult_num: 0,
    // 房间数
    room_num: 0,
    full: 0,
    guests: []
  }
  
  Object.defineProperty(cabin, 'sku_price', {
    value: skuPrice,
    enumerable: false,
    configurable: false
  })

  /**
   * @description: 整间报名下,该舱房报名信息是否可下单
   * 小于0: 需增加min_stay 大于0: 需减少short 
   */
  Object.defineProperty(cabin, 'short', {
    value: 0,
    enumerable: false,
    configurable: false,
    writable: true
  })

  Object.defineProperty(cabin, 'initGuests', {
    value: function({cabin_type}){
      cabin.cabin_type= cabin_type;
      for(
        let i=0; 
          // 判断是整间还是拼房, 拼房最少1人, 整租最少min_stay
          i< (cabin_type=== CABIN_SPLIT_TYPE.PART? 1: skuPrice.min_stay);
            i++
      ) cabin.guests.push(getCabinGuestDTO(skuPrice));
      return cabin;
    },
    enumerable: false,
    configurable: false
  })
  
  return cabin;
}

export const getCabinGuestDTO= function(skuPrice= {}){

  let guest= {
    sku_price_id: skuPrice.id,
    cabin_id: skuPrice.cabin_id,
    //name: Math.random() > 0.5? '123': '',
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
      return guest.name || guest.passport || guest.tel || guest.id_card
    },
    enumerable: false,
    configurable: false
  })

  return guest;
}