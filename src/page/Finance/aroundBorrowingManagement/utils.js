//2020-4-20 获取审批时间用
import Vue from 'vue'
import moment from 'moment'
let {
  $http,
  GLOBAL,
  $message,
  $isArray
} = Vue.prototype;
export const getApprovalTime= (jq_id,jQ_Type) =>{
    console.log('进入getApprovalTime')
    return new Promise((res,err) => {
        $http.post(GLOBAL.jqUrlZB + "/ZB/GetFinishedTasksNewTimeByJQIds", {
          "jQ_IDs": [jq_id],
          /**
           * jq_type:{无收入借款:1,预付款管理：2,  余额支付借款:3}
           */
          "jQ_Type": jQ_Type 
        }, ).then(response =>{
            // console.log('获取工作流res',new moment(response.data.list[0].finishTime).format('YYYY-MM-DD h:mm:ss'))
            res(new moment(response.data.list[0].finishTime).format('YYYY-MM-DD h:mm:ss'))
           })
       })
    }