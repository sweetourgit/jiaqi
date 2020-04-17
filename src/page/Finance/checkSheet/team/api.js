import Vue from 'vue'
let { $http, GLOBAL, $message, $isArray }= Vue.prototype;

export const getCheckSheetList= function(conditions){
  console.log('conditions',conditions)
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/finance/checksheet/api/page", conditions)
    .then(res => {
      let { isSuccess, objects, total, result }= res.data;
      if(!isSuccess) {
        reject();
        throw ('获取报账单列表失败'+ (result.message || '') );
      }
      resolve({ objects, total });
    })
    .catch(err => {
      console.error(err);
	  // $message.error('网络延迟，稍后刷新');
      // err && $message.error(err.toString());
    })
  })
}

// 这个接口不知道是干啥用的，获取工作流？
export const getFlowName= function(){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + `/universal/supplier/api/dictionaryget?enumname=FlowModel`)
    .then(res => {
      let { isSuccess, objects, result }= res.data;
      if(!isSuccess) return reject(result.message || '获取工作流失败');
      let hit= objects.find(el => el.id=== 5);
      if(!hit) return reject('未找到对应工作流'); 
      resolve(hit.name);
    })
    .catch(err => {
      if(typeof err=== 'string') return $message.error(err);
    })
  })
}

/**
 * @description: 获取工作流中未完成的任务
 * @param {Object} payload: { userCode, startTime, endTime, startIndex, endIndex, workflowCode } 
 */
export const getFlowList= function(payload){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.jqUrl + '/JQ/GettingUnfinishedTasksForJQ', {
      ...payload
    })
    .then(res => {
      if(!$isArray(res.data)) return reject('获取工作流中未完成的任务失败');
      resolve(res.data);
    })
    .catch(err => {
      if(typeof err=== 'string') return $message.error(err);
    })
  })
}

/**
 * @description: 获取由我审批的报账单
 * @param {Array} guid: 由getFlowList得到的数组
 */
export const getMineCheckSheetList= function(guid){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/finance/checksheet/api/listforguid", { guid })
    .then(res => {
      let { isSuccess, objects, result }= res.data;
      if(!isSuccess) return reject('获取由我审批的报账单失败'+ (result.message || '') );
      resolve(objects);
    })
    .catch(err => {
      if(typeof err=== 'string') return $message.error(err);
    })
  })
}