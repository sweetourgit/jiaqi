import moment from 'moment'
//此文件主要用于转换数据字段名称
export default {
  //转换arrearsList格式 同业与直客的匹配金额列表字段都一样 但是字段名称不一样
  convertArrearsListForGroupTour(obj) {
    return {
      orderCode: obj.orderCode,
      proName: obj.title,
      groupCode: obj.groupCode,
      departure: obj.date,
      payable: obj.payable,
      arrears_Amount: obj.uncollectedMoney,
      audited_Amount: obj.audited,
      repayment_Amount: obj.collPrice,
    }
  },
  //转换游轮与跟团游的字段名称
  convertArrearsListForCruiseShip(obj) {
    return {
      orderCode: obj.order_code,
      proName: obj.product_name,
      groupCode: obj.tour_no,
      departure: new moment(new Date(obj.set_out_time), 'yyyy-MM-dd hh:mm:ss'),
      payable: obj.payable,
      arrears_Amount: obj.arrear_money,
      audited_Amount: obj.rec_money,
      repayment_Amount: obj.rec_money
    }
  }
}
