// 获取供应商原型
export const getSupplierDTO= function(){
  return {
    id: 0,
    createTime: null,	// integer($int64)
    // code
    isDeleted: 0,
    userState: 1, // 角色的数据状态 0等待审核 1正常 2停用
    name: null,
    types: [],
    productDirection: null,
    isMonthly: null,
    isAgree: null,
    companyArea: null,
    productArea: null,
    leader: null,
    phone: null,
    legalPerson: null,
    handPerson: null,
    handPhone: null,
    billName:	null,
    taxNumber: null,
    expireTime: null,	// string($date-time)
    memo: null,
    banks: [],
    files: [],
    createUser: null,
    orgs: [],
    supplierCode: null,
    alias: [],
    manageType: null
  }
}