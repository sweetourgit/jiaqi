import Vue from 'vue'
let { $http, GLOBAL, $message, $isArray } = Vue.prototype;

// 获取未报账的报账单
export const getPreCheckSheetByPlanID = function (id) {
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/finance/checksheet/api/getforother", { id })
      .then(res => {
        let { isSuccess, object, result } = res.data;
        if (!isSuccess) return reject('获取报账信息失败' + (result.message || ''));
        resolve(object);
      })
      .catch(err => {
        if (typeof err === 'string') return $message.error(err);
      })
  })
}

// 获取已报账的报账单
export const getCheckSheetByPlanID = function (id) {
  
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/finance/checksheet/api/getforplan", { id })
      .then(res => {
        let { isSuccess, object, result } = res.data;
        if (!isSuccess) return reject('获取报账信息失败' + (result.message || ''));
        resolve(object);
      })
      .catch(err => {
        if (typeof err === 'string') return $message.error(err);
      })
  })
}

export const getCheckSheetByID = function (id) {
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/finance/checksheet/api/get", { id })
      .then(res => {
        let { isSuccess, object, result } = res.data;
        if (!isSuccess) return reject('获取报账信息失败' + (result.message || ''));
        resolve(object);
      })
      .catch(err => {
        if (typeof err === 'string') return $message.error(err);
      })
  })
}

export const postCheckSheet = function (object) {
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/finance/checksheet/api/insert", {
      object
    })
      .then(res => {
        let { isSuccess } = res.data;
        if (!isSuccess) throw '新增报账信息失败';
        resolve(object);
      })
      .catch(err => {
        if (typeof err === 'string') return $message.error(err);
      })
  })
}


// 模糊查询供应商
export const getSupplierlist = function (object) {
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/universal/supplier/api/supplierlist", {
      object
    }).then((res) => {
      let { isSuccess, objects } = res.data;
      if (!isSuccess) return reject('模糊查询供应商失败');
      return resolve(objects);
    }).catch((err) => {
      reject(err);
    })
  })
}

export const agreeForJQ = function (object) {
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.jqUrl + '/JQ/SubmitWorkAssignmentsForJQ',
      { ...object }
    ).then((res) => {
      let { code } = JSON.parse(res.data);
      if (code !== 0) throw '通过审批失败';
      return resolve();
    }).catch((err) => {
      reject(err);
    })
  })
}

export const rejectForJQ = function (object) {
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.jqUrl + '/JQ/RejectionOfWorkTasksForJQ',
      { ...object }
    ).then((res) => {
      let { code } = JSON.parse(res.data);
      if (code !== 0) throw '驳回审批失败';
      return resolve();
    }).catch((err) => {
      reject(err);
    })
  })
}

export const endForJQ = function (object) {
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.jqUrl + '/JQ/EndProcess',
      { ...object }
    ).then((res) => {
      let { code } = JSON.parse(res.data);
      if (code !== 0) throw '驳回审批失败';
      return resolve();
    }).catch((err) => {
      reject(err);
    })
  })
}

export const saveChcektype = function (object) {
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + '/finance/checksheet/api/savechecktype',
      { object }
    ).then((res) => {
      let { isSuccess } = res.data;
      if (!isSuccess) throw '驳回审批失败';
      return resolve();
    }).catch((err) => {
      reject(err);
    })
  })
}

export const getFlowFinishedList = function (jq_id) {
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.jqUrl + '/JQ/GetWorkItemFinishedList',
      {
        jq_id, jq_Type: 5
      }
    ).then((res) => {
      let { statusText, data } = res;
      if (statusText !== "OK") throw '获取审批列表失败';
      return resolve(data);
    }).catch((err) => {
      reject(err);
    })
  })
}

export const upLoadDraft = function (userID, guid, data, vm) {
  
  const loading = vm.$loading({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  });
  // setTimeout(() => {
  //   loading.close();
  // }, 2000);
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + '/draft/tsa/api/insert',
      {
        userID,
        guid,
        data
      }
    ).then((res) => {
     
      let { statusText, data } = res;
      loading.close();
      return resolve(data);
    }).catch((err) => {
      loading.close();
      reject(err);
    })
  })
}
export const deleteDraft = function () {
  const loading = vm.$loading({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  });
}