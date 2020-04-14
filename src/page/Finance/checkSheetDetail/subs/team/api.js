import Vue from 'vue'
import * as utils from '@/page/Finance/bankStatement/utils.js'
let {
  $http,
  GLOBAL,
  $message,
  $isArray
} = Vue.prototype;
let DATA4D = utils.getSession4D()
// 获取未报账的报账单
export const getPreCheckSheetByPlanID = function(id,productType) {
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/finance/checksheet/api/getforother", {
        id,
        productType
      })
      .then(res => {
        let {
          isSuccess,
          object,
          result
        } = res.data;
        if (!isSuccess) return reject('获取报账信息失败' + (result.message || ''));
        resolve(object);
      })
      .catch(err => {
        if (typeof err === 'string') return $message.error(err);
      })
  })
}
//游轮先通过PHP接口获取产品信息 再获取getPreCheckSheetByPlanID信息
 export const getBatchplaninfos=function(planID){
  return new Promise((res,rej)=>{
    $http.post(GLOBAL.serverSrcYL+'/linerapi/v1/sku/sku-plan/batchplaninfos',{
      plan_id:planID
    }).then(response=>{
      if(response.data.message=='OK'){
          res(response.data.data)
      }else{
       $message.error(response.data.message);
       res(false)
      }

    })
  })
}
// 获取已报账的报账单
export const getCheckSheetByPlanID = function(id,productType) {

  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/finance/checksheet/api/getforplan", {
        id,
		productType
      })
      .then(res => {
        let {
          isSuccess,
          object,
          result
        } = res.data;
        if (!isSuccess) return reject('获取报账信息失败' + (result.message || ''));
        resolve(object);
      })
      .catch(err => {
        if (typeof err === 'string') return $message.error(err);
      })
  })
}

export const getCheckSheetByID = function(id) {
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/finance/checksheet/api/get", {
        id
      })
      .then(res => {
        let {
          isSuccess,
          object,
          result
        } = res.data;
        if (!isSuccess) return reject('获取报账信息失败' + (result.message || ''));
        resolve(object);
      })
      .catch(err => {
        if (typeof err === 'string') return $message.error(err);
      })
  })
}

export const postCheckSheet = function(object) {
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/finance/checksheet/api/insert", {
        object
      })
      .then(res => {
        let {
          isSuccess
        } = res.data;
        if (!isSuccess) throw '新增报账信息失败';
        resolve(object);
      })
      .catch(err => {
        if (typeof err === 'string') return $message.error(err);
      })
  })
}
export const updplanstatus = function(planID,status) {
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrcYL + "/linerapi/v1/sku/sku-plan/updplanstatus", {
        plan_id:planID,
        bill_status:status
      })
      .then(res => {
        let {
          message
        } = res.data;
        console.log('message',res)
        if (message!='OK') {
           resolve(false)
        return $message.error(message);
              }
        resolve(true)
      })
      .catch(err => {
        if (typeof err === 'string') return $message.error(err);
      })
  })
}

// 模糊查询供应商
export const getSupplierlist = function(object) {
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/universal/supplier/api/supplierlist", {
      object
    }).then((res) => {
      let {
        isSuccess,
        objects
      } = res.data;
      if (!isSuccess) return reject('模糊查询供应商失败');
      return resolve(objects);
    }).catch((err) => {
      reject(err);
    })
  })
}

export const agreeForJQ = function(object) {
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.jqUrl + '/JQ/SubmitWorkAssignmentsForJQ', { ...object
    }).then((res) => {
      let {
        code
      } = JSON.parse(res.data);
      if (code !== 0) throw '通过审批失败';
      return resolve();
    }).catch((err) => {
      reject(err);
    })
  })
}

export const rejectForJQ = function(object) {
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.jqUrl + '/JQ/RejectionOfWorkTasksForJQ', { ...object
    }).then((res) => {
      let {
        code
      } = JSON.parse(res.data);
      if (code !== 0) throw '驳回审批失败';
      return resolve();
    }).catch((err) => {
      reject(err);
    })
  })
}

export const endForJQ = function(object) {
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.jqUrl + '/JQ/EndProcess', { ...object
    }).then((res) => {
      let {
        code
      } = JSON.parse(res.data);
      if (code !== 0) throw '驳回审批失败';
      return resolve();
    }).catch((err) => {
      reject(err);
    })
  })
}

export const saveChcektype = function(object) {
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + '/finance/checksheet/api/savechecktype', {
      object
    }).then((res) => {
      let {
        isSuccess
      } = res.data;
      if (!isSuccess) throw '驳回审批失败';
      return resolve();
    }).catch((err) => {
      reject(err);
    })
  })
}

export const getFlowFinishedList = function(jq_id) {
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.jqUrl + '/JQ/GetWorkItemFinishedList', {
      jq_id,
      jq_Type: 5
    }).then((res) => {
      let {
        statusText,
        data
      } = res;
      if (statusText !== "OK") throw '获取审批列表失败';
      return resolve(data);
    }).catch((err) => {
      reject(err);
    })
  })
}
//获取草稿单列表
export const getDraftList = function() {
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + '/draft/tsa/api/list', {
      userid: DATA4D.userID
    }).then(res => {
      resolve(res)
    }).catch(ref => {
      reject(ref)
    })
  })
}
//储存草稿单
export const saveDraft = function(data) {
  return new Promise((resolve, reject) => {
    data = JSON.stringify(data)
    $http.post(GLOBAL.serverSrc + '/draft/tsa/api/insert', {
      object: {
        userID: DATA4D.userID,
        data
      }

    }).then((res) => {
      let {
        statusText,
        data
      } = res;
      return resolve(data);
    }).catch((err) => {
      reject(err);
    })
  })
}
//删除草稿单
export const deleteDraft = function(guid) {
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + '/draft/tsa/api/delete', {
      userid: DATA4D.userID,
      guid
    }).then((res) => {

      return resolve(res.data);
    }).catch((err) => {
      reject(err);
    })
  })
}
