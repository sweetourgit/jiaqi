// 获取参团游原型
export const getTeamProDTO= function(){
  return {
    title: '',
    isForeign: 1,
    day: null,
    night: null,
    pods: [],
    destinations: [],
    confirmType: 0,
    // 亮点词
    strengths: [],
    // 运营标签
    label: [],
    pictureID: null,
    vedioID: null,
    pepeatpic: [],
    crowdID: null,
    themeID: null,
    advanceDay: null,
    mark: '',
    instructions: [],
    others: [],
    
    /**
     * @description: 不在表单中的项 
     */
    // 产品的状态 0未选择 1等待审核 2正常/已审核 3停用
    proStat: 1,
    createTime: Date.now(),
    createUser:sessionStorage.getItem('userCode'),
    loadPackage: true,
    isDeleted: 0,
    // 接口获取
    guid: null,
  }
}